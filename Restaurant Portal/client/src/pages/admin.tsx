import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/layout';
import { User, Shield, Database, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

export default function Admin() {
  const { toast } = useToast();
  const { data: users, isLoading } = useQuery<any[]>({
    queryKey: ['/api/users'],
  });

  // IDOR vulnerability - allows accessing any user profile by encoded reference
  const handleViewUserDetails = async (userId: string) => {
    try {
      // Encode user ID for "security" (actually makes it more exploitable)
      const encodedUserId = Buffer.from(userId).toString('base64');
      const response = await apiRequest('GET', `/api/user/profile/${encodedUserId}`);
      const userData = await response.json();
      
      if (userData.flag) {
        toast({
          title: 'Admin Access Granted!',
          description: `Security Token: ${userData.flag}`,
        });
        
        // Show detailed admin data
        alert(`Admin Access Granted!\n\nUser Details:\nID: ${userData.id}\nName: ${userData.name}\nEmail: ${userData.email}\nRole: ${userData.role}\n\nSecurity Token: ${userData.flag}\n\nLast Login: ${userData.lastLogin}`);
        
        console.log('IDOR Profile Access Vulnerability Exploited!');
        console.log('Admin profile accessed:', userData);
        console.log('Hint: Try encoding different user identifiers in base64...');
      } else {
        toast({
          title: 'Access Denied',
          description: userData.message || 'Profile access restricted',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to fetch user details',
        variant: 'destructive',
      });
    }
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Admin Panel</h2>
          <p className="text-muted-foreground">System administration and user management.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card data-testid="card-system-users">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>System Users</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isLoading ? (
                  <p className="text-muted-foreground">Loading users...</p>
                ) : users?.length ? (
                  users.map((user: any) => (
                    <div key={user.id} className="flex items-center justify-between p-3 hover:bg-muted rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 ${user.isAdmin ? 'bg-primary' : 'bg-secondary'} rounded-full flex items-center justify-center`}>
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground" data-testid={`text-user-name-${user.id}`}>
                            {user.fullName}
                          </h4>
                          <p className="text-xs text-muted-foreground" data-testid={`text-user-email-${user.id}`}>
                            {user.email}
                          </p>
                          <Badge variant={user.isAdmin ? 'default' : 'secondary'} className="text-xs mt-1">
                            {user.role}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewUserDetails(user.id)}
                        data-testid={`button-view-details-${user.id}`}
                      >
                        View Details
                      </Button>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No users found</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card data-testid="card-system-info">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>System Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Version:</span>
                  <span className="font-medium text-foreground">v2.4.1</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Database:</span>
                  <Badge variant="default" className="text-accent bg-accent/10">
                    Connected
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Last Backup:</span>
                  <span className="font-medium text-foreground">Today 3:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Active Sessions:</span>
                  <span className="font-medium text-foreground">12</span>
                </div>
              </div>
              
              <div className="border-t border-border my-4" />
              
              <div className="space-y-2">
                <Button className="w-full" data-testid="button-backup-database">
                  <Database className="h-4 w-4 mr-2" />
                  Backup Database
                </Button>
                <Button variant="outline" className="w-full" data-testid="button-view-logs">
                  <Activity className="h-4 w-4 mr-2" />
                  View Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Security Notice</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                This admin panel provides access to sensitive system information. 
                Try accessing user details by ID to test administrative privileges.
              </p>
              <p className="text-xs text-muted-foreground">
                Hint: Admin users typically have ID 1. System users are incrementally numbered.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
