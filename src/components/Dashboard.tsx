import { Ship, Package, Truck, AlertTriangle, TrendingUp, Activity, Snowflake, DoorOpen, Users, FileText, CreditCard, Scale } from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';
import GateDirections from './GateDirections';
import ContainerTracking from './ContainerTracking';
import CustomsActionModal from './CustomsActionModal';

interface DashboardProps {
  userRole: string;
  onNavigate?: (screen: string) => void;
}

export default function Dashboard({ userRole, onNavigate }: DashboardProps) {
  // Render different dashboard based on role
  switch (userRole) {
    case 'admin':
      return <AdminDashboard />;
    case 'operator':
      return <OperatorDashboard />;
    case 'berth':
      return <BerthDashboard />;
    case 'driver':
      return <DriverDashboard onNavigate={onNavigate} />;
    case 'customs':
      return <CustomsDashboard />;
    case 'finance':
      return <FinanceDashboard />;
    default:
      return <OperatorDashboard />;
  }
}

// Admin Dashboard - System Overview
function AdminDashboard() {
  const systemStats = [
    { time: '00:00', users: 12, transactions: 45 },
    { time: '04:00', users: 8, transactions: 23 },
    { time: '08:00', users: 45, transactions: 156 },
    { time: '12:00', users: 52, transactions: 203 },
    { time: '16:00', users: 38, transactions: 178 },
    { time: '20:00', users: 25, transactions: 89 },
  ];

  const moduleUsage = [
    { name: 'Gate Ops', value: 245, color: '#00ff88' },
    { name: 'Yard Mgmt', value: 187, color: '#00d4ff' },
    { name: 'Billing', value: 156, color: '#ffd700' },
    { name: 'Berth', value: 98, color: '#ff6b35' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl mb-2">System Administration</h2>
        <p className="text-slate-400 text-sm sm:text-base">Complete system overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Users className="w-5 h-5 text-orange-400 mb-2" />
          <div className="text-2xl text-orange-400 mb-1">127</div>
          <div className="text-slate-400 text-sm">Total Users</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Activity className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl text-emerald-400 mb-1">38</div>
          <div className="text-slate-400 text-sm">Active Sessions</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <TrendingUp className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl text-blue-400 mb-1">1,245</div>
          <div className="text-slate-400 text-sm">Transactions Today</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-red-400 mb-2" />
          <div className="text-2xl text-red-400 mb-1">3</div>
          <div className="text-slate-400 text-sm">System Alerts</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl mb-4">System Activity (24h)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={systemStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
              <Line type="monotone" dataKey="users" stroke="#00ff88" strokeWidth={2} name="Active Users" />
              <Line type="monotone" dataKey="transactions" stroke="#00d4ff" strokeWidth={2} name="Transactions" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl mb-4">Module Usage</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={moduleUsage} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                {moduleUsage.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl mb-4">System Health</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">Database</span>
              <span className="text-emerald-400">Healthy</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: '98%' }}></div>
            </div>
          </div>
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">API Services</span>
              <span className="text-emerald-400">Online</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: '100%' }}></div>
            </div>
          </div>
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-300">Storage</span>
              <span className="text-yellow-400">78% Used</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500" style={{ width: '78%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Port Operator Dashboard - Yard Master View
