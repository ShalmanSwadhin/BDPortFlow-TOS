import { ArrowLeft, Check, X, Send, MapPin, Clock, TrendingUp } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useApp } from '../../context/AppContext';

interface MobileTaskDetailProps {
  task: any;
  onClose: () => void;
  userRole: string;
}

export default function MobileTaskDetail({ task, onClose, userRole }: MobileTaskDetailProps) {
  const { updateContainer, updateVessel, updateBooking, addNotification } = useApp();

  const handleApprove = () => {
    if (task.type === 'clearance') {
      updateContainer(task.data.id, { status: 'ready' });
      addNotification({
        type: 'success',
        message: `Container ${task.data.id} cleared and approved`,
      });
    }
    toast.success(`${task.title} approved successfully`);
    setTimeout(onClose, 500);
  };

  const handleReject = () => {
    if (task.type === 'clearance') {
      addNotification({
        type: 'warning',
        message: `Container ${task.data.id} clearance rejected - requires review`,
      });
    }
    toast.error(`${task.title} rejected`);
    setTimeout(onClose, 500);
  };

  const handleDispatch = () => {
    if (task.type === 'reefer') {
      addNotification({
        type: 'info',
        message: `Technician dispatched to ${task.title} at ${task.data.location}`,
      });
      updateContainer(task.data.id, { alarm: false });
    }
    toast.success(`Technician dispatched to ${task.title}`);
    setTimeout(onClose, 500);
  };

  const handleUpdate = () => {
    if (task.type === 'vessel') {
      updateVessel(task.data.id, { progress: Math.min(task.data.progress + 10, 100) });
      addNotification({
        type: 'info',
        message: `${task.data.name} schedule updated - progress ${Math.min(task.data.progress + 10, 100)}%`,
      });
    } else if (task.type === 'reefer') {
      updateContainer(task.data.id, { 
        temperature: task.data.targetTemp,
        alarm: false 
      });
      addNotification({
        type: 'success',
        message: `Temperature adjusted for ${task.data.id} to ${task.data.targetTemp}°C`,
      });
    } else if (task.type === 'booking') {
      updateBooking(task.data.id, { status: 'completed' });
      addNotification({
        type: 'success',
        message: `Booking ${task.data.container} marked as completed`,
      });
    } else if (task.type === 'invoice') {
      addNotification({
        type: 'success',
        message: `Payment recorded for ${task.data.id} - $${task.data.amount.toLocaleString()}`,
      });
    }
    toast.success(`${task.title} updated successfully`);
    setTimeout(onClose, 500);
  };

  const renderDetailContent = () => {
    switch (task.type) {
      case 'vessel':
        return (
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Vessel Name</span>
                <span className="text-slate-100 font-medium">{task.data.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Berth</span>
                <span className="text-slate-100 font-medium">
                  {task.data.berth ? `Berth ${task.data.berth}` : 'Not Assigned'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Status</span>
                <span className={`font-medium ${
                  task.data.status === 'loading' ? 'text-emerald-400' :
                  task.data.status === 'unloading' ? 'text-blue-400' :
                  'text-orange-400'
                }`}>
                  {task.data.status.charAt(0).toUpperCase() + task.data.status.slice(1)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Containers</span>
                <span className="text-slate-100 font-medium">{task.data.containers} TEU</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">ETA</span>
                <span className="text-slate-100 font-medium">{task.data.eta}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">ETD</span>
                <span className="text-slate-100 font-medium">{task.data.etd}</span>
              </div>
            </div>

            {/* Progress */}
            <div className="bg-slate-800/50 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-slate-400 text-sm">Loading Progress</span>
                <span className="text-emerald-400 font-medium">{task.data.progress}%</span>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-emerald-500 to-emerald-600 h-2 rounded-full transition-all"
                  style={{ width: `${task.data.progress}%` }}
                />
              </div>
            </div>

            {userRole === 'berth' && (
              <div className="space-y-2">
                <button 
                  onClick={handleUpdate}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl p-4 font-medium"
                >
                  Update Schedule
                </button>
                <button 
                  onClick={onClose}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl p-4 font-medium"
                >
                  View Timeline
                </button>
              </div>
            )}
          </div>
        );

      case 'reefer':
        return (
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Container ID</span>
                <span className="text-slate-100 font-medium">{task.data.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Location</span>
                <span className="text-slate-100 font-medium">{task.data.location}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Cargo</span>
                <span className="text-slate-100 font-medium">{task.data.cargo}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Temperature</span>
                <span className={`font-medium ${task.data.alarm ? 'text-red-400' : 'text-emerald-400'}`}>
                  {task.data.temperature}°C
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Target</span>
                <span className="text-slate-100 font-medium">{task.data.targetTemp}°C</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Power</span>
                <span className="text-emerald-400 font-medium">{task.data.power}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Humidity</span>
                <span className="text-blue-400 font-medium">{task.data.humidity}%</span>
              </div>
            </div>

            {task.data.alarm && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
                <p className="text-red-400 font-medium mb-1">⚠️ Critical Alert</p>
                <p className="text-slate-300 text-sm">Temperature outside safe range. Immediate action required.</p>
              </div>
            )}

            <div className="space-y-2">
              <button 
                onClick={handleDispatch}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl p-4 font-medium flex items-center justify-center gap-2"
              >
                <Send className="w-5 h-5" />
                Dispatch Technician
              </button>
              <button 
                onClick={handleUpdate}
                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl p-4 font-medium"
              >
                Adjust Temperature
              </button>
            </div>
          </div>
        );

      case 'booking':
        return (
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Container</span>
                <span className="text-slate-100 font-medium">{task.data.container}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Truck Number</span>
                <span className="text-slate-100 font-medium">{task.data.truck}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Time Slot</span>
                <span className="text-emerald-400 font-medium">{task.data.slot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Date</span>
                <span className="text-slate-100 font-medium">{task.data.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Driver</span>
                <span className="text-slate-100 font-medium">{task.data.driver}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Contact</span>
                <span className="text-slate-100 font-medium">{task.data.contact}</span>
              </div>
            </div>

            {/* Gate Directions */}
            <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-5 h-5 text-blue-400" />
                <p className="text-blue-400 font-medium">Gate Information</p>
              </div>
              <p className="text-slate-300 text-sm">Report to Gate 2 - Container Yard Section A</p>
            </div>

            <div className="space-y-2">
              <button 
                onClick={handleUpdate}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl p-4 font-medium"
              >
                Get Directions
              </button>
              <button 
                onClick={onClose}
                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl p-4 font-medium"
              >
                Contact Support
              </button>
            </div>
          </div>
        );

      case 'clearance':
        return (
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Container ID</span>
                <span className="text-slate-100 font-medium">{task.data.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Destination</span>
                <span className="text-slate-100 font-medium">{task.data.destination}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Weight</span>
                <span className="text-slate-100 font-medium">{task.data.weight}T</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Type</span>
                <span className="text-slate-100 font-medium capitalize">{task.data.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Status</span>
                <span className="text-orange-400 font-medium capitalize">{task.data.status}</span>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-slate-300 font-medium mb-3">Documents</p>
              <div className="space-y-2">
                {['Bill of Lading', 'Commercial Invoice', 'Packing List'].map((doc) => (
                  <div key={doc} className="flex items-center justify-between py-2">
                    <span className="text-slate-400 text-sm">{doc}</span>
                    <Check className="w-4 h-4 text-emerald-400" />
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button 
                onClick={handleApprove}
                className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl p-4 font-medium flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Approve
              </button>
              <button 
                onClick={handleReject}
                className="bg-red-500 hover:bg-red-600 text-white rounded-xl p-4 font-medium flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                Reject
              </button>
            </div>
          </div>
        );

      case 'invoice':
        return (
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Invoice Number</span>
                <span className="text-slate-100 font-medium">{task.data.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Client</span>
                <span className="text-slate-100 font-medium">{task.data.client}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Amount</span>
                <span className="text-emerald-400 text-lg font-semibold">
                  ${task.data.amount.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Due Date</span>
                <span className="text-orange-400 font-medium">{task.data.due}</span>
              </div>
            </div>

            <div className="space-y-2">
              <button 
                onClick={handleUpdate}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl p-4 font-medium"
              >
                Record Payment
              </button>
              <button 
                onClick={onClose}
                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl p-4 font-medium"
              >
                Send Reminder
              </button>
            </div>
          </div>
        );

      case 'admin':
        return (
          <div className="space-y-4">
            <div className="bg-slate-800/50 rounded-xl p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Task Type</span>
                <span className="text-slate-100 font-medium capitalize">{task.data.action}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400 text-sm">Priority</span>
                <span className={`font-medium capitalize ${
                  task.data.priority === 'high' ? 'text-red-400' :
                  task.data.priority === 'medium' ? 'text-orange-400' :
                  'text-blue-400'
                }`}>
                  {task.data.priority}
                </span>
              </div>
            </div>

            <div className="bg-blue-500/20 border border-blue-500/50 rounded-xl p-4">
              <p className="text-blue-400 font-medium mb-2">Action Required</p>
              <p className="text-slate-300 text-sm">
                {task.data.action === 'backup' 
                  ? 'Perform system backup to ensure data integrity and disaster recovery readiness.'
                  : 'Review user access permissions and update roles as necessary.'}
              </p>
            </div>

            <div className="space-y-2">
              <button 
                onClick={handleUpdate}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl p-4 font-medium"
              >
                {task.data.action === 'backup' ? 'Start Backup' : 'Review Now'}
              </button>
              <button 
                onClick={onClose}
                className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl p-4 font-medium"
              >
                Schedule Later
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-slate-800/50 rounded-xl p-4">
            <p className="text-slate-400">Task details not available</p>
          </div>
        );
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 z-50 overflow-y-auto pb-6">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 px-4 py-4 flex items-center gap-3 z-10">
        <button onClick={onClose} className="p-2 -ml-2 hover:bg-slate-800 rounded-lg">
          <ArrowLeft className="w-5 h-5 text-slate-400" />
        </button>
        <div className="flex-1">
          <h1 className="text-lg text-slate-100 font-medium">Task Details</h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-6 space-y-4">
        {/* Title */}
        <div>
          <h2 className="text-xl text-slate-100 font-medium mb-1">{task.title}</h2>
          <p className="text-slate-400 text-sm">{task.subtitle}</p>
        </div>

        {/* Detail Content */}
        {renderDetailContent()}
      </div>
    </div>
  );
}