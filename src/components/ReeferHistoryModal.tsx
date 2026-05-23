import { X, TrendingDown, TrendingUp, Activity, AlertTriangle, Clock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ReeferHistoryModalProps {
  container: any;
  onClose: () => void;
}

export default function ReeferHistoryModal({ container, onClose }: ReeferHistoryModalProps) {
  // Generate temperature history data
  const temperatureHistory = Array.from({ length: 24 }, (_, i) => ({
    time: `${23 - i}h ago`,
    temp: (container?.targetTemp || -20) + (Math.random() * 4 - 2),
    target: container?.targetTemp || -20,
    power: 85 + Math.random() * 15,
  })).reverse();

  const events = [
    { id: 1, time: '2 hours ago', type: 'temp_adjust', message: 'Target temperature adjusted to -20°C', user: 'Ahmed Khan', icon: Activity, color: 'blue' },
    { id: 2, time: '5 hours ago', type: 'alert', message: 'Temperature deviation detected: -22.8°C', user: 'System', icon: AlertTriangle, color: 'red' },
    { id: 3, time: '8 hours ago', type: 'power', message: 'Power consumption increased to 100%', user: 'System', icon: TrendingUp, color: 'yellow' },
    { id: 4, time: '12 hours ago', type: 'inspection', message: 'Routine inspection completed', user: 'Kamal Hossain', icon: Activity, color: 'green' },
    { id: 5, time: '18 hours ago', type: 'temp_adjust', message: 'Target temperature adjusted to -18°C', user: 'Fatima Rahman', icon: Activity, color: 'blue' },
    { id: 6, time: '1 day ago', type: 'maintenance', message: 'Preventive maintenance completed', user: 'Rafiq Ahmed', icon: Activity, color: 'green' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-blue-500/50 rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl text-blue-400 mb-1">Container History</h3>
            <p className="text-xs sm:text-sm text-slate-400 truncate">{container?.id} • {container?.cargo} • {container?.location}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Temperature Chart */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 sm:p-6">
            <h4 className="text-base sm:text-lg mb-3 sm:mb-4 text-slate-200">Temperature History (24h)</h4>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={temperatureHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="temp" stroke="#00d4ff" strokeWidth={2} name="Actual Temp" dot={false} />
                <Line type="monotone" dataKey="target" stroke="#00ff88" strokeWidth={2} strokeDasharray="5 5" name="Target Temp" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Power Consumption Chart */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 sm:p-6">
            <h4 className="text-base sm:text-lg mb-3 sm:mb-4 text-slate-200">Power Consumption (24h)</h4>
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={temperatureHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: '12px' }} />
                <YAxis stroke="#64748b" style={{ fontSize: '12px' }} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                  }}
                />
                <Line type="monotone" dataKey="power" stroke="#ffd700" strokeWidth={2} name="Power %" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Event Timeline */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 sm:p-6">
            <h4 className="text-base sm:text-lg mb-3 sm:mb-4 text-slate-200">Event Timeline</h4>
            <div className="space-y-3">
              {events.map((event) => {
                const Icon = event.icon;
                const colorMap: { [key: string]: { bg: string; border: string; text: string } } = {
                  red: { bg: 'bg-red-500/10', border: 'border-red-500/50', text: 'text-red-400' },
                  yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/50', text: 'text-yellow-400' },
                  blue: { bg: 'bg-blue-500/10', border: 'border-blue-500/50', text: 'text-blue-400' },
                  green: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/50', text: 'text-emerald-400' },
                };
                const colors = colorMap[event.color];

                return (
                  <div
                    key={event.id}
                    className={`p-4 rounded-lg border ${colors.bg} ${colors.border}`}
                  >
                    <div className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 ${colors.text} flex-shrink-0 mt-0.5`} />
                      <div className="flex-1">
                        <p className="text-slate-200 mb-1">{event.message}</p>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {event.time}
                          </span>
                          <span>•</span>
                          <span>By {event.user}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Stats Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <div className="text-slate-400 text-sm mb-1">Avg Temperature</div>
              <div className="text-2xl text-blue-400">{container?.temperature?.toFixed(1)}°C</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <div className="text-slate-400 text-sm mb-1">Avg Power</div>
              <div className="text-2xl text-yellow-400">{container?.power}%</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <div className="text-slate-400 text-sm mb-1">Alerts</div>
              <div className="text-2xl text-red-400">2</div>
            </div>
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <div className="text-slate-400 text-sm mb-1">Uptime</div>
              <div className="text-2xl text-emerald-400">99.8%</div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
