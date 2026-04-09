import { User, Shield, Settings, HelpCircle, LogOut, ChevronRight, Bell, Lock, Globe, Moon, Info, Ship } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface MobileProfileProps {
  userRole: string;
  onLogout: () => void;
}

export default function MobileProfile({ userRole, onLogout }: MobileProfileProps) {
  const getRoleInfo = (role: string) => {
    const roleMap: { [key: string]: { name: string; badge: string; color: string } } = {
      admin: { name: 'Administrator', badge: 'Full Access', color: 'red' },
      operator: { name: 'Port Operator', badge: 'Operations Team', color: 'emerald' },
      berth: { name: 'Berth Planner', badge: 'Planning Team', color: 'blue' },
      driver: { name: 'Truck Driver', badge: 'Logistics Partner', color: 'yellow' },
      customs: { name: 'Customs Officer', badge: 'Customs Authority', color: 'orange' },
      finance: { name: 'Finance Manager', badge: 'Finance Department', color: 'purple' },
    };
    return roleMap[role] || { name: 'User', badge: 'General Access', color: 'slate' };
  };

  const roleInfo = getRoleInfo(userRole);

  const handleLogout = () => {
    toast.success('Logging out...');
    setTimeout(onLogout, 500);
  };

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { label: 'Profile Settings', icon: User, action: () => toast.info('Profile settings') },
        { label: 'Security & Privacy', icon: Lock, action: () => toast.info('Security settings') },
        { label: 'Notifications', icon: Bell, action: () => toast.info('Notification preferences') },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { label: 'Language', icon: Globe, action: () => toast.info('Language: English') },
        { label: 'Appearance', icon: Moon, action: () => toast.info('Theme: Dark Mode') },
      ]
    },
    {
      title: 'Support',
      items: [
        { label: 'Help & Support', icon: HelpCircle, action: () => toast.info('Help center') },
        { label: 'About BDPortFlow', icon: Info, action: () => toast.info('BDPortFlow v2.1.0') },
      ]
    }
  ];

  const getBadgeColor = (color: string) => {
    const colors: { [key: string]: string } = {
      red: 'bg-red-500/20 text-red-400 border-red-500/50',
      emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      orange: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      slate: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
    };
    return colors[color] || colors.slate;
  };

  return (
    <div className="pb-20 px-4 pt-6 space-y-6">
      {/* Profile Header */}
      <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-2xl p-6">
        <div className="flex items-start gap-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center flex-shrink-0">
            <User className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl text-slate-100 font-medium mb-1">
              {roleInfo.name}
            </h2>
            <p className="text-slate-400 text-sm mb-3">user@bdportflow.com</p>
            <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs ${getBadgeColor(roleInfo.color)}`}>
              <Shield className="w-3 h-3" />
              {roleInfo.badge}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-700">
          <div className="text-center">
            <p className="text-emerald-400 text-lg font-semibold">127</p>
            <p className="text-slate-500 text-xs">Sessions</p>
          </div>
          <div className="text-center">
            <p className="text-blue-400 text-lg font-semibold">45</p>
            <p className="text-slate-500 text-xs">Days Active</p>
          </div>
          <div className="text-center">
            <p className="text-purple-400 text-lg font-semibold">98%</p>
            <p className="text-slate-500 text-xs">Uptime</p>
          </div>
        </div>
      </div>

      {/* Settings Groups */}
      {settingsGroups.map((group, idx) => (
        <div key={idx}>
          <h3 className="text-slate-400 text-sm mb-3 px-1">{group.title}</h3>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
            {group.items.map((item, itemIdx) => {
              const Icon = item.icon;
              return (
                <button
                  key={itemIdx}
                  onClick={item.action}
                  className={`w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors ${
                    itemIdx !== group.items.length - 1 ? 'border-b border-slate-700' : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-5 h-5 text-slate-400" />
                    <span className="text-slate-300 text-sm">{item.label}</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-500" />
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {/* System Status */}
      <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-slate-300 text-sm">System Status</span>
          <span className="flex items-center gap-2 text-emerald-400 text-xs">
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            Online
          </span>
        </div>
        <div className="space-y-2 text-xs text-slate-500">
          <div className="flex justify-between">
            <span>Version</span>
            <span className="text-slate-400">v2.1.0</span>
          </div>
          <div className="flex justify-between">
            <span>Last Updated</span>
            <span className="text-slate-400">Jan 4, 2026</span>
          </div>
          <div className="flex justify-between">
            <span>Port</span>
            <span className="text-slate-400">Chittagong, BD</span>
          </div>
        </div>
      </div>

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="w-full bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl p-4 font-medium flex items-center justify-center gap-2 hover:bg-red-500/30 transition-colors"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>

      {/* Footer */}
      <div className="text-center pb-4">
        <p className="text-slate-600 text-xs">
          © 2026 BDPortFlow Terminal Operating System
        </p>
        <p className="text-slate-700 text-xs mt-1">
          Chittagong Port Authority
        </p>
      </div>
    </div>
  );
}