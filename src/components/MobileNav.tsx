import { LayoutDashboard, Package, Truck, Bell, Grid3x3, Ship, Shield, CreditCard, Menu } from 'lucide-react';

interface MobileNavProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  userRole: string;
  onMenuClick?: () => void;
}

export default function MobileNav({ currentScreen, onNavigate, userRole, onMenuClick }: MobileNavProps) {
  // Role-based navigation - show most used features
  const getNavItems = () => {
    const roleItems = {
      admin: [
        { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
        { id: 'yard', label: 'Yard', icon: Grid3x3 },
        { id: 'berth', label: 'Berth', icon: Ship },
      ],
      operator: [
        { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
        { id: 'yard', label: 'Yard', icon: Grid3x3 },
        { id: 'stacking', label: 'Stack', icon: Package },
      ],
      berth: [
        { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
        { id: 'berth', label: 'Berth', icon: Ship },
        { id: 'stowage', label: 'Stowage', icon: Package },
      ],
      driver: [
        { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
        { id: 'truck', label: 'Booking', icon: Truck },
        { id: 'yard', label: 'Yard', icon: Grid3x3 },
      ],
      customs: [
        { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
        { id: 'customs', label: 'Clearance', icon: Shield },
        { id: 'stacking', label: 'Stack', icon: Package },
      ],
      finance: [
        { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
        { id: 'billing', label: 'Billing', icon: CreditCard },
        { id: 'truck', label: 'Booking', icon: Truck },
      ],
    };

    return roleItems[userRole as keyof typeof roleItems] || [
      { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
      { id: 'stacking', label: 'Containers', icon: Package },
      { id: 'truck', label: 'Booking', icon: Truck },
    ];
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 z-50 safe-area-bottom">
      <div className="h-full flex items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all active:scale-95 ${
                isActive
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : 'text-slate-400 active:text-slate-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs">{item.label}</span>
            </button>
          );
        })}
        
        {/* Menu button to access all modules */}
        <button
          onClick={onMenuClick}
          className="flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-lg transition-all active:scale-95 text-slate-400 active:text-slate-300"
        >
          <Menu className="w-5 h-5" />
          <span className="text-xs">Menu</span>
        </button>
      </div>
    </nav>
  );
}