import { useState } from 'react';
import { Ship, Anchor, AlertTriangle, Calendar, Clock, Waves, X, Save, Package, Truck, MapPin } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import BerthTimeline from './BerthTimeline';

export default function BerthPlanner() {
  const [selectedVessel, setSelectedVessel] = useState<any>(null);
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [showModifySchedule, setShowModifySchedule] = useState(false);
  const [showStowageView, setShowStowageView] = useState(false);
  const [scheduleData, setScheduleData] = useState({
    eta: '',
    etd: '',
    berth: '',
    priority: 'normal',
    notes: ''
  });

  const vessels = [
    {
      id: 1,
      name: 'MV HARMONY',
      length: 280,
      draft: 12.5,
      eta: '14:30',
      etd: '18:00',
      berth: 1,
      status: 'loading',
      cargo: 'Container',
      containers: 245,
      progress: 65,
      color: '#00ff88',
    },
    {
      id: 2,
      name: 'MSC AURORA',
      length: 350,
      draft: 14.2,
      eta: '16:00',
      etd: '22:00',
      berth: 2,
      status: 'unloading',
      cargo: 'Container',
      containers: 412,
      progress: 45,
      color: '#00d4ff',
    },
    {
      id: 3,
      name: 'MAERSK LIBERTY',
      length: 320,
      draft: 13.8,
      eta: '09:00',
      etd: '15:00',
      berth: 3,
      status: 'loading',
      cargo: 'Container',
      containers: 328,
      progress: 85,
      color: '#ffd700',
    },
    {
      id: 4,
      name: 'EVERGREEN PRIDE',
      length: 290,
      draft: 13.0,
      eta: 'Tomorrow 08:00',
      etd: 'Tomorrow 16:00',
      berth: null,
      status: 'incoming',
      cargo: 'Container',
      containers: 298,
      progress: 0,
      color: '#ff6b35',
    },
  ];

  const berths = [
    { id: 1, length: 300, depth: 15, status: 'occupied', vessel: vessels[0] },
    { id: 2, length: 380, depth: 16, status: 'occupied', vessel: vessels[1] },
    { id: 3, length: 350, depth: 15.5, status: 'occupied', vessel: vessels[2] },
    { id: 4, length: 320, depth: 14, status: 'available', vessel: null },
    { id: 5, length: 280, depth: 13, status: 'maintenance', vessel: null },
  ];

  const timeSlots = [
    '00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00',
    '14:00', '16:00', '18:00', '20:00', '22:00'
  ];

  const getBerthUtilization = () => {
    const occupied = berths.filter(b => b.status === 'occupied').length;
    return Math.round((occupied / berths.length) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl mb-2">Berth Planning & Scheduling</h2>
          <p className="text-slate-400 text-sm sm:text-base">Vessel management and dock allocation</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="px-3 sm:px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg">
            <span className="text-slate-400 text-xs sm:text-sm">Utilization: </span>
            <span className="text-emerald-400 text-sm sm:text-base">{getBerthUtilization()}%</span>
          </div>
          <button 
            onClick={() => {
              toast.success('Vessel scheduling started', {
                description: 'Opening berth allocation interface',
              });
              setShowScheduleForm(true);
            }}
            className="px-3 sm:px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm sm:text-base whitespace-nowrap"
          >
            Schedule Vessel
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Ship className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl text-emerald-400 mb-1">8</div>
          <div className="text-slate-400 text-sm">Vessels in Port</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Anchor className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl text-blue-400 mb-1">3</div>
          <div className="text-slate-400 text-sm">Incoming Today</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Clock className="w-5 h-5 text-yellow-400 mb-2" />
          <div className="text-2xl text-yellow-400 mb-1">18.5h</div>
          <div className="text-slate-400 text-sm">Avg Turnaround</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-orange-400 mb-2" />
          <div className="text-2xl text-orange-400 mb-1">1</div>
          <div className="text-slate-400 text-sm">Berth Conflict</div>
        </div>
      </div>

      {/* Berth Schedule Timeline */}
      <BerthTimeline berths={berths} />

      {/* Current Berth Allocation */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl mb-4">Current Berth Allocation</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {berths.map((berth) => (
            <div
              key={berth.id}
              className={`relative overflow-hidden rounded-lg border-2 transition-all ${
                berth.status === 'occupied'
                  ? 'border-emerald-500/50 bg-slate-800/50'
                  : berth.status === 'maintenance'
                  ? 'border-orange-500/50 bg-slate-800/50'
                  : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
              }`}
            >
              {/* Berth Header */}
              <div className="p-3 bg-slate-900/50 border-b border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <div className="text-base font-medium text-slate-200">Berth {berth.id}</div>
                  <div className={`text-xs px-2 py-1 rounded ${
                    berth.status === 'occupied' ? 'bg-emerald-500/20 text-emerald-400' :
                    berth.status === 'maintenance' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-slate-700 text-slate-400'
                  }`}>
                    {berth.status}
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  {berth.length}m × {berth.depth}m depth
                </div>
              </div>

              {/* Vessel Info or Empty State */}
              <div className="p-4">
                {berth.vessel ? (
                  <div className="space-y-3">
                    <div
                      className="cursor-pointer"
                      onClick={() => setSelectedVessel(berth.vessel)}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <Ship className="w-4 h-4 mt-0.5" style={{ color: berth.vessel.color }} />
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-slate-200 truncate">
                            {berth.vessel.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {berth.vessel.length}m / {berth.vessel.draft}m draft
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">ETA:</span>
                          <span className="text-slate-300">{berth.vessel.eta}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">ETD:</span>
                          <span className="text-slate-300">{berth.vessel.etd}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500">Containers:</span>
                          <span className="text-slate-300">{berth.vessel.containers}</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-500">Progress</span>
                          <span className="text-xs font-medium" style={{ color: berth.vessel.color }}>
                            {berth.vessel.progress}%
                          </span>
                        </div>
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className="h-full transition-all rounded-full"
                            style={{
                              width: `${berth.vessel.progress}%`,
                              backgroundColor: berth.vessel.color
                            }}
                          ></div>
                        </div>
                      </div>

                      {/* Status Badge */}
                      <div className="mt-3 flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: berth.vessel.color }}></div>
                        <span className="text-xs uppercase" style={{ color: berth.vessel.color }}>
                          {berth.vessel.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : berth.status === 'maintenance' ? (
                  <div className="py-8 text-center">
                    <AlertTriangle className="w-8 h-8 text-orange-400 mx-auto mb-2" />
                    <div className="text-sm text-orange-400">Under Maintenance</div>
                    <div className="text-xs text-slate-500 mt-1">Est. completion: 18:00</div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Anchor className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                    <div className="text-sm text-slate-500">Available</div>
                    <button
                      onClick={() => setShowScheduleForm(true)}
                      className="mt-3 text-xs text-emerald-400 hover:text-emerald-300"
                    >
                      + Assign Vessel
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vessel Details & Incoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selected Vessel Detail */}
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl mb-4">
            {selectedVessel ? `Vessel Details - ${selectedVessel.name}` : 'Select a Vessel'}
          </h3>
          
          {selectedVessel ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-slate-400 text-sm mb-1">Length</div>
                  <div className="text-slate-200">{selectedVessel.length}m</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Draft</div>
                  <div className="text-slate-200">{selectedVessel.draft}m</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">ETA</div>
                  <div className="text-slate-200">{selectedVessel.eta}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">ETD</div>
                  <div className="text-slate-200">{selectedVessel.etd}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Cargo Type</div>
                  <div className="text-slate-200">{selectedVessel.cargo}</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Containers</div>
                  <div className="text-slate-200">{selectedVessel.containers}</div>
                </div>
              </div>

              {/* Loading Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-sm">Operation Progress</span>
                  <span className="text-emerald-400">{selectedVessel.progress}%</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"
                    style={{ width: `${selectedVessel.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="p-4 rounded-lg" style={{ backgroundColor: `${selectedVessel.color}20` }}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full animate-pulse" style={{ backgroundColor: selectedVessel.color }}></div>
                  <span style={{ color: selectedVessel.color }} className="uppercase text-sm">
                    {selectedVessel.status}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button 
                  onClick={() => {
                    toast.info('Schedule modification', {
                      description: `Opening editor for ${selectedVessel.name}`,
                    });
                    setShowModifySchedule(true);
                  }}
                  className="flex-1 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 rounded-lg transition-colors"
                >
                  Modify Schedule
                </button>
                <button 
                  onClick={() => {
                    toast.info('Stowage plan', {
                      description: `Loading cargo plan for ${selectedVessel.name}`,
                    });
                    setShowStowageView(true);
                  }}
                  className="flex-1 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 rounded-lg transition-colors"
                >
                  View Stowage
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-slate-500">
              Click on a vessel in the timeline to view details
            </div>
          )}
        </div>

        {/* Incoming Vessels */}
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">Incoming Vessels</h3>
            <Calendar className="w-5 h-5 text-slate-400" />
          </div>

          <div className="space-y-3">
            {vessels.filter(v => v.status === 'incoming').map((vessel) => (
              <div
                key={vessel.id}
                className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg hover:border-slate-600 transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-slate-200 mb-1">{vessel.name}</div>
                    <div className="text-sm text-slate-400">{vessel.cargo} Vessel</div>
                  </div>
                  <div className="px-3 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                    Incoming
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-slate-500 text-xs">ETA</div>
                    <div className="text-slate-300">{vessel.eta}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs">Length</div>
                    <div className="text-slate-300">{vessel.length}m</div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-xs">Draft</div>
                    <div className="text-slate-300">{vessel.draft}m</div>
                  </div>
                </div>

                {/* Berth Compatibility Check */}
                <div className="mt-3 pt-3 border-t border-slate-700">
                  <div className="flex items-center gap-2 text-sm">
                    <Waves className="w-4 h-4 text-emerald-400" />
                    <span className="text-slate-400">Compatible berths:</span>
                    <span className="text-emerald-400">1, 2, 3, 4</span>
                  </div>
                </div>
              </div>
            ))}

            {/* Add More */}
            <button
              onClick={() => setShowScheduleForm(true)}
              className="w-full py-3 border-2 border-dashed border-slate-700 rounded-lg text-slate-400 hover:border-slate-600 hover:text-slate-300 transition-all"
            >
              + Schedule New Vessel
            </button>
          </div>
        </div>
      </div>

      {/* Berth Status Overview */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl mb-4">Berth Status Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {berths.map((berth) => (
            <div
              key={berth.id}
              className={`p-4 rounded-lg border-2 transition-all ${
                berth.status === 'occupied'
                  ? 'border-emerald-500/50 bg-emerald-500/10'
                  : berth.status === 'maintenance'
                  ? 'border-orange-500/50 bg-orange-500/10'
                  : 'border-slate-700 bg-slate-800/30'
              }`}
            >
              <div className="text-lg mb-2">Berth {berth.id}</div>
              <div className="text-xs text-slate-400 mb-3">
                {berth.length}m × {berth.depth}m depth
              </div>
              {berth.vessel ? (
                <div>
                  <div className="text-sm text-slate-300 mb-1">{berth.vessel.name}</div>
                  <div className="text-xs text-slate-500">{berth.vessel.containers} containers</div>
                </div>
              ) : (
                <div className={`text-sm ${berth.status === 'available' ? 'text-slate-500' : 'text-orange-400'}`}>
                  {berth.status === 'available' ? 'Available' : 'Under Maintenance'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Schedule New Vessel Modal */}
      {showScheduleForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl text-emerald-400 mb-6">Schedule New Vessel</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Vessel Name *</label>
                  <input
                    type="text"
                    placeholder="MV EXAMPLE"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">IMO Number</label>
                  <input
                    type="text"
                    placeholder="IMO 1234567"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Length (m) *</label>
                  <input
                    type="number"
                    placeholder="280"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Draft (m) *</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="12.5"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">ETA *</label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">ETD *</label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Preferred Berth</label>
                  <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500">
                    <option value="">Auto Assign</option>
                    <option>Berth 1</option>
                    <option>Berth 2</option>
                    <option>Berth 3</option>
                    <option>Berth 4</option>
                    <option>Berth 5</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Cargo Type *</label>
                  <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500" required>
                    <option>Container</option>
                    <option>Bulk Cargo</option>
                    <option>Break Bulk</option>
                    <option>Liquid Cargo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Expected Containers</label>
                  <input
                    type="number"
                    placeholder="245"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Agent</label>
                  <input
                    type="text"
                    placeholder="Shipping Agent Name"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Special Requirements</label>
                <textarea
                  rows={3}
                  placeholder="Enter any special handling requirements..."
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowScheduleForm(false)}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Vessel scheduled successfully!');
                    setShowScheduleForm(false);
                  }}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                >
                  Schedule Vessel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modify Schedule Modal */}
      {showModifySchedule && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl text-emerald-400 mb-6">Modify Vessel Schedule</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Vessel Name *</label>
                  <input
                    type="text"
                    placeholder="MV EXAMPLE"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">IMO Number</label>
                  <input
                    type="text"
                    placeholder="IMO 1234567"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Length (m) *</label>
                  <input
                    type="number"
                    placeholder="280"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Draft (m) *</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="12.5"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">ETA *</label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">ETD *</label>
                  <input
                    type="datetime-local"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Preferred Berth</label>
                  <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500">
                    <option value="">Auto Assign</option>
                    <option>Berth 1</option>
                    <option>Berth 2</option>
                    <option>Berth 3</option>
                    <option>Berth 4</option>
                    <option>Berth 5</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Cargo Type *</label>
                  <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500" required>
                    <option>Container</option>
                    <option>Bulk Cargo</option>
                    <option>Break Bulk</option>
                    <option>Liquid Cargo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Expected Containers</label>
                  <input
                    type="number"
                    placeholder="245"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Agent</label>
                  <input
                    type="text"
                    placeholder="Shipping Agent Name"
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Special Requirements</label>
                <textarea
                  rows={3}
                  placeholder="Enter any special handling requirements..."
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModifySchedule(false)}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Vessel schedule modified successfully!');
                    setShowModifySchedule(false);
                  }}
                  className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Stowage View Modal */}
      {showStowageView && selectedVessel && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-xl p-6 max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-xl text-emerald-400">Stowage Plan - {selectedVessel.name}</h3>
                <p className="text-sm text-slate-400 mt-1">Container positioning and cargo distribution</p>
              </div>
              <button
                onClick={() => setShowStowageView(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            {/* Vessel Stats Summary */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <Package className="w-5 h-5 text-emerald-400 mb-2" />
                <div className="text-2xl text-emerald-400">{selectedVessel.containers}</div>
                <div className="text-xs text-slate-400">Total Containers</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <Truck className="w-5 h-5 text-blue-400 mb-2" />
                <div className="text-2xl text-blue-400">{Math.floor(selectedVessel.containers * selectedVessel.progress / 100)}</div>
                <div className="text-xs text-slate-400">Processed</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <MapPin className="w-5 h-5 text-yellow-400 mb-2" />
                <div className="text-2xl text-yellow-400">{selectedVessel.berth || 'N/A'}</div>
                <div className="text-xs text-slate-400">Berth Position</div>
              </div>
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                <Clock className="w-5 h-5 text-orange-400 mb-2" />
                <div className="text-2xl text-orange-400">{selectedVessel.progress}%</div>
                <div className="text-xs text-slate-400">Progress</div>
              </div>
            </div>

            {/* Stowage Grid Visualization */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 mb-6">
              <h4 className="text-lg text-slate-200 mb-4">Container Bay Layout</h4>
              <div className="space-y-2">
                {/* Bay Headers */}
                <div className="grid grid-cols-12 gap-1 mb-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bay) => (
                    <div key={bay} className="text-center text-xs text-slate-400">
                      {bay.toString().padStart(2, '0')}
                    </div>
                  ))}
                </div>
                
                {/* Row 1 - Deck */}
                <div className="grid grid-cols-12 gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bay) => {
                    const hasContainer = Math.random() > 0.3;
                    const containerTypes = ['20ft', '40ft', 'reefer', 'hazmat'];
                    const type = containerTypes[Math.floor(Math.random() * containerTypes.length)];
                    const colors = {
                      '20ft': 'bg-emerald-500/30 border-emerald-500',
                      '40ft': 'bg-blue-500/30 border-blue-500',
                      'reefer': 'bg-cyan-500/30 border-cyan-500',
                      'hazmat': 'bg-orange-500/30 border-orange-500'
                    };
                    
                    return hasContainer ? (
                      <div
                        key={bay}
                        className={`h-12 ${colors[type as keyof typeof colors]} border-2 rounded flex items-center justify-center text-xs cursor-pointer hover:brightness-125 transition-all`}
                        title={`Bay ${bay} - ${type}`}
                      >
                        <Package className="w-3 h-3" />
                      </div>
                    ) : (
                      <div key={bay} className="h-12 bg-slate-900/50 border border-slate-700 rounded"></div>
                    );
                  })}
                </div>

                {/* Row 2 - Deck */}
                <div className="grid grid-cols-12 gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bay) => {
                    const hasContainer = Math.random() > 0.2;
                    const containerTypes = ['20ft', '40ft', 'reefer', 'hazmat'];
                    const type = containerTypes[Math.floor(Math.random() * containerTypes.length)];
                    const colors = {
                      '20ft': 'bg-emerald-500/30 border-emerald-500',
                      '40ft': 'bg-blue-500/30 border-blue-500',
                      'reefer': 'bg-cyan-500/30 border-cyan-500',
                      'hazmat': 'bg-orange-500/30 border-orange-500'
                    };
                    
                    return hasContainer ? (
                      <div
                        key={bay}
                        className={`h-12 ${colors[type as keyof typeof colors]} border-2 rounded flex items-center justify-center text-xs cursor-pointer hover:brightness-125 transition-all`}
                        title={`Bay ${bay} - ${type}`}
                      >
                        <Package className="w-3 h-3" />
                      </div>
                    ) : (
                      <div key={bay} className="h-12 bg-slate-900/50 border border-slate-700 rounded"></div>
                    );
                  })}
                </div>

                {/* Deck Separator */}
                <div className="flex items-center gap-2 py-2">
                  <div className="flex-1 h-px bg-slate-700"></div>
                  <span className="text-xs text-slate-500">DECK / HOLD</span>
                  <div className="flex-1 h-px bg-slate-700"></div>
                </div>

                {/* Row 3 - Hold */}
                <div className="grid grid-cols-12 gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bay) => {
                    const hasContainer = Math.random() > 0.15;
                    const containerTypes = ['20ft', '40ft', 'reefer', 'hazmat'];
                    const type = containerTypes[Math.floor(Math.random() * containerTypes.length)];
                    const colors = {
                      '20ft': 'bg-emerald-500/30 border-emerald-500',
                      '40ft': 'bg-blue-500/30 border-blue-500',
                      'reefer': 'bg-cyan-500/30 border-cyan-500',
                      'hazmat': 'bg-orange-500/30 border-orange-500'
                    };
                    
                    return hasContainer ? (
                      <div
                        key={bay}
                        className={`h-12 ${colors[type as keyof typeof colors]} border-2 rounded flex items-center justify-center text-xs cursor-pointer hover:brightness-125 transition-all`}
                        title={`Bay ${bay} - ${type}`}
                      >
                        <Package className="w-3 h-3" />
                      </div>
                    ) : (
                      <div key={bay} className="h-12 bg-slate-900/50 border border-slate-700 rounded"></div>
                    );
                  })}
                </div>

                {/* Row 4 - Hold */}
                <div className="grid grid-cols-12 gap-1">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((bay) => {
                    const hasContainer = Math.random() > 0.1;
                    const containerTypes = ['20ft', '40ft', 'reefer', 'hazmat'];
                    const type = containerTypes[Math.floor(Math.random() * containerTypes.length)];
                    const colors = {
                      '20ft': 'bg-emerald-500/30 border-emerald-500',
                      '40ft': 'bg-blue-500/30 border-blue-500',
                      'reefer': 'bg-cyan-500/30 border-cyan-500',
                      'hazmat': 'bg-orange-500/30 border-orange-500'
                    };
                    
                    return hasContainer ? (
                      <div
                        key={bay}
                        className={`h-12 ${colors[type as keyof typeof colors]} border-2 rounded flex items-center justify-center text-xs cursor-pointer hover:brightness-125 transition-all`}
                        title={`Bay ${bay} - ${type}`}
                      >
                        <Package className="w-3 h-3" />
                      </div>
                    ) : (
                      <div key={bay} className="h-12 bg-slate-900/50 border border-slate-700 rounded"></div>
                    );
                  })}
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-700">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-emerald-500/30 border-2 border-emerald-500 rounded"></div>
                  <span className="text-xs text-slate-400">20ft Standard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-500/30 border-2 border-blue-500 rounded"></div>
                  <span className="text-xs text-slate-400">40ft Standard</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-cyan-500/30 border-2 border-cyan-500 rounded"></div>
                  <span className="text-xs text-slate-400">Reefer</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500/30 border-2 border-orange-500 rounded"></div>
                  <span className="text-xs text-slate-400">Hazmat</span>
                </div>
              </div>
            </div>

            {/* Container Details Table */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg overflow-hidden mb-6">
              <div className="p-4 border-b border-slate-700">
                <h4 className="text-lg text-slate-200">Container Details</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs text-slate-400">Container ID</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-400">Type</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-400">Bay</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-400">Weight</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-400">Status</th>
                      <th className="px-4 py-3 text-left text-xs text-slate-400">Destination</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-t border-slate-700">
                      <td className="px-4 py-3 text-sm text-slate-300">TCLU4567890</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">20ft</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">03</td>
                      <td className="px-4 py-3 text-sm text-slate-300">18.5 T</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">Loaded</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">Singapore</td>
                    </tr>
                    <tr className="border-t border-slate-700">
                      <td className="px-4 py-3 text-sm text-slate-300">MSCU7654321</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">40ft</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">07</td>
                      <td className="px-4 py-3 text-sm text-slate-300">22.3 T</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 text-xs rounded">Loading</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">Dubai</td>
                    </tr>
                    <tr className="border-t border-slate-700">
                      <td className="px-4 py-3 text-sm text-slate-300">TEMU2345678</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-cyan-500/20 text-cyan-400 text-xs rounded">Reefer</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">05</td>
                      <td className="px-4 py-3 text-sm text-slate-300">20.1 T</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded">Loaded</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">Rotterdam</td>
                    </tr>
                    <tr className="border-t border-slate-700">
                      <td className="px-4 py-3 text-sm text-slate-300">HLCU8901234</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded">Hazmat</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">11</td>
                      <td className="px-4 py-3 text-sm text-slate-300">15.7 T</td>
                      <td className="px-4 py-3 text-sm">
                        <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded">Ready</span>
                      </td>
                      <td className="px-4 py-3 text-sm text-slate-300">Mumbai</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <button
                className="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                Export Plan
              </button>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowStowageView(false);
                    setShowModifySchedule(true);
                  }}
                  className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 rounded-lg transition-colors"
                >
                  Modify Schedule
                </button>
                <button
                  onClick={() => setShowStowageView(false)}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}