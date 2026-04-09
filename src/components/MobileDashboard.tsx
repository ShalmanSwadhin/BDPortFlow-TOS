import { useApp } from '../context/AppContext';
import { Package, Truck, Clock, MapPin, Bell, CheckCircle, AlertTriangle, Snowflake, Info } from 'lucide-react';

interface MobileDashboardProps {
  userRole: string;
}

export default function MobileDashboard({ userRole }: MobileDashboardProps) {
  const { containers, bookings, notifications } = useApp();
  
  // Get user's relevant containers and bookings
  const myContainers = userRole === 'driver' 
    ? containers.filter(c => c.status === 'ready' || c.status === 'processing').slice(0, 2)
    : containers.slice(0, 3);

  const myBookings = bookings.filter(b => b.status === 'confirmed').slice(0, 2);
  
  const nextBooking = myBookings[0];
  
  const recentAlerts = notifications.slice(0, 3);

  const quickActions = [
    { icon: Truck, label: 'Book Slot', color: '#00ff88' },
    { icon: Package, label: 'Track Container', color: '#00d4ff' },
    { icon: MapPin, label: 'Navigate', color: '#ffd700' },
    { icon: Bell, label: 'Alerts', color: '#ff6b35' },
  ];

  return (
    <div className="max-w-lg mx-auto space-y-4 pb-20">
      {/* Mobile Header Card */}
      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/30">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl mb-1">Welcome Back</h2>
            <p className="text-emerald-100 text-sm">
              {userRole === 'driver' ? 'Truck Driver' : 
               userRole === 'operator' ? 'Port Operator' :
               userRole === 'customs' ? 'Customs Officer' :
               'Port User'}
            </p>
          </div>
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
            <Truck className="w-6 h-6" />
          </div>
        </div>
        <div className="flex items-center gap-2 text-emerald-100 text-sm">
          <Clock className="w-4 h-4" />
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Package className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl text-slate-100 mb-1">{myContainers.length}</div>
          <div className="text-slate-400 text-sm">My Containers</div>
        </div>
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Clock className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl text-slate-100 mb-1">{nextBooking?.slot || '--:--'}</div>
          <div className="text-slate-400 text-sm">Next Slot</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg text-slate-100 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {quickActions.map((action, idx) => {
            const Icon = action.icon;
            return (
              <button
                key={idx}
                className="p-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-xl transition-all active:scale-95"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 mx-auto"
                  style={{ backgroundColor: `${action.color}20` }}
                >
                  <Icon className="w-5 h-5" style={{ color: action.color }} />
                </div>
                <div className="text-sm text-slate-300 text-center">{action.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* My Containers */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg text-slate-100 mb-4">My Containers ({myContainers.length})</h3>
        {myContainers.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p className="text-sm">No containers assigned</p>
          </div>
        ) : (
          <div className="space-y-3">
            {myContainers.map((container) => {
              const booking = bookings.find(b => b.container === container.id);
              
              return (
                <div
                  key={container.id}
                  className="p-4 bg-slate-800/50 border border-slate-700 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="text-slate-100 mb-1">{container.id}</div>
                      <div className="text-sm text-slate-400">{container.location}</div>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs ${
                        container.status === 'ready'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
                          : container.status === 'processing'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/50'
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/50'
                      }`}
                    >
                      {container.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-4 h-4" />
                      <span>{container.type}</span>
                    </div>
                    {booking && (
                      <div className="flex items-center gap-2 text-slate-400">
                        <Clock className="w-4 h-4" />
                        <span>{booking.slot}</span>
                      </div>
                    )}
                  </div>

                  {container.status === 'ready' && (
                    <button className="w-full mt-3 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm">
                      Get Directions
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Alerts */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg text-slate-100">Alerts</h3>
          {recentAlerts.filter(a => !a.read).length > 0 && (
            <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs">{recentAlerts.filter(a => !a.read).length}</span>
            </div>
          )}
        </div>

        <div className="space-y-3">
          {recentAlerts.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Bell className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No recent alerts</p>
            </div>
          ) : (
            recentAlerts.map((alert) => {
              const colors = {
                success: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/50', icon: CheckCircle, iconColor: 'text-emerald-400' },
                warning: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/50', icon: AlertTriangle, iconColor: 'text-yellow-400' },
                error: { bg: 'bg-red-500/10', border: 'border-red-500/50', icon: AlertTriangle, iconColor: 'text-red-400' },
                info: { bg: 'bg-blue-500/10', border: 'border-blue-500/50', icon: Info, iconColor: 'text-blue-400' },
              };
              const style = colors[alert.type as keyof typeof colors];
              const Icon = style.icon;

              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border ${style.bg} ${style.border}`}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 ${style.iconColor} flex-shrink-0 mt-0.5`} />
                    <div className="flex-1">
                      <p className="text-sm text-slate-200 mb-1">{alert.message}</p>
                      <p className="text-xs text-slate-500">{alert.time}</p>
                    </div>
                    {!alert.read && (
                      <div className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Yard Map Preview */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg text-slate-100 mb-4">Yard Overview</h3>
        
        {/* Simplified mobile yard view */}
        <div className="aspect-square bg-slate-950 rounded-lg p-4 relative overflow-hidden">
          {/* Grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(100, 116, 139, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(100, 116, 139, 0.1) 1px, transparent 1px)',
            backgroundSize: '30px 30px',
          }}></div>

          {/* Blocks */}
          <div className="relative h-full grid grid-cols-3 gap-2">
            {['A', 'B', 'C', 'D', 'E', 'F'].map((block, idx) => (
              <div
                key={block}
                className="rounded bg-emerald-500/20 border-2 border-emerald-500/50 flex items-center justify-center"
              >
                <span className="text-emerald-400">{block}</span>
              </div>
            ))}
          </div>

          {/* Current Location Pin */}
          <div className="absolute top-1/4 left-1/4">
            <div className="relative">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-pulse">
                <Truck className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-4 bg-blue-500"></div>
            </div>
          </div>
        </div>

        <button className="w-full mt-4 px-4 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 rounded-lg transition-colors">
          Open Full Map
        </button>
      </div>

      {/* Reefer Status (if applicable) */}
      {userRole === 'operator' && (
        <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg text-slate-100">Reefer Status</h3>
            <Snowflake className="w-5 h-5 text-cyan-400" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-slate-800/50 rounded-lg border border-slate-700">
              <div className="text-xs text-slate-400 mb-1">Active</div>
              <div className="text-xl text-cyan-400">54</div>
            </div>
            <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/50">
              <div className="text-xs text-slate-400 mb-1">Alerts</div>
              <div className="text-xl text-red-400">2</div>
            </div>
          </div>

          <div className="mt-3 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
            <div className="flex items-center gap-2 text-red-400 text-sm mb-1">
              <AlertTriangle className="w-4 h-4" />
              <span>Critical Alert</span>
            </div>
            <p className="text-xs text-slate-400">YMMU8901234 at -22.8°C</p>
          </div>
        </div>
      )}

      {/* Help & Support */}
      <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-lg text-slate-100 mb-4">Need Help?</h3>
        <div className="space-y-2">
          <button className="w-full px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors text-left text-slate-300 text-sm">
            📞 Call Port Control: +880-1234-567890
          </button>
          <button className="w-full px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors text-left text-slate-300 text-sm">
            💬 Live Chat Support
          </button>
          <button className="w-full px-4 py-3 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors text-left text-slate-300 text-sm">
            📧 Email: support@bdportflow.gov.bd
          </button>
        </div>
      </div>

      {/* Footer Info */}
      <div className="text-center text-slate-500 text-xs py-4">
        <p>BDPortFlow TOS v2.1.0</p>
        <p className="mt-1">Chittagong Port Authority</p>
      </div>
    </div>
  );
}
