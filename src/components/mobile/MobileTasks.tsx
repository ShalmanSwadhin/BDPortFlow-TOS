import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Ship, Package, Truck, CheckCircle, Clock, AlertCircle, 
  ChevronRight, Filter, DollarSign, FileText, Shield
} from 'lucide-react';
import MobileTaskDetail from './MobileTaskDetail';

interface MobileTasksProps {
  userRole: string;
  filter?: 'all' | 'pending' | 'active' | 'completed';
  onFilterChange?: (filter: 'all' | 'pending' | 'active' | 'completed') => void;
}

export default function MobileTasks({ userRole, filter: externalFilter, onFilterChange }: MobileTasksProps) {
  const { vessels, containers, bookings } = useApp();
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active' | 'completed'>(externalFilter || 'all');
  
  // Use external filter if provided
  const activeFilter = externalFilter || filter;
  
  const handleFilterChange = (newFilter: 'all' | 'pending' | 'active' | 'completed') => {
    setFilter(newFilter);
    if (onFilterChange) {
      onFilterChange(newFilter);
    }
  };

  // Generate role-based tasks
  const getTasks = () => {
    switch (userRole) {
      case 'operator':
        return [
          ...vessels.filter(v => v.status !== 'incoming').map(v => ({
            id: `vessel-${v.id}`,
            type: 'vessel',
            title: v.name,
            subtitle: `Berth ${v.berth} • ${v.status}`,
            status: v.progress === 100 ? 'completed' : v.progress > 0 ? 'active' : 'pending',
            progress: v.progress,
            icon: Ship,
            color: v.status === 'loading' ? 'emerald' : 'blue',
            data: v
          })),
          ...containers.filter(c => c.type === 'reefer').map(c => ({
            id: `reefer-${c.id}`,
            type: 'reefer',
            title: c.id,
            subtitle: `${c.location} • ${c.cargo || 'Reefer'}`,
            status: c.alarm ? 'pending' : 'active',
            progress: c.alarm ? 0 : 100,
            icon: Package,
            color: c.alarm ? 'red' : 'purple',
            data: c
          })),
          // Completed tasks
          {
            id: 'completed-vessel-1',
            type: 'vessel',
            title: 'MV SUNRISE',
            subtitle: 'Berth 1 • Departed',
            status: 'completed',
            progress: 100,
            icon: Ship,
            color: 'emerald',
            data: { name: 'MV SUNRISE', containers: 180, berth: 1 }
          },
          {
            id: 'completed-reefer-1',
            type: 'reefer',
            title: 'KKFU9876543',
            subtitle: 'Block C-12 • Dispatched',
            status: 'completed',
            progress: 100,
            icon: Package,
            color: 'emerald',
            data: { id: 'KKFU9876543', cargo: 'Frozen Goods' }
          },
          {
            id: 'completed-vessel-2',
            type: 'vessel',
            title: 'MSC VICTORY',
            subtitle: 'Berth 3 • Departed',
            status: 'completed',
            progress: 100,
            icon: Ship,
            color: 'emerald',
            data: { name: 'MSC VICTORY', containers: 256, berth: 3 }
          }
        ];
      
      case 'berth':
        return [
          ...vessels.map(v => ({
            id: `vessel-${v.id}`,
            type: 'vessel',
            title: v.name,
            subtitle: v.berth ? `Berth ${v.berth} • ${v.eta}` : `Incoming • ETA ${v.eta}`,
            status: v.status === 'incoming' ? 'pending' : v.progress === 100 ? 'completed' : 'active',
            progress: v.progress,
            icon: Ship,
            color: v.status === 'incoming' ? 'orange' : 'blue',
            data: v
          })),
          // Completed berth planning tasks
          {
            id: 'completed-berth-1',
            type: 'vessel',
            title: 'OOCL INNOVATION',
            subtitle: 'Berth 2 • Departed at 18:00',
            status: 'completed',
            progress: 100,
            icon: Ship,
            color: 'emerald',
            data: { name: 'OOCL INNOVATION', berth: 2 }
          },
          {
            id: 'completed-berth-2',
            type: 'vessel',
            title: 'CMA CGM NEPTUNE',
            subtitle: 'Berth 4 • Departed at 12:00',
            status: 'completed',
            progress: 100,
            icon: Ship,
            color: 'emerald',
            data: { name: 'CMA CGM NEPTUNE', berth: 4 }
          },
          {
            id: 'completed-berth-3',
            type: 'vessel',
            title: 'COSCO PEARL',
            subtitle: 'Berth 1 • Departed at 09:30',
            status: 'completed',
            progress: 100,
            icon: Ship,
            color: 'emerald',
            data: { name: 'COSCO PEARL', berth: 1 }
          }
        ];
      
      case 'driver':
        return [
          ...bookings.map(b => ({
            id: `booking-${b.id}`,
            type: 'booking',
            title: b.container,
            subtitle: `${b.slot} • ${b.truck}`,
            status: b.status === 'confirmed' ? 'active' : b.status === 'completed' ? 'completed' : 'pending',
            progress: b.status === 'confirmed' ? 50 : b.status === 'completed' ? 100 : 0,
            icon: Truck,
            color: b.status === 'confirmed' ? 'emerald' : 'yellow',
            data: b
          })),
          // Completed deliveries
          {
            id: 'completed-delivery-1',
            type: 'booking',
            title: 'HLBU9876543',
            subtitle: '09:30 • DHK-GA-7890',
            status: 'completed',
            progress: 100,
            icon: Truck,
            color: 'emerald',
            data: { container: 'HLBU9876543', truck: 'DHK-GA-7890', slot: '09:30' }
          },
          {
            id: 'completed-delivery-2',
            type: 'booking',
            title: 'MSCU4567123',
            subtitle: '11:00 • CHT-TA-4567',
            status: 'completed',
            progress: 100,
            icon: Truck,
            color: 'emerald',
            data: { container: 'MSCU4567123', truck: 'CHT-TA-4567', slot: '11:00' }
          },
          {
            id: 'completed-delivery-3',
            type: 'booking',
            title: 'TEMU2345678',
            subtitle: '13:30 • DHK-KA-2345',
            status: 'completed',
            progress: 100,
            icon: Truck,
            color: 'emerald',
            data: { container: 'TEMU2345678', truck: 'DHK-KA-2345', slot: '13:30' }
          },
          {
            id: 'completed-delivery-4',
            type: 'booking',
            title: 'CMAU8901234',
            subtitle: '10:15 • CHT-BA-6789',
            status: 'completed',
            progress: 100,
            icon: Truck,
            color: 'emerald',
            data: { container: 'CMAU8901234', truck: 'CHT-BA-6789', slot: '10:15' }
          }
        ];
      
      case 'customs':
        return [
          ...containers.filter(c => c.status === 'customs' || c.status === 'processing').map(c => ({
            id: `clearance-${c.id}`,
            type: 'clearance',
            title: c.id,
            subtitle: `${c.destination} • ${c.weight}T`,
            status: c.status === 'customs' ? 'pending' : 'active',
            progress: c.status === 'customs' ? 0 : 50,
            icon: Shield,
            color: c.status === 'customs' ? 'orange' : 'yellow',
            data: c
          })),
          // Completed customs clearances
          {
            id: 'completed-customs-1',
            type: 'clearance',
            title: 'MAEU3456789',
            subtitle: 'Singapore • 21.5T',
            status: 'completed',
            progress: 100,
            icon: Shield,
            color: 'emerald',
            data: { id: 'MAEU3456789', destination: 'Singapore', weight: 21.5 }
          },
          {
            id: 'completed-customs-2',
            type: 'clearance',
            title: 'OOLU5678901',
            subtitle: 'Dubai • 23.8T',
            status: 'completed',
            progress: 100,
            icon: Shield,
            color: 'emerald',
            data: { id: 'OOLU5678901', destination: 'Dubai', weight: 23.8 }
          },
          {
            id: 'completed-customs-3',
            type: 'clearance',
            title: 'COSU7890123',
            subtitle: 'Shanghai • 19.2T',
            status: 'completed',
            progress: 100,
            icon: Shield,
            color: 'emerald',
            data: { id: 'COSU7890123', destination: 'Shanghai', weight: 19.2 }
          },
          {
            id: 'completed-customs-4',
            type: 'clearance',
            title: 'HLBU4561234',
            subtitle: 'Mumbai • 24.7T',
            status: 'completed',
            progress: 100,
            icon: Shield,
            color: 'emerald',
            data: { id: 'HLBU4561234', destination: 'Mumbai', weight: 24.7 }
          },
          {
            id: 'completed-customs-5',
            type: 'clearance',
            title: 'TCKU1239876',
            subtitle: 'Colombo • 20.3T',
            status: 'completed',
            progress: 100,
            icon: Shield,
            color: 'emerald',
            data: { id: 'TCKU1239876', destination: 'Colombo', weight: 20.3 }
          }
        ];
      
      case 'finance':
        return [
          {
            id: 'inv-1',
            type: 'invoice',
            title: 'Invoice #INV-2024-1247',
            subtitle: 'MSC Shipping Ltd • $24,500',
            status: 'pending',
            progress: 0,
            icon: DollarSign,
            color: 'orange',
            data: { id: 'INV-2024-1247', client: 'MSC Shipping Ltd', amount: 24500, due: 'Today' }
          },
          {
            id: 'inv-2',
            type: 'invoice',
            title: 'Invoice #INV-2024-1246',
            subtitle: 'Maersk Line • $18,200',
            status: 'active',
            progress: 50,
            icon: DollarSign,
            color: 'yellow',
            data: { id: 'INV-2024-1246', client: 'Maersk Line', amount: 18200, due: 'Tomorrow' }
          },
          {
            id: 'inv-3',
            type: 'invoice',
            title: 'Invoice #INV-2024-1240',
            subtitle: 'Evergreen Marine • $32,100',
            status: 'completed',
            progress: 100,
            icon: DollarSign,
            color: 'emerald',
            data: { id: 'INV-2024-1240', client: 'Evergreen Marine', amount: 32100, due: 'Paid' }
          },
          // Additional completed invoices
          {
            id: 'inv-4',
            type: 'invoice',
            title: 'Invoice #INV-2024-1238',
            subtitle: 'COSCO Shipping • $28,900',
            status: 'completed',
            progress: 100,
            icon: DollarSign,
            color: 'emerald',
            data: { id: 'INV-2024-1238', client: 'COSCO Shipping', amount: 28900, due: 'Paid' }
          },
          {
            id: 'inv-5',
            type: 'invoice',
            title: 'Invoice #INV-2024-1235',
            subtitle: 'Hapag-Lloyd • $19,750',
            status: 'completed',
            progress: 100,
            icon: DollarSign,
            color: 'emerald',
            data: { id: 'INV-2024-1235', client: 'Hapag-Lloyd', amount: 19750, due: 'Paid' }
          },
          {
            id: 'inv-6',
            type: 'invoice',
            title: 'Invoice #INV-2024-1232',
            subtitle: 'ONE Line • $26,400',
            status: 'completed',
            progress: 100,
            icon: DollarSign,
            color: 'emerald',
            data: { id: 'INV-2024-1232', client: 'ONE Line', amount: 26400, due: 'Paid' }
          },
          {
            id: 'inv-7',
            type: 'invoice',
            title: 'Invoice #INV-2024-1230',
            subtitle: 'Yang Ming Marine • $21,850',
            status: 'completed',
            progress: 100,
            icon: DollarSign,
            color: 'emerald',
            data: { id: 'INV-2024-1230', client: 'Yang Ming Marine', amount: 21850, due: 'Paid' }
          }
        ];
      
      case 'admin':
        return [
          {
            id: 'admin-1',
            type: 'admin',
            title: 'System Backup Required',
            subtitle: 'Last backup: 2 days ago',
            status: 'pending',
            progress: 0,
            icon: FileText,
            color: 'orange',
            data: { action: 'backup', priority: 'high' }
          },
          {
            id: 'admin-2',
            type: 'admin',
            title: 'User Access Review',
            subtitle: '12 users pending review',
            status: 'pending',
            progress: 0,
            icon: Shield,
            color: 'yellow',
            data: { action: 'review', priority: 'medium' }
          },
          // Completed admin tasks
          {
            id: 'admin-3',
            type: 'admin',
            title: 'Security Audit Completed',
            subtitle: 'All systems checked',
            status: 'completed',
            progress: 100,
            icon: Shield,
            color: 'emerald',
            data: { action: 'audit', priority: 'high' }
          },
          {
            id: 'admin-4',
            type: 'admin',
            title: 'Database Optimization',
            subtitle: 'Performance improved by 35%',
            status: 'completed',
            progress: 100,
            icon: FileText,
            color: 'emerald',
            data: { action: 'optimization', priority: 'medium' }
          },
          {
            id: 'admin-5',
            type: 'admin',
            title: 'User Training Session',
            subtitle: '24 staff members trained',
            status: 'completed',
            progress: 100,
            icon: FileText,
            color: 'emerald',
            data: { action: 'training', priority: 'medium' }
          },
          {
            id: 'admin-6',
            type: 'admin',
            title: 'System Update Deployed',
            subtitle: 'Version 2.4.1 installed',
            status: 'completed',
            progress: 100,
            icon: FileText,
            color: 'emerald',
            data: { action: 'update', priority: 'high' }
          }
        ];
      
      default:
        return [];
    }
  };

  const tasks = getTasks();
  const filteredTasks = activeFilter === 'all' 
    ? tasks 
    : tasks.filter(t => t.status === activeFilter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-emerald-400" />;
      case 'active':
        return <Clock className="w-5 h-5 text-blue-400" />;
      case 'pending':
        return <AlertCircle className="w-5 h-5 text-orange-400" />;
      default:
        return <Clock className="w-5 h-5 text-slate-400" />;
    }
  };

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: { bg: string; text: string; border: string } } = {
      emerald: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/30' },
      blue: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
      purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
      orange: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
      yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
      red: { bg: 'bg-red-500/10', text: 'text-red-400', border: 'border-red-500/30' },
    };
    return colors[color] || colors.blue;
  };

  if (selectedTask) {
    return (
      <MobileTaskDetail 
        task={selectedTask} 
        onClose={() => setSelectedTask(null)}
        userRole={userRole}
      />
    );
  }

  return (
    <div className="pb-20 px-4 pt-6 space-y-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl text-slate-100 font-medium mb-1">Tasks</h1>
        <p className="text-slate-400 text-sm">{filteredTasks.length} active items</p>
      </div>

      {/* Filter Buttons */}
      <div className="grid grid-cols-4 gap-2">
        {(['all', 'pending', 'active', 'completed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => handleFilterChange(f)}
            className={`px-3 py-2 rounded-lg text-sm whitespace-nowrap transition-colors ${
              activeFilter === f
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                : 'bg-slate-800/50 text-slate-400 border border-slate-700'
            }`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400">No {activeFilter !== 'all' ? activeFilter : ''} tasks</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const Icon = task.icon;
            const colors = getColorClasses(task.color);
            
            return (
              <button
                key={task.id}
                onClick={() => setSelectedTask(task)}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 active:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className={`${colors.bg} ${colors.border} border rounded-lg p-2 flex-shrink-0`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0 text-left">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-slate-100 font-medium truncate">{task.title}</h3>
                      {getStatusIcon(task.status)}
                    </div>
                    <p className="text-slate-400 text-sm mb-2">{task.subtitle}</p>
                    
                    {/* Progress Bar */}
                    {task.progress > 0 && task.progress < 100 && (
                      <div className="w-full bg-slate-700 rounded-full h-1.5 mb-2">
                        <div 
                          className={`h-1.5 rounded-full ${colors.bg.replace('/10', '/50')}`}
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="w-5 h-5 text-slate-500 flex-shrink-0 mt-1" />
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}