function OperatorDashboard() {
  const yardUtilization = [
    { time: '00:00', usage: 65 },
    { time: '04:00', usage: 58 },
    { time: '08:00', usage: 72 },
    { time: '12:00', usage: 85 },
    { time: '16:00', usage: 78 },
    { time: '20:00', usage: 70 },
  ];

  const craneActivity = [
    { crane: 'C1', moves: 145 },
    { crane: 'C2', moves: 132 },
    { crane: 'C3', moves: 158 },
    { crane: 'C4', moves: 89 },
    { crane: 'C5', moves: 124 },
  ];

  const containerStatus = [
    { name: 'Ready', value: 342, color: '#00ff88' },
    { name: 'Customs Hold', value: 87, color: '#ff6b35' },
    { name: 'Reefer', value: 54, color: '#00d4ff' },
    { name: 'Damaged', value: 12, color: '#ef4444' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl mb-2">Yard Operations Control</h2>
        <p className="text-slate-400 text-sm sm:text-base">Real-time yard and crane management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Package className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl text-emerald-400 mb-1">1,247</div>
          <div className="text-slate-400 text-sm">Active Containers</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Activity className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl text-blue-400 mb-1">5</div>
          <div className="text-slate-400 text-sm">Cranes Operating</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Truck className="w-5 h-5 text-yellow-400 mb-2" />
          <div className="text-2xl text-yellow-400 mb-1">27</div>
          <div className="text-slate-400 text-sm">Truck Queue</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-orange-400 mb-2" />
          <div className="text-2xl text-orange-400 mb-1">5</div>
          <div className="text-slate-400 text-sm">Active Alerts</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 sm:p-6">
          <h3 className="text-lg sm:text-xl mb-4">3D Yard View</h3>
          <div className="relative h-64 sm:h-96 bg-slate-950 rounded-lg overflow-hidden">
            <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(to right, rgba(100, 116, 139, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(100, 116, 139, 0.1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 400">
              <g transform="translate(100, 80)">
                {[...Array(6)].map((_, i) => (
                  [...Array(4)].map((_, j) => (
                    <g key={`a-${i}-${j}`} transform={`translate(${i * 45}, ${j * 25})`}>
                      <rect x="0" y="0" width="40" height="20" fill="#00ff88" opacity="0.8" stroke="#00ff88" strokeWidth="1" />
                      <polygon points="0,0 8,8 48,8 40,0" fill="#00ff88" opacity="0.6" />
                      <polygon points="40,0 48,8 48,28 40,20" fill="#00ff88" opacity="0.4" />
                    </g>
                  ))
                ))}
              </g>
              <g transform="translate(450, 80)">
                {[...Array(5)].map((_, i) => (
                  [...Array(3)].map((_, j) => (
                    <g key={`b-${i}-${j}`} transform={`translate(${i * 45}, ${j * 25})`}>
                      <rect x="0" y="0" width="40" height="20" fill="#ff6b35" opacity="0.8" stroke="#ff6b35" strokeWidth="1" />
                      <polygon points="0,0 8,8 48,8 40,0" fill="#ff6b35" opacity="0.6" />
                      <polygon points="40,0 48,8 48,28 40,20" fill="#ff6b35" opacity="0.4" />
                    </g>
                  ))
                ))}
              </g>
            </svg>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl mb-4">Container Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={containerStatus} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                {containerStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {containerStatus.map((status, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded" style={{ backgroundColor: status.color }}></div>
                <span className="text-xs text-slate-400">{status.name}: {status.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg mb-4">Yard Utilization (24h)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={yardUtilization}>
              <defs>
                <linearGradient id="yardGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#00ff88" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#00ff88" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="time" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="usage" stroke="#00ff88" fill="url(#yardGradient)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 sm:p-6">
          <h3 className="text-base sm:text-lg mb-4">Crane Performance</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={craneActivity}>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis dataKey="crane" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
              <Bar dataKey="moves" fill="#00d4ff" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

// Berth Planner Dashboard
function BerthDashboard() {
  const vesselSchedule = [
    { time: '08:00', arrivals: 1, departures: 0 },
    { time: '12:00', arrivals: 2, departures: 1 },
    { time: '16:00', arrivals: 0, departures: 2 },
    { time: '20:00', arrivals: 1, departures: 1 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl mb-2">Berth Planning Dashboard</h2>
        <p className="text-slate-400 text-sm sm:text-base">Vessel scheduling and berth allocation</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Ship className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl text-blue-400 mb-1">8</div>
          <div className="text-slate-400 text-sm">Vessels in Port</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <TrendingUp className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl text-emerald-400 mb-1">3</div>
          <div className="text-slate-400 text-sm">Incoming Today</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Activity className="w-5 h-5 text-yellow-400 mb-2" />
          <div className="text-2xl text-yellow-400 mb-1">82%</div>
          <div className="text-slate-400 text-sm">Berth Utilization</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-orange-400 mb-2" />
          <div className="text-2xl text-orange-400 mb-1">1</div>
          <div className="text-slate-400 text-sm">Schedule Conflicts</div>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl mb-4">Today's Vessel Schedule</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={vesselSchedule}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="time" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
            <Bar dataKey="arrivals" fill="#00ff88" name="Arrivals" />
            <Bar dataKey="departures" fill="#ff6b35" name="Departures" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5].map((berth) => (
          <div key={berth} className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
            <div className="text-lg mb-2">Berth {berth}</div>
            <div className={`px-3 py-1 rounded-full text-xs inline-block ${berth <= 3 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-400'}`}>
              {berth <= 3 ? 'Occupied' : 'Available'}
            </div>
            {berth <= 3 && (
              <div className="mt-2 text-sm text-slate-400">MV VESSEL-{berth}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// Truck Driver Dashboard
function DriverDashboard({ onNavigate }: { onNavigate?: (screen: string) => void }) {
  const [showDirections, setShowDirections] = useState(false);
  const [showTracking, setShowTracking] = useState(false);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl mb-2">Driver Portal</h2>
        <p className="text-slate-400 text-sm sm:text-base">Your appointments and container status</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Truck className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl text-emerald-400 mb-1">2</div>
          <div className="text-slate-400 text-sm">My Containers</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Activity className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl text-blue-400 mb-1">14:30</div>
          <div className="text-slate-400 text-sm">Next Appointment</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <DoorOpen className="w-5 h-5 text-yellow-400 mb-2" />
          <div className="text-2xl text-yellow-400 mb-1">Gate 3</div>
          <div className="text-slate-400 text-sm">Assigned Gate</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-orange-400 mb-2" />
          <div className="text-2xl text-orange-400 mb-1">18 min</div>
          <div className="text-slate-400 text-sm">Est. Wait Time</div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white">
        <h3 className="text-xl mb-4">Next Pickup Ready</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <div className="text-emerald-100 text-sm mb-1">Container ID</div>
            <div className="text-lg">TCLU3456789</div>
          </div>
          <div>
            <div className="text-emerald-100 text-sm mb-1">Location</div>
            <div className="text-lg">Block A-12</div>
          </div>
          <div>
            <div className="text-emerald-100 text-sm mb-1">Time Slot</div>
            <div className="text-lg">14:30 - 15:00</div>
          </div>
          <div>
            <div className="text-emerald-100 text-sm mb-1">Gate</div>
            <div className="text-lg">Gate 3</div>
          </div>
        </div>
        <button className="w-full bg-white hover:bg-emerald-50 text-emerald-600 py-3 rounded-lg transition-colors" onClick={() => setShowDirections(true)}>
          Get Directions to Gate
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg mb-4">My Bookings</h3>
          <div className="space-y-3">
            {['TCLU3456789', 'YMMU8901234'].map((id, idx) => (
              <div key={id} className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-200">{id}</span>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 text-xs rounded-full">
                    {idx === 0 ? 'Ready' : 'Processing'}
                  </span>
                </div>
                <div className="text-sm text-slate-400">Time: {idx === 0 ? '14:30' : '15:30'}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              className="w-full px-4 py-3 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 transition-colors text-left" 
              onClick={() => onNavigate?.('book-slot')}
            >
              📅 Book New Slot
            </button>
            <button 
              className="w-full px-4 py-3 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 transition-colors text-left"
              onClick={() => setShowTracking(true)}
            >
              📦 Track Container
            </button>
            <button 
              className="w-full px-4 py-3 bg-orange-500/20 text-orange-400 border border-orange-500/50 rounded-lg hover:bg-orange-500/30 transition-colors text-left"
              onClick={() => onNavigate?.('contact-support')}
            >
              📞 Contact Support
            </button>
          </div>
        </div>
      </div>

      {showDirections && <GateDirections onClose={() => setShowDirections(false)} gateNumber={3} containerLocation="Block A-12" />}
      {showTracking && <ContainerTracking onClose={() => setShowTracking(false)} containerId="TCLU3456789" />}
    </div>
  );
}

// Customs Officer Dashboard
function CustomsDashboard() {
  const inspectionQueue = [
    { id: 'TCLU3456789', type: 'Standard', priority: 'Normal', eta: '14:30' },
    { id: 'YMMU8901234', type: 'Hazmat', priority: 'High', eta: '15:00' },
    { id: 'MAEU5678901', type: 'Reefer', priority: 'Normal', eta: '15:30' },
  ];

  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState<'approve' | 'flag' | 'hold'>('approve');

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl mb-2">Customs & Inspection</h2>
        <p className="text-slate-400 text-sm sm:text-base">Container clearance and compliance monitoring</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <FileText className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl text-blue-400 mb-1">23</div>
          <div className="text-slate-400 text-sm">Pending Clearance</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-orange-400 mb-2" />
          <div className="text-2xl text-orange-400 mb-1">5</div>
          <div className="text-slate-400 text-sm">Requires Inspection</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Scale className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl text-emerald-400 mb-1">87</div>
          <div className="text-slate-400 text-sm">Cleared Today</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Snowflake className="w-5 h-5 text-red-400 mb-2" />
          <div className="text-2xl text-red-400 mb-1">12</div>
          <div className="text-slate-400 text-sm">On Hold</div>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl mb-4">Inspection Queue</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-slate-400 text-sm">Container ID</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm">Type</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm">Priority</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm">ETA</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm">Action</th>
              </tr>
            </thead>
            <tbody>
              {inspectionQueue.map((item) => (
                <tr key={item.id} className="border-t border-slate-800">
                  <td className="px-4 py-3 text-slate-200">{item.id}</td>
                  <td className="px-4 py-3 text-slate-300">{item.type}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${item.priority === 'High' ? 'bg-orange-500/20 text-orange-400' : 'bg-blue-500/20 text-blue-400'}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{item.eta}</td>
                  <td className="px-4 py-3">
                    <button className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded hover:bg-emerald-500/30 transition-colors text-sm" onClick={() => { setActionType('approve'); setShowActionModal(true); }}>
                      Inspect
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button 
              className="w-full px-4 py-3 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-lg hover:bg-emerald-500/30 transition-colors text-left"
              onClick={() => { setActionType('approve'); setShowActionModal(true); }}
            >
              ✓ Approve Clearance
            </button>
            <button 
              className="w-full px-4 py-3 bg-orange-500/20 text-orange-400 border border-orange-500/50 rounded-lg hover:bg-orange-500/30 transition-colors text-left"
              onClick={() => { setActionType('flag'); setShowActionModal(true); }}
            >
              ⚠ Flag for Inspection
            </button>
            <button 
              className="w-full px-4 py-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-lg hover:bg-red-500/30 transition-colors text-left"
              onClick={() => { setActionType('hold'); setShowActionModal(true); }}
            >
              ✕ Place on Hold
            </button>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg mb-4">Today's Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">Total Processed</span>
              <span className="text-emerald-400">87</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">Approved</span>
              <span className="text-emerald-400">82</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
              <span className="text-slate-400">Rejected</span>
              <span className="text-red-400">5</span>
            </div>
          </div>
        </div>
      </div>

      {showActionModal && <CustomsActionModal onClose={() => setShowActionModal(false)} actionType={actionType} />}
    </div>
  );
}

// Finance Dashboard
function FinanceDashboard() {
  const revenueData = [
    { month: 'Jun', revenue: 42.5 },
    { month: 'Jul', revenue: 38.2 },
    { month: 'Aug', revenue: 45.8 },
    { month: 'Sep', revenue: 52.1 },
    { month: 'Oct', revenue: 48.3 },
    { month: 'Nov', revenue: 55.7 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl mb-2">Financial Overview</h2>
        <p className="text-slate-400 text-sm sm:text-base">Revenue tracking and billing management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <CreditCard className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl text-emerald-400 mb-1">$55.7K</div>
          <div className="text-slate-400 text-sm">Revenue This Month</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <FileText className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl text-blue-400 mb-1">247</div>
          <div className="text-slate-400 text-sm">Invoices Generated</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <TrendingUp className="w-5 h-5 text-orange-400 mb-2" />
          <div className="text-2xl text-orange-400 mb-1">$12.3K</div>
          <div className="text-slate-400 text-sm">Demurrage Revenue</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mb-2" />
          <div className="text-2xl text-yellow-400 mb-1">18</div>
          <div className="text-slate-400 text-sm">Pending Payments</div>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl mb-4">Revenue Trend (6 Months)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={revenueData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="month" stroke="#64748b" />
            <YAxis stroke="#64748b" />
            <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} formatter={(value) => [`$${value}K`, 'Revenue']} />
            <Bar dataKey="revenue" fill="#00ff88" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg mb-4">Payment Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Paid</span>
              <span className="text-emerald-400">185</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Pending</span>
              <span className="text-yellow-400">18</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Overdue</span>
              <span className="text-red-400">44</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg mb-4">Revenue Sources</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Storage</span>
              <span className="text-blue-400">$28.5K</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Handling</span>
              <span className="text-emerald-400">$14.9K</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Demurrage</span>
              <span className="text-orange-400">$12.3K</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h3 className="text-lg mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <button className="w-full px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded-lg hover:bg-emerald-500/30 transition-colors text-sm text-left">
              Generate Invoice
            </button>
            <button className="w-full px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg hover:bg-blue-500/30 transition-colors text-sm text-left">
              Export Report
            </button>
            <button className="w-full px-4 py-2 bg-purple-500/20 text-purple-400 border border-purple-500/50 rounded-lg hover:bg-purple-500/30 transition-colors text-sm text-left">
              View Tariffs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}