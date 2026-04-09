import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Snowflake, AlertTriangle, TrendingDown, Thermometer, Battery, Zap, Phone } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import TechnicianDispatchModal from './TechnicianDispatchModal';
import { toast } from 'sonner@2.0.3';
import ReeferHistoryModal from './ReeferHistoryModal';

export default function ReeferMonitoring() {
  const { containers, updateContainer, addNotification } = useApp();
  const [selectedReefer, setSelectedReefer] = useState<any>(null);
  const [adjustTemp, setAdjustTemp] = useState(false);
  const [newTemp, setNewTemp] = useState('');
  const [showTechModal, setShowTechModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const reefers = containers.filter(c => c.type === 'reefer' && c.temperature !== undefined);

  const handleAdjustTemp = () => {
    if (!selectedReefer || !newTemp) return;
    
    const temp = parseFloat(newTemp);
    updateContainer(selectedReefer.id, { targetTemp: temp });
    addNotification({
      type: 'success',
      message: `Target temperature updated for ${selectedReefer.id} to ${temp}°C`,
    });
    setAdjustTemp(false);
    setNewTemp('');
  };

  const handleDispatchTechnician = (techId: number) => {
    if (!selectedReefer) return;
    
    addNotification({
      type: 'info',
      message: `Technician dispatched for container ${selectedReefer.id}`,
    });
  };

  const handleAcknowledgeAlert = (container: any) => {
    updateContainer(container.id, { alarm: false });
    addNotification({
      type: 'success',
      message: `Alert acknowledged for ${container.id}`,
    });
  };

  const tempHistory = [
    { time: '00:00', temp: -18.2 },
    { time: '04:00', temp: -18.4 },
    { time: '08:00', temp: -18.1 },
    { time: '12:00', temp: -18.5 },
    { time: '16:00', temp: -18.3 },
    { time: '20:00', temp: -18.6 },
    { time: '23:59', temp: -18.5 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return { bg: '#00ff88', text: 'text-emerald-400', border: 'border-emerald-500' };
      case 'warning': return { bg: '#ffd700', text: 'text-yellow-400', border: 'border-yellow-500' };
      case 'critical': return { bg: '#ef4444', text: 'text-red-400', border: 'border-red-500' };
      default: return { bg: '#64748b', text: 'text-slate-400', border: 'border-slate-500' };
    }
  };

  const getTempStatus = (current: number, target: number) => {
    const diff = Math.abs(current - target);
    if (diff > 3) return 'critical';
    if (diff > 1) return 'warning';
    return 'normal';
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl mb-2">Reefer Container Monitoring</h2>
          <p className="text-slate-400">Real-time temperature and power management</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-red-500/20 border border-red-500/50 rounded-lg">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-400">2 Alerts Active</span>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Snowflake className="w-5 h-5 text-cyan-400 mb-2" />
          <div className="text-2xl text-cyan-400 mb-1">54</div>
          <div className="text-slate-400 text-sm">Active Reefers</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-red-400 mb-2" />
          <div className="text-2xl text-red-400 mb-1">1</div>
          <div className="text-slate-400 text-sm">Critical Alerts</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <TrendingDown className="w-5 h-5 text-yellow-400 mb-2" />
          <div className="text-2xl text-yellow-400 mb-1">1</div>
          <div className="text-slate-400 text-sm">Warnings</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Zap className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl text-emerald-400 mb-1">91%</div>
          <div className="text-slate-400 text-sm">Avg Power Level</div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reefer Grid */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl mb-4">Reefer Container Wall</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {reefers.map((reefer) => {
              const statusColors = getStatusColor(reefer.status);
              const tempStatus = getTempStatus(reefer.currentTemp, reefer.targetTemp);
              const tempColors = getStatusColor(tempStatus);

              return (
                <div
                  key={reefer.id}
                  onClick={() => setSelectedReefer(reefer)}
                  className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all hover:scale-105 min-w-[150px] md:min-w-0 ${
                    selectedReefer?.id === reefer.id
                      ? `${statusColors.border} bg-slate-800`
                      : 'border-slate-700 bg-slate-800/50'
                  } ${reefer.alarm ? 'animate-pulse' : ''}`}
                >
                  {/* Alarm Indicator */}
                  {reefer.alarm && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
                  )}

                  {/* Container ID */}
                  <div className="text-xs text-slate-400 mb-2">{reefer.id}</div>

                  {/* Temperature Display */}
                  <div className="flex items-center justify-center mb-3">
                    <div className="relative">
                      <div
                        className={`text-3xl ${tempColors.text}`}
                      >
                        {reefer.currentTemp}°
                      </div>
                      <Thermometer
                        className="absolute -left-6 top-1/2 -translate-y-1/2 w-4 h-4"
                        style={{ color: tempColors.bg }}
                      />
                    </div>
                  </div>

                  {/* Target Temp */}
                  <div className="text-xs text-slate-500 text-center mb-2">
                    Target: {reefer.targetTemp}°C
                  </div>

                  {/* Power Level */}
                  <div className="flex items-center gap-2 mb-2">
                    <Battery className="w-3 h-3 text-slate-500" />
                    <div className="flex-1 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600"
                        style={{ width: `${reefer.power}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-slate-500">{reefer.power}%</span>
                  </div>

                  {/* Location */}
                  <div className="text-xs text-slate-500">{reefer.location}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Reefer Details */}
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl mb-4">
            {selectedReefer ? 'Container Details' : 'Select Container'}
          </h3>

          {selectedReefer ? (
            <div className="space-y-4">
              {/* Status Badge */}
              <div
                className={`p-4 rounded-lg border-2 ${getStatusColor(selectedReefer.status).border}`}
                style={{ backgroundColor: `${getStatusColor(selectedReefer.status).bg}20` }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Status</span>
                  <span
                    className={`uppercase text-sm ${getStatusColor(selectedReefer.status).text}`}
                  >
                    {selectedReefer.status}
                  </span>
                </div>
                <div className="text-sm text-slate-400">{selectedReefer.id}</div>
              </div>

              {/* Temperature Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">Current Temp</span>
                  <span className="text-cyan-400 text-xl">{selectedReefer.currentTemp}°C</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">Target Temp</span>
                  <span className="text-slate-300">{selectedReefer.targetTemp}°C</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">Humidity</span>
                  <span className="text-blue-400">{selectedReefer.humidity}%</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">Power Level</span>
                  <span className="text-emerald-400">{selectedReefer.power}%</span>
                </div>
              </div>

              {/* Cargo Info */}
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="text-slate-400 text-sm mb-1">Cargo Type</div>
                <div className="text-slate-200">{selectedReefer.cargo}</div>
                <div className="text-slate-400 text-sm mt-2">Location</div>
                <div className="text-slate-200">{selectedReefer.location}</div>
              </div>

              {/* Temperature Chart */}
              <div className="p-4 bg-slate-800/50 rounded-lg">
                <div className="text-slate-400 text-sm mb-3">Temperature (24h)</div>
                <ResponsiveContainer width="100%" height={120}>
                  <LineChart data={tempHistory}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '10px' }} />
                    <YAxis stroke="#64748b" style={{ fontSize: '10px' }} domain={[-25, 5]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                      }}
                    />
                    <Line type="monotone" dataKey="temp" stroke="#00d4ff" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                {!adjustTemp ? (
                  <>
                    <button
                      onClick={() => {
                        setAdjustTemp(true);
                        setNewTemp(selectedReefer.targetTemp?.toString() || '');
                      }}
                      className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 rounded-lg transition-colors"
                    >
                      Adjust Temperature
                    </button>
                    <button
                      onClick={() => setShowTechModal(true)}
                      className="w-full px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/50 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      Dispatch Technician
                    </button>
                    <button
                      onClick={() => setShowHistoryModal(true)}
                      className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                    >
                      View Full History
                    </button>
                  </>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-slate-400 text-sm mb-2">New Target Temperature (°C)</label>
                      <input
                        type="number"
                        value={newTemp}
                        onChange={(e) => setNewTemp(e.target.value)}
                        step="0.1"
                        className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleAdjustTemp}
                        className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                      >
                        Apply
                      </button>
                      <button
                        onClick={() => {
                          setAdjustTemp(false);
                          setNewTemp('');
                        }}
                        className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-slate-500">
              <Snowflake className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a reefer container to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl mb-4">Active Alerts</h3>
        {reefers.filter(r => r.alarm).length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Snowflake className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No active alerts</p>
          </div>
        ) : (
          <div className="space-y-3">
            {reefers.filter(r => r.alarm).map((container) => {
              const tempDiff = Math.abs((container.temperature || 0) - (container.targetTemp || 0));
              const isCritical = tempDiff > 3;

              return (
                <div
                  key={container.id}
                  onClick={() => setSelectedReefer(container)}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    isCritical
                      ? 'bg-red-500/10 border-red-500/50 hover:bg-red-500/20'
                      : 'bg-yellow-500/10 border-yellow-500/50 hover:bg-yellow-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <AlertTriangle
                        className={`w-5 h-5 mt-0.5 ${
                          isCritical ? 'text-red-400' : 'text-yellow-400'
                        }`}
                      />
                      <div>
                        <div className={`mb-1 ${isCritical ? 'text-red-400' : 'text-yellow-400'}`}>
                          {isCritical ? 'CRITICAL' : 'WARNING'}: Temperature Out of Range
                        </div>
                        <div className="text-sm text-slate-300 mb-2">
                          Container {container.id} at {container.temperature}°C (Target: {container.targetTemp}°C)
                        </div>
                        <div className="text-xs text-slate-500">{container.location}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleAcknowledgeAlert(container)}
                      className={`px-3 py-1 rounded text-sm transition-colors ${
                        isCritical
                          ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                          : 'bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400'
                      }`}
                    >
                      Acknowledge
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showTechModal && selectedReefer && (
        <TechnicianDispatchModal
          container={selectedReefer}
          onClose={() => setShowTechModal(false)}
          onDispatch={handleDispatchTechnician}
        />
      )}

      {showHistoryModal && selectedReefer && (
        <ReeferHistoryModal
          container={selectedReefer}
          onClose={() => setShowHistoryModal(false)}
        />
      )}
    </div>
  );
}