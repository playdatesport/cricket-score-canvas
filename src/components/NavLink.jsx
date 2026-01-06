import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';

const NavLink = ({ to, icon: Icon, label, className }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        'flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors',
        isActive 
          ? 'text-primary bg-primary/10' 
          : 'text-muted-foreground hover:text-foreground hover:bg-muted',
        className
      )}
    >
      <Icon className="w-5 h-5" />
      <span className="text-xs font-medium">{label}</span>
    </Link>
  );
};

export default NavLink;
