import { memo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, ClipboardList, Activity, Radio, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/scorecard', icon: ClipboardList, label: 'Scorecard' },
  { path: '/umpire', icon: Radio, label: 'Umpire', isPrimary: true },
  { path: '/analytics', icon: Activity, label: 'Analytics' },
  { path: '/statistics', icon: BarChart3, label: 'Stats' },
];

const BottomNavigation = memo(({ showUmpire = true }) => {
  const location = useLocation();
  const items = showUmpire ? navItems : navItems.filter(item => !item.isPrimary);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-lg border-t border-border safe-area-pb z-40">
      <div className="flex justify-around items-center py-2 px-2 max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          if (item.isPrimary) {
            return (
              <Link
                key={item.path}
                to={item.path}
                className="flex flex-col items-center gap-0.5 -mt-6"
              >
                <div className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300",
                  isActive 
                    ? "gradient-primary shadow-button scale-110" 
                    : "bg-primary hover:scale-105"
                )}>
                  <Icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <span className={cn(
                  "text-[10px] font-medium mt-1",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200",
                isActive 
                  ? "text-primary" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all duration-200",
                isActive && "bg-primary/10"
              )}>
                <Icon className={cn("w-5 h-5", isActive && "animate-scale-in")} />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-all",
                isActive && "font-semibold"
              )}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
});

BottomNavigation.displayName = 'BottomNavigation';

export default BottomNavigation;
