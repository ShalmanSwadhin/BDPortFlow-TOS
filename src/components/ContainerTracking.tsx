import { X, Package, MapPin, Calendar, Clock, TrendingUp, Ship, CheckCircle, AlertCircle, Truck, Box } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner@2.0.3';

interface ContainerTrackingProps {
  onClose: () => void;
  containerId?: string;
}

export default function ContainerTracking({ onClose, containerId }: ContainerTrackingProps) {
  const [searchId, setSearchId] = useState(containerId || 'TCLU3456789');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    setTimeout(() => {
      setIsSearching(false);
      toast.success('Container found!');
    }, 1000);
  };

  const containerData = {
    id: searchId,
    status: 'Ready for Pickup',
    statusColor: 'emerald',
    type: '40ft High Cube',
    weight: '24,500 kg',
    location: 'Block A-12, Row 3, Tier 2',
    gate: 'Gate 3',
    timeSlot: '14:30 - 15:00',
    vessel: 'MV HARMONY',
    eta: 'Jan 14, 2026',
    clearance: 'Customs Cleared',
    holds: 'None',
  };

  const timeline = [
    { 
      status: 'Vessel Arrived', 
      time: 'Jan 12, 10:00', 
      icon: Ship, 
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/50',
      completed: true 
    },
    { 
      status: 'Container Discharged', 
      time: 'Jan 12, 14:30', 
      icon: Box, 
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/50',
      completed: true 
    },
    { 
      status: 'Customs Cleared', 
      time: 'Jan 13, 11:00', 
      icon: CheckCircle, 
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500/50',
      completed: true 
    },
    { 
      status: 'Ready for Pickup', 
      time: 'Jan 14, 08:00', 
      icon: Package, 
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/50',
      completed: true,
      current: true
    },
    { 
      status: 'Gate Out', 
      time: 'Pending', 
      icon: Truck, 
      color: 'text-slate-500',
      bgColor: 'bg-slate-500/10',
      borderColor: 'border-slate-700',
      completed: false 
    },
  ];

  const getStatusColor = (color: string) => {
    const colors = {
      emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      orange: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      red: 'bg-red-500/20 text-red-400 border-red-500/50',
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Package className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl text-white">Container Tracking</h2>
              <p className="text-purple-100 text-sm">Real-time container location and status</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Search Bar */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-6">
            <label className="text-slate-400 text-sm mb-2 block">Enter Container ID</label>
            <div className="flex gap-3">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value.toUpperCase())}
                placeholder="e.g., TCLU3456789"
                className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
              />
              <button
                onClick={handleSearch}
                disabled={isSearching}
                className="px-6 py-3 bg-purple-500 hover:bg-purple-600 disabled:bg-slate-700 text-white rounded-lg transition-colors"
              >
                {isSearching ? 'Searching...' : 'Track'}
              </button>
            </div>
          </div>

          {/* Container Status Card */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-xl p-6 mb-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-2xl mb-2">{containerData.id}</h3>
                <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm ${getStatusColor(containerData.statusColor)}`}>
                  <CheckCircle className="w-4 h-4" />
                  {containerData.status}
                </span>
              </div>
              <div className="text-right">
                <p className="text-slate-400 text-sm mb-1">Vessel</p>
                <p className="text-slate-200 font-medium">{containerData.vessel}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-700">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Box className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400 text-xs">Type</span>
                </div>
                <p className="text-slate-200">{containerData.type}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <TrendingUp className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400 text-xs">Weight</span>
                </div>
                <p className="text-slate-200">{containerData.weight}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <CheckCircle className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400 text-xs">Clearance</span>
                </div>
                <p className="text-emerald-400">{containerData.clearance}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <AlertCircle className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-400 text-xs">Holds</span>
                </div>
                <p className="text-slate-400">{containerData.holds}</p>
              </div>
            </div>
          </div>

          {/* Location & Pickup Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-emerald-400" />
                <h4 className="text-lg">Current Location</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Yard Position</p>
                  <p className="text-slate-200 text-lg font-medium">{containerData.location}</p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Zone</span>
                    <span className="text-emerald-400 font-medium">A-12</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-5 h-5 text-blue-400" />
                <h4 className="text-lg">Pickup Details</h4>
              </div>
              <div className="space-y-3">
                <div>
                  <p className="text-slate-400 text-sm mb-1">Assigned Time Slot</p>
                  <p className="text-slate-200 text-lg font-medium">{containerData.timeSlot}</p>
                </div>
                <div className="p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Gate</span>
                    <span className="text-blue-400 font-medium">{containerData.gate}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
            <h4 className="text-lg mb-6">Container Journey</h4>
            <div className="space-y-4">
              {timeline.map((event, idx) => {
                const Icon = event.icon;
                return (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-10 h-10 ${event.bgColor} border ${event.borderColor} rounded-full flex items-center justify-center ${event.current ? 'ring-4 ring-yellow-500/20' : ''}`}>
                        <Icon className={`w-5 h-5 ${event.color}`} />
                      </div>
                      {idx < timeline.length - 1 && (
                        <div className={`w-0.5 h-8 ${event.completed ? 'bg-emerald-500/50' : 'bg-slate-700'}`}></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center justify-between mb-1">
                        <p className={`font-medium ${event.completed ? 'text-slate-200' : 'text-slate-500'}`}>
                          {event.status}
                          {event.current && (
                            <span className="ml-2 px-2 py-0.5 bg-yellow-500/20 text-yellow-400 border border-yellow-500/50 rounded text-xs">
                              Current
                            </span>
                          )}
                        </p>
                        <span className="text-slate-500 text-sm">{event.time}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              onClick={() => toast.info('Downloading container details...')}
              className="px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 rounded-lg transition-colors"
            >
              Download Report
            </button>
            <button
              onClick={() => toast.info('Sharing tracking link...')}
              className="px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/50 rounded-lg transition-colors"
            >
              Share Tracking
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
