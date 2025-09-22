import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  FileText, 
  Users, 
  TrendingUp, 
  Settings,
  Menu,
  X,
  Gavel,
  ChevronDown,
  ChevronRight,
  Circle,
  FolderOpen,
  FolderClosed,
  Clock,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface DashboardSidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

interface NavigationItem {
  name: string;
  href?: string;
  icon: any;
  children?: NavigationItem[];
}

const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', href: '/', icon: BarChart3 },
  { 
    name: 'Legal Cases', 
    icon: FileText, 
    children: [
      { name: 'All Cases', href: '/cases', icon: Circle },
      { name: 'Open Cases', href: '/cases/open', icon: FolderOpen },
      { name: 'Pending Cases', href: '/cases/pending', icon: Clock },
      { name: 'Settlement Cases', href: '/cases/settlement', icon: Circle },
      { name: 'Closed Cases', href: '/cases/closed', icon: CheckCircle },
    ]
  },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Analytics', href: '/analytics', icon: TrendingUp },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function DashboardSidebar({ collapsed, onToggle }: DashboardSidebarProps) {
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['Legal Cases']);
  const location = useLocation();

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => 
      prev.includes(groupName) 
        ? prev.filter(name => name !== groupName)
        : [...prev, groupName]
    );
  };

  const isActive = (href?: string) => {
    if (!href) return false;
    // Exact match for root path
    if (href === '/') {
      return location.pathname === '/';
    }
    // For all other paths, only exact matches are considered active
    // This ensures only one item can be active at a time
    return location.pathname === href;
  };

  const isGroupActive = (item: NavigationItem) => {
    if (item.href) return isActive(item.href);
    return false; 
  };

  return (
    <aside className={cn(
      "bg-dashboard-sidebar border-r border-border transition-all duration-300 fixed h-full z-50 lg:relative lg:translate-x-0",
      collapsed ? "w-16 -translate-x-full lg:translate-x-0" : "w-64"
    )}>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!collapsed && (
            <div className="flex items-center space-x-2">
              <img 
                src="/gavel.png" 
                alt="Logo" 
                className="h-8 w-8 object-contain text-primary"
              />
              <div>
                <h1 className="text-lg font-bold text-foreground">LegalAI</h1>
                <p className="text-xs text-muted-foreground">Case Dashboard</p>
              </div>
            </div>
          )}
          {collapsed && (
            <img 
              src="/gavel.png" 
              alt="Logo" 
              className="h-8 w-8 mx-auto object-contain"
            />
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="cursor-pointer hover:bg-accent"
            style={{ cursor: 'pointer', pointerEvents: 'auto' }}
          >
            {collapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <ul className="space-y-2">
            {navigationItems.map((item) => (
              <li key={item.name}>
                {item.children ? (
                  // Group with children
                  <div>
                    <button
                      onClick={() => !collapsed && toggleGroup(item.name)}
                      disabled={collapsed}
                      className={cn(
                        "w-full flex items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        "hover:bg-accent hover:text-accent-foreground",
                        collapsed ? "cursor-default opacity-50" : "cursor-pointer",
                        isGroupActive(item) 
                          ? "bg-primary/10 text-primary" 
                          : "text-muted-foreground"
                      )}
                      style={{ cursor: collapsed ? 'default' : 'pointer' }}
                    >
                      <div className="flex items-center">
                        <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                        {!collapsed && <span>{item.name}</span>}
                      </div>
                      {!collapsed && (
                        expandedGroups.includes(item.name) 
                          ? <ChevronDown className="h-4 w-4" />
                          : <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                    
                    {/* Children */}
                    {!collapsed && expandedGroups.includes(item.name) && (
                      <ul className="mt-2 ml-4 space-y-1">
                        {item.children.map((child) => (
                          <li key={child.name}>
                            <NavLink
                              to={child.href!}
                              style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                              className={cn(
                                "flex items-center rounded-lg px-3 py-2 text-sm transition-colors",
                                "hover:bg-accent hover:text-accent-foreground",
                                isActive(child.href)
                                  ? "bg-primary text-primary-foreground shadow-card"
                                  : "text-muted-foreground"
                              )}
                            >
                              <child.icon className="h-3 w-3 mr-3" />
                              <span>{child.name}</span>
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  // Simple item
                  <NavLink
                    to={item.href!}
                    style={{ cursor: 'pointer', pointerEvents: 'auto' }}
                    className={cn(
                      "flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      isActive(item.href)
                        ? "bg-primary text-primary-foreground shadow-card"
                        : "text-muted-foreground"
                    )}
                  >
                    <item.icon className={cn("h-4 w-4", !collapsed && "mr-3")} />
                    {!collapsed && <span>{item.name}</span>}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-border">
            <div className="rounded-lg bg-gradient-primary p-4 text-primary-foreground">
              <h3 className="font-semibold text-sm">AI Predictions</h3>
              <p className="text-xs opacity-90 mt-1">
                Enhanced with machine learning insights for better case outcomes.
              </p>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}