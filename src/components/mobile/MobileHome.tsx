import { useApp } from '../../context/AppContext';
import { 
  Ship, Package, Truck, TrendingUp, AlertTriangle, 
  Clock, MapPin, Activity, ChevronRight, Zap, Users, DollarSign
} from 'lucide-react';

interface MobileHomeProps {
  userRole: string;
  onNavigateToTasks?: (filter?: 'all' | 'pending' | 'active' | 'completed') => void;
  onNavigateToAlerts?: () => void;
  onNavigateToAdmin?: (section?: 'users' | 'settings' | 'reports') => void;
  onNavigateToBilling?: () => void;
  onNavigateToClients?: () => void;
  onNavigateToBerth?: () => void;
  onNavigateToYard?: () => void;
  onNavigateToGate?: () => void;
  onNavigateToTruck?: () => void;
  onNavigateToReefer?: () => void;
  onNavigateToCustoms?: () => void;
}

export default function MobileHome({ userRole, onNavigateToTasks, onNavigateToAlerts, onNavigateToAdmin, onNavigateToBilling, onNavigateToClients, onNavigateToBerth, onNavigateToYard, onNavigateToGate, onNavigateToTruck, onNavigateToReefer, onNavigateToCustoms }: MobileHomeProps) {
  const { vessels, containers, bookings, notifications } = useApp();
  
  const handlePrimaryAction = () => {
    // Admin should go to admin panel, not tasks
    if (userRole === 'admin' && onNavigateToAdmin) {
      onNavigateToAdmin();
    } else if (userRole === 'driver' && onNavigateToTruck) {
      // Truck driver's primary action should be to book appointments
      onNavigateToTruck();
    } else if (userRole === 'operator' && onNavigateToYard) {
      // Port operator's primary action should be to view yard status
      onNavigateToYard();
    } else if (userRole === 'customs' && onNavigateToCustoms) {
      // Customs officer's primary action should be to view customs queue
      onNavigateToCustoms();
    } else if (onNavigateToTasks) {
      onNavigateToTasks('active');
    }
  };

  const handleAlertClick = () => {
    if (onNavigateToAlerts) {
      onNavigateToAlerts();
    }
  };

  const handleQuickAction = (label: string) => {
    // Admin quick actions should go to admin panel
    if (userRole === 'admin' && (label === 'Users' || label === 'Settings' || label === 'Reports')) {
      if (onNavigateToAdmin) {
        onNavigateToAdmin(label.toLowerCase());
      }
    }
    // Finance manager quick actions
    else if (userRole === 'finance') {
      if (label === 'Reports' && onNavigateToBilling) {
        onNavigateToBilling();
      } else if (label === 'Clients' && onNavigateToClients) {
        onNavigateToClients();
      } else if (label === 'Invoices' && onNavigateToBilling) {
        onNavigateToBilling();
      } else if (onNavigateToTasks) {
        onNavigateToTasks('pending');
      }
    }
    // Berth planner quick actions
    else if (userRole === 'berth') {
      if ((label === 'Schedule' || label === 'Timeline' || label === 'Vessels') && onNavigateToBerth) {
        onNavigateToBerth();
      } else if (onNavigateToTasks) {
        onNavigateToTasks('all');
      }
    }
    // Port operator quick actions
    else if (userRole === 'operator') {
      if (label === 'Yard' && onNavigateToYard) {
        onNavigateToYard();
      } else if (label === 'Reefers' && onNavigateToReefer) {
        onNavigateToReefer();
      } else if (label === 'Gates' && onNavigateToGate) {
        onNavigateToGate();
      } else if (onNavigateToTasks) {
        onNavigateToTasks('all');
      }
    }
    // Truck driver quick actions
    else if (userRole === 'driver') {
      if (label === 'Book' && onNavigateToTruck) {
        onNavigateToTruck();
      } else if (label === 'Gate Info' && onNavigateToGate) {
        onNavigateToGate();
      } else if (label === 'Support' && onNavigateToAlerts) {
        onNavigateToAlerts();
      } else if (onNavigateToTasks) {
        onNavigateToTasks('active');
      }
    }
    // Customs officer quick actions
    else if (userRole === 'customs') {
      if ((label === 'Approve' || label === 'Inspect' || label === 'Reports') && onNavigateToCustoms) {
        onNavigateToCustoms();
      } else if (onNavigateToTasks) {
        onNavigateToTasks('pending');
      }
    }
    else if (onNavigateToTasks) {
      // Navigate to tasks with appropriate filter based on label
      if (label.includes('Schedule') || label.includes('Yard') || label.includes('Vessels')) {
        onNavigateToTasks('all');
      } else if (label.includes('Approve') || label.includes('Book') || label.includes('Invoices')) {
        onNavigateToTasks('pending');
      } else {
        onNavigateToTasks('active');
      }
    }
  };
  
  const getRoleName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      admin: 'Administrator',
      operator: 'Port Operator',
      berth: 'Berth Planner',
      driver: 'Truck Driver',
      customs: 'Customs Officer',
      finance: 'Finance Manager',
    };
    return roleMap[role] || 'User';
  };

  // Role-based content
  const getRoleContent = () => {
    switch (userRole) {
      case 'admin':
        return {
          kpi1: { label: 'Active Users', value: '247', icon: Users, color: 'emerald' },
          kpi2: { label: 'System Health', value: '98.5%', icon: Activity, color: 'blue' },
          action: { label: 'Manage Users', icon: Users },
          alert: notifications[0],
          quickActions: [
            { label: 'Users', icon: Users },
            { label: 'Settings', icon: Activity },
            { label: 'Reports', icon: TrendingUp },
          ]
        };
      
      case 'operator':
        const activeVessels = vessels.filter(v => v.status === 'loading' || v.status === 'unloading').length;
        const reeferCount = containers.filter(c => c.type === 'reefer').length;
        return {
          kpi1: { label: 'Active Vessels', value: activeVessels.toString(), icon: Ship, color: 'blue' },
          kpi2: { label: 'Reefer Containers', value: reeferCount.toString(), icon: Package, color: 'purple' },
          action: { label: 'View Yard Status', icon: MapPin },
          alert: notifications.find(n => n.type === 'error') || notifications[0],
          quickActions: [
            { label: 'Yard', icon: MapPin },
            { label: 'Reefers', icon: Package },
            { label: 'Gates', icon: Activity },
          ]
        };
      
      case 'berth':
        const berthsOccupied = vessels.filter(v => v.berth !== null).length;
        const incomingVessels = vessels.filter(v => v.status === 'incoming').length;
        return {
          kpi1: { label: 'Berths Occupied', value: `${berthsOccupied}/5`, icon: Ship, color: 'blue' },
          kpi2: { label: 'Incoming Today', value: incomingVessels.toString(), icon: Clock, color: 'orange' },
          action: { label: 'View Schedule', icon: Ship },
          alert: notifications[2],
          quickActions: [
            { label: 'Schedule', icon: Ship },
            { label: 'Timeline', icon: Clock },
            { label: 'Vessels', icon: Activity },
          ]
        };
      
      case 'driver':
        const myBookings = bookings.filter(b => b.status === 'confirmed');
        const nextBooking = myBookings[0];
        return {
          kpi1: { label: 'Next Appointment', value: nextBooking?.slot || 'None', icon: Clock, color: 'emerald' },
          kpi2: { label: 'Today\'s Bookings', value: myBookings.length.toString(), icon: Truck, color: 'yellow' },
          action: { label: 'New Booking', icon: Truck },
          alert: notifications.find(n => n.message.includes('container')) || notifications[5],
          quickActions: [
            { label: 'Book', icon: Truck },
            { label: 'Gate Info', icon: MapPin },
            { label: 'Support', icon: Activity },
          ]
        };
      
      case 'customs':
        const pendingClearance = containers.filter(c => c.status === 'customs').length;
        return {
          kpi1: { label: 'Pending Clearance', value: pendingClearance.toString(), icon: Package, color: 'orange' },
          kpi2: { label: 'Cleared Today', value: '42', icon: TrendingUp, color: 'emerald' },
          action: { label: 'View Queue', icon: Package },
          alert: notifications.find(n => n.type === 'warning') || notifications[1],
          quickActions: [
            { label: 'Approve', icon: Activity },
            { label: 'Inspect', icon: Package },
            { label: 'Reports', icon: TrendingUp },
          ]
        };
      
      case 'finance':
        return {
          kpi1: { label: 'Today\'s Revenue', value: '$142K', icon: DollarSign, color: 'emerald' },
          kpi2: { label: 'Pending Invoices', value: '23', icon: TrendingUp, color: 'orange' },
          action: { label: 'Create Invoice', icon: DollarSign },
          alert: notifications.find(n => n.message.includes('payment')) || notifications[6],
          quickActions: [
            { label: 'Invoices', icon: DollarSign },
            { label: 'Reports', icon: TrendingUp },
            { label: 'Clients', icon: Users },
          ]
        };
      
      default:
        return {
          kpi1: { label: 'Active Vessels', value: vessels.length.toString(), icon: Ship, color: 'blue' },
          kpi2: { label: 'Containers', value: containers.length.toString(), icon: Package, color: 'emerald' },
          action: { label: 'View Dashboard', icon: Activity },
          alert: notifications[0],
          quickActions: [
            { label: 'Status', icon: Activity },
            { label: 'Info', icon: MapPin },
            { label: 'Help', icon: TrendingUp },
          ]
        };
    }
  };

  const content = getRoleContent();
  const Kpi1Icon = content.kpi1.icon;
  const Kpi2Icon = content.kpi2.icon;
  const ActionIcon = content.action.icon;

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; text: string; border: string } } = {
      emerald: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/50' },
      blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/50' },
      purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/50' },
      orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/50' },
      yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50' },
    };
    return colors[color] || colors.emerald;
  };

  const getAlertColor = (type: string) => {
    const colors: { [key: string]: { bg: string; text: string; icon: string } } = {
      error: { bg: 'bg-red-500/20', text: 'text-red-400', icon: 'text-red-400' },
      warning: { bg: 'bg-orange-500/20', text: 'text-orange-400', icon: 'text-orange-400' },
      success: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', icon: 'text-emerald-400' },
      info: { bg: 'bg-blue-500/20', text: 'text-blue-400', icon: 'text-blue-400' },
    };
    return colors[type] || colors.info;
  };

  return (
    <div className="pb-20 px-4 pt-6 space-y-4">
      {/* Role Badge */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-slate-500 text-sm">Welcome back</p>
          <h1 className="text-xl text-slate-100 font-medium">{getRoleName(userRole)}</h1>
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center">
          <Ship className="w-7 h-7 text-white" />
        </div>
      </div>

      {/* Two KPI Cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* KPI 1 */}
        <div className={`${getColorClasses(content.kpi1.color).bg} border ${getColorClasses(content.kpi1.color).border} rounded-2xl p-4`}>
          <Kpi1Icon className={`w-6 h-6 ${getColorClasses(content.kpi1.color).text} mb-2`} />
          <p className="text-slate-400 text-xs mb-1">{content.kpi1.label}</p>
          <p className={`text-2xl ${getColorClasses(content.kpi1.color).text} font-semibold`}>
            {content.kpi1.value}
          </p>
        </div>

        {/* KPI 2 */}
        <div className={`${getColorClasses(content.kpi2.color).bg} border ${getColorClasses(content.kpi2.color).border} rounded-2xl p-4`}>
          <Kpi2Icon className={`w-6 h-6 ${getColorClasses(content.kpi2.color).text} mb-2`} />
          <p className="text-slate-400 text-xs mb-1">{content.kpi2.label}</p>
          <p className={`text-2xl ${getColorClasses(content.kpi2.color).text} font-semibold`}>
            {content.kpi2.value}
          </p>
        </div>
      </div>

      {/* Primary Action Button */}
      <button
        className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-xl p-4 flex items-center justify-between shadow-lg shadow-emerald-500/20 active:scale-98 transition-transform"
        onClick={handlePrimaryAction}
      >
        <div className="flex items-center gap-3">
          <ActionIcon className="w-6 h-6" />
          <span className="font-medium">{content.action.label}</span>
        </div>
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Latest Critical Alert */}
      {content.alert && (
        <div
          className={`${getAlertColor(content.alert.type).bg} border border-${content.alert.type === 'error' ? 'red' : content.alert.type === 'warning' ? 'orange' : content.alert.type === 'success' ? 'emerald' : 'blue'}-500/50 rounded-xl p-4`}
          onClick={handleAlertClick}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className={`w-5 h-5 ${getAlertColor(content.alert.type).icon} flex-shrink-0 mt-0.5`} />
            <div className="flex-1 min-w-0">
              <p className={`${getAlertColor(content.alert.type).text} text-sm font-medium mb-1`}>
                {content.alert.type.charAt(0).toUpperCase() + content.alert.type.slice(1)} Alert
              </p>
              <p className="text-slate-300 text-sm leading-relaxed">
                {content.alert.message}
              </p>
              <p className="text-slate-500 text-xs mt-2">{content.alert.time}</p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div>
        <p className="text-slate-400 text-sm mb-3">Quick Actions</p>
        <div className="grid grid-cols-3 gap-3">
          {content.quickActions.map((qa, idx) => {
            const QAIcon = qa.icon;
            return (
              <button
                key={idx}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 flex flex-col items-center gap-2 active:bg-slate-700/50 transition-colors"
                onClick={() => handleQuickAction(qa.label)}
              >
                <QAIcon className="w-6 h-6 text-slate-400" />
                <span className="text-xs text-slate-300">{qa.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}