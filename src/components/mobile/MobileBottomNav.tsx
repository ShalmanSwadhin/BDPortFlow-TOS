import { Home, CheckSquare, Bell, User } from 'lucide-react';

interface MobileBottomNavProps {
  activeTab: 'home' | 'tasks' | 'alerts' | 'profile';
  onTabChange: (tab: 'home' | 'tasks' | 'alerts' | 'profile') => void;
  unreadAlerts: number;
}

export default function MobileBottomNav({ activeTab, onTabChange, unreadAlerts }: MobileBottomNavProps) {
  const tabs = [
    { id: 'home' as const, icon: Home, label: 'Home' },
    { id: 'tasks' as const, icon: CheckSquare, label: 'Tasks' },
    { id: 'alerts' as const, icon: Bell, label: 'Alerts', badge: unreadAlerts },
    { id: 'profile' as const, icon: User, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 z-50 safe-area-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                isActive ? 'text-emerald-400' : 'text-slate-500'
              }`}
            >
              <div className="relative">
                <Icon className={`w-6 h-6 ${isActive ? 'text-emerald-400' : 'text-slate-400'}`} />
                {tab.badge !== undefined && tab.badge > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {tab.badge > 9 ? '9+' : tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-xs mt-1 ${isActive ? 'text-emerald-400 font-medium' : 'text-slate-500'}`}>
                {tab.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-emerald-400 rounded-b-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
