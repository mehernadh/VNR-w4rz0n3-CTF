import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { 
  LayoutDashboard, 
  Receipt, 
  BookOpen, 
  Package, 
  Users, 
  BarChart3, 
  Star, 
  Shield,
  Search
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/orders', label: 'Orders', icon: Receipt },
  { href: '/menu', label: 'Menu Management', icon: BookOpen },
  { href: '/inventory', label: 'Inventory', icon: Package },
  { href: '/staff', label: 'Staff', icon: Users },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/reviews', label: 'Reviews', icon: Star },
];

const adminItems = [
  { href: '/admin', label: 'Admin Panel', icon: Shield },
  { href: '/secret-search', label: 'Secret Search', icon: Search, hidden: true },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const [location] = useLocation();
  const { user } = useAuth();

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
          onClick={onClose}
          data-testid="sidebar-overlay"
        />
      )}
      
      <aside className={cn(
        "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-200 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <div className="flex flex-col h-full pt-16 lg:pt-0">
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => {
              const isActive = location === item.href;
              const Icon = item.icon;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-muted text-primary"
                    )}
                    onClick={() => onClose()}
                    data-testid={`nav-link-${item.label.toLowerCase().replace(' ', '-')}`}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
            
            {/* Only show admin section if user is admin */}
            {user?.isAdmin && (
              <>
                <div className="border-t border-border my-4" />
                
                {adminItems.map((item) => {
                  if (item.hidden && !window.location.hash.includes('secret')) {
                    return null;
                  }
                  
                  const isActive = location === item.href;
                  const Icon = item.icon;
                  
                  return (
                    <Link key={item.href} href={item.href}>
                      <Button
                        variant={isActive ? "secondary" : "ghost"}
                        className={cn(
                          "w-full justify-start",
                          isActive && "bg-muted text-primary"
                        )}
                        onClick={() => onClose()}
                        data-testid={`nav-link-${item.label.toLowerCase().replace(' ', '-')}`}
                      >
                        <Icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Button>
                    </Link>
                  );
                })}
              </>
            )}
          </nav>
          
          <div className="p-4 border-t border-border">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-3 text-primary-foreground">
              <h3 className="font-medium text-sm mb-1">Upgrade to Pro</h3>
              <p className="text-xs opacity-90 mb-2">Unlock advanced features</p>
              <Button 
                size="sm" 
                variant="secondary" 
                className="h-6 text-xs"
                data-testid="button-upgrade-pro"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
