import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Layout } from '@/components/layout/layout';
import { DollarSign, Receipt, Users, TrendingUp, Utensils, Pizza, Sandwich } from 'lucide-react';

export default function Dashboard() {
  const { data: orders, isLoading } = useQuery<any[]>({
    queryKey: ['/api/orders'],
  });

  const stats = {
    revenue: '$2,847',
    orders: 142,
    activeTables: '18/24',
    staffOnline: 12
  };

  return (
    <Layout>
      <div className="p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Dashboard</h2>
          <p className="text-muted-foreground">Welcome back! Here's what's happening at your restaurant today.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card data-testid="card-revenue">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Today's Revenue</p>
                  <h3 className="text-2xl font-bold text-foreground">{stats.revenue}</h3>
                  <p className="text-sm text-accent mt-1">
                    <TrendingUp className="h-3 w-3 inline mr-1" /> +12.5%
                  </p>
                </div>
                <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                  <DollarSign className="h-6 w-6 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card data-testid="card-orders">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Orders</p>
                  <h3 className="text-2xl font-bold text-foreground">{stats.orders}</h3>
                  <p className="text-sm text-accent mt-1">
                    <TrendingUp className="h-3 w-3 inline mr-1" /> +8.2%
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center">
                  <Receipt className="h-6 w-6 text-secondary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card data-testid="card-tables">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Active Tables</p>
                  <h3 className="text-2xl font-bold text-foreground">{stats.activeTables}</h3>
                  <p className="text-sm text-muted-foreground mt-1">75% occupancy</p>
                </div>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Utensils className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card data-testid="card-staff">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Staff Online</p>
                  <h3 className="text-2xl font-bold text-foreground">{stats.staffOnline}</h3>
                  <p className="text-sm text-accent mt-1">All shifts covered</p>
                </div>
                <div className="w-12 h-12 bg-muted/20 rounded-lg flex items-center justify-center">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Orders & Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2" data-testid="card-recent-orders">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Orders</CardTitle>
                <Button variant="outline" size="sm" data-testid="button-view-all-orders">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <p className="text-muted-foreground">Loading orders...</p>
                ) : orders?.length ? (
                  orders.slice(0, 3).map((order: any) => (
                    <div key={order.id} className="flex items-center space-x-4 p-3 hover:bg-muted rounded-lg">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        {order.items.includes('Pizza') ? (
                          <Pizza className="h-5 w-5 text-secondary" />
                        ) : order.items.includes('Burger') ? (
                          <Sandwich className="h-5 w-5 text-secondary" />
                        ) : (
                          <Utensils className="h-5 w-5 text-primary" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-foreground" data-testid={`text-customer-name-${order.id}`}>
                            {order.customerName}
                          </h4>
                          <span className="text-sm font-medium text-foreground" data-testid={`text-order-total-${order.id}`}>
                            {order.total}
                          </span>
                        </div>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-muted-foreground" data-testid={`text-order-items-${order.id}`}>
                            {order.items}
                          </p>
                          <Badge variant={order.status === 'ready' ? 'default' : 'secondary'}>
                            {order.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted-foreground">No orders found</p>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card data-testid="card-quick-actions">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full" data-testid="button-new-order">
                  <Receipt className="h-4 w-4 mr-2" /> New Order
                </Button>
                
                <Button variant="secondary" className="w-full" data-testid="button-reserve-table">
                  <Utensils className="h-4 w-4 mr-2" /> Reserve Table
                </Button>
                
                <Button variant="outline" className="w-full" data-testid="button-view-reports">
                  <TrendingUp className="h-4 w-4 mr-2" /> View Reports
                </Button>
                
                <Button variant="outline" className="w-full" data-testid="button-settings">
                  <Users className="h-4 w-4 mr-2" /> Settings
                </Button>
              </div>
              
              <div className="mt-6 p-4 bg-muted rounded-lg">
                <h4 className="font-medium text-foreground mb-2">Today's Specials</h4>
                <p className="text-sm text-muted-foreground mb-2">Grilled Salmon with seasonal vegetables</p>
                <span className="text-lg font-bold text-primary">$28.99</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
