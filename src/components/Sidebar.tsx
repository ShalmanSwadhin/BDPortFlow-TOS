import {
  LayoutDashboard,
  Users,
  Ship,
  Snowflake,
  Package,
  Container,
  Truck,
  Grid3x3,
  Train,
  CreditCard,
  DoorOpen,
  Shield,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SCREEN_MODULE_MAP } from '../utils/dataMappers';

interface SidebarProps {
  currentScreen: string;
  onNavigate: (screen: string) => void;
  userRole: string;
  isOpen: boolean;
  isMobile?: boolean;
}

export default function Sidebar({ currentScreen, onNavigate, isOpen, isMobile = false }: SidebarProps) {
  const { hasPermission } = useApp();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, color: 'emerald' },
    { id: 'admin', label: 'Admin Panel', icon: Users, color: 'orange' },
    { id: 'berth', label: 'Berth Planner', icon: Ship, color: 'blue' },
    { id: 'reefer', label: 'Reefer Monitor', icon: Snowflake, color: 'cyan' },
    { id: 'stacking', label: 'Container Stack', icon: Package, color: 'purple' },
    { id: 'stowage', label: 'Ship Stowage', icon: Container, color: 'indigo' },
    { id: 'gate', label: 'Gate Operations', icon: DoorOpen, color: 'green' },
    { id: 'truck', label: 'Truck Booking', icon: Truck, color: 'yellow' },
    { id: 'yard', label: 'Yard Density', icon: Grid3x3, color: 'red' },
    { id: 'rail', label: 'Rail Coordination', icon: Train, color: 'pink' },
    { id: 'customs', label: 'Custom Clearance', icon: Shield, color: 'amber' },
    { id: 'billing', label: 'Billing & Tariff', icon: CreditCard, color: 'violet' },
  ];

  const colorClasses: { [key: string]: { bg: string; text: string; border: string } } = {
    emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/50' },
    orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/50' },
    blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/50' },
    cyan: { bg: 'bg-cyan-500/20', text: 'text-cyan-400', border: 'border-cyan-500/50' },
    purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/50' },
    indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/50' },
    green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/50' },
    yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50' },
    red: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50' },
    pink: { bg: 'bg-pink-500/20', text: 'text-pink-400', border: 'border-pink-500/50' },
    violet: { bg: 'bg-violet-500/20', text: 'text-violet-400', border: 'border-violet-500/50' },
    amber: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/50' },
  };

  return (
    <aside
      className={`fixed left-0 top-16 bottom-0 w-64 bg-slate-900/80 backdrop-blur-xl border-r border-slate-800 transition-transform duration-300 z-40 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-full overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {isMobile && (
          <div className="pb-3 mb-2 border-b border-slate-800">
            <h3 className="text-slate-300 text-sm">All Modules</h3>
            <p className="text-slate-500 text-xs mt-1">Select to navigate</p>
          </div>
        )}

        {menuItems.map((item) => {
          const moduleName = SCREEN_MODULE_MAP[item.id];
          if (moduleName && !hasPermission(moduleName, 'view')) return null;

          const Icon = item.icon;
          const colors = colorClasses[item.color];
          const isActive = currentScreen === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? `${colors.bg} ${colors.text} border ${colors.border} shadow-lg`
                  : 'hover:bg-slate-800 text-slate-400 hover:text-slate-300'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
