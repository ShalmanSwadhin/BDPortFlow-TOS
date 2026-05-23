import { useState } from 'react';
import { Users, Shield, Settings, FileText, Plus, Edit2, Trash2, Check, X, Activity, Lock, Unlock } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  lastLogin: string;
}

interface AdminPanelProps {
  initialTab?: 'users' | 'settings' | 'audit' | 'permissions';
}

export default function AdminPanel({ initialTab = 'users' }: AdminPanelProps = {}) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All Roles');

  const [users, setUsers] = useState<User[]>([
    { id: 1, name: 'Ahmed Khan', email: 'ahmed@bdport.gov.bd', role: 'Port Operator', status: 'active', lastLogin: '2 hours ago' },
    { id: 2, name: 'Fatima Rahman', email: 'fatima@bdport.gov.bd', role: 'Berth Planner', status: 'active', lastLogin: '5 min ago' },
    { id: 3, name: 'Karim Hassan', email: 'karim@bdport.gov.bd', role: 'Customs Officer', status: 'active', lastLogin: '1 day ago' },
    { id: 4, name: 'Nazia Ahmed', email: 'nazia@bdport.gov.bd', role: 'Finance Manager', status: 'inactive', lastLogin: '3 days ago' },
    { id: 5, name: 'Rahim Ali', email: 'rahim@bdport.gov.bd', role: 'Truck Driver', status: 'active', lastLogin: '10 min ago' },
  ]);

  // Permission Matrix State
  const [permissions, setPermissions] = useState({
    'admin': {
      'Dashboard': { view: true, edit: true, delete: true, create: true },
      'User Management': { view: true, edit: true, delete: true, create: true },
      'Berth Planning': { view: true, edit: true, delete: true, create: true },
      'Reefer Monitor': { view: true, edit: true, delete: true, create: true },
      'Container Stack': { view: true, edit: true, delete: true, create: true },
      'Ship Stowage': { view: true, edit: true, delete: true, create: true },
      'Gate Operations': { view: true, edit: true, delete: true, create: true },
      'Truck Booking': { view: true, edit: true, delete: true, create: true },
      'Yard Density': { view: true, edit: true, delete: true, create: true },
      'Rail Coordination': { view: true, edit: true, delete: true, create: true },
      'Customs Clearance': { view: true, edit: true, delete: true, create: true },
      'Billing & Tariff': { view: true, edit: true, delete: true, create: true },
      'System Settings': { view: true, edit: true, delete: true, create: true },
      'Audit Logs': { view: true, edit: false, delete: false, create: false },
    },
    'operator': {
      'Dashboard': { view: true, edit: false, delete: false, create: false },
      'User Management': { view: false, edit: false, delete: false, create: false },
      'Berth Planning': { view: true, edit: true, delete: false, create: true },
      'Reefer Monitor': { view: true, edit: true, delete: false, create: false },
      'Container Stack': { view: true, edit: true, delete: false, create: true },
      'Ship Stowage': { view: true, edit: false, delete: false, create: false },
      'Gate Operations': { view: true, edit: true, delete: false, create: true },
      'Truck Booking': { view: true, edit: true, delete: false, create: false },
      'Yard Density': { view: true, edit: true, delete: false, create: false },
      'Rail Coordination': { view: true, edit: true, delete: false, create: true },
      'Customs Clearance': { view: true, edit: false, delete: false, create: false },
      'Billing & Tariff': { view: true, edit: false, delete: false, create: false },
      'System Settings': { view: false, edit: false, delete: false, create: false },
      'Audit Logs': { view: false, edit: false, delete: false, create: false },
    },
    'berth': {
      'Dashboard': { view: true, edit: false, delete: false, create: false },
      'User Management': { view: false, edit: false, delete: false, create: false },
      'Berth Planning': { view: true, edit: true, delete: true, create: true },
      'Reefer Monitor': { view: true, edit: false, delete: false, create: false },
      'Container Stack': { view: true, edit: false, delete: false, create: false },
      'Ship Stowage': { view: true, edit: true, delete: false, create: true },
      'Gate Operations': { view: true, edit: false, delete: false, create: false },
      'Truck Booking': { view: true, edit: true, delete: false, create: false },
      'Yard Density': { view: true, edit: false, delete: false, create: false },
      'Rail Coordination': { view: true, edit: false, delete: false, create: false },
      'Customs Clearance': { view: false, edit: false, delete: false, create: false },
      'Billing & Tariff': { view: true, edit: false, delete: false, create: false },
      'System Settings': { view: false, edit: false, delete: false, create: false },
      'Audit Logs': { view: false, edit: false, delete: false, create: false },
    },
    'customs': {
      'Dashboard': { view: true, edit: false, delete: false, create: false },
      'User Management': { view: false, edit: false, delete: false, create: false },
      'Berth Planning': { view: true, edit: false, delete: false, create: false },
      'Reefer Monitor': { view: true, edit: false, delete: false, create: false },
      'Container Stack': { view: true, edit: false, delete: false, create: false },
      'Ship Stowage': { view: true, edit: false, delete: false, create: false },
      'Gate Operations': { view: true, edit: false, delete: false, create: false },
      'Truck Booking': { view: true, edit: false, delete: false, create: false },
      'Yard Density': { view: true, edit: false, delete: false, create: false },
      'Rail Coordination': { view: true, edit: false, delete: false, create: false },
      'Customs Clearance': { view: true, edit: true, delete: false, create: true },
      'Billing & Tariff': { view: true, edit: false, delete: false, create: false },
      'System Settings': { view: false, edit: false, delete: false, create: false },
      'Audit Logs': { view: true, edit: false, delete: false, create: false },
    },
    'finance': {
      'Dashboard': { view: true, edit: false, delete: false, create: false },
      'User Management': { view: false, edit: false, delete: false, create: false },
      'Berth Planning': { view: true, edit: false, delete: false, create: false },
      'Reefer Monitor': { view: true, edit: false, delete: false, create: false },
      'Container Stack': { view: true, edit: false, delete: false, create: false },
      'Ship Stowage': { view: true, edit: false, delete: false, create: false },
      'Gate Operations': { view: true, edit: false, delete: false, create: false },
      'Truck Booking': { view: true, edit: false, delete: false, create: false },
      'Yard Density': { view: true, edit: false, delete: false, create: false },
      'Rail Coordination': { view: true, edit: false, delete: false, create: false },
      'Customs Clearance': { view: true, edit: false, delete: false, create: false },
      'Billing & Tariff': { view: true, edit: true, delete: true, create: true },
      'System Settings': { view: false, edit: false, delete: false, create: false },
      'Audit Logs': { view: true, edit: false, delete: false, create: false },
    },
    'truck': {
      'Dashboard': { view: true, edit: false, delete: false, create: false },
      'User Management': { view: false, edit: false, delete: false, create: false },
      'Berth Planning': { view: false, edit: false, delete: false, create: false },
      'Reefer Monitor': { view: false, edit: false, delete: false, create: false },
      'Container Stack': { view: false, edit: false, delete: false, create: false },
      'Ship Stowage': { view: false, edit: false, delete: false, create: false },
      'Gate Operations': { view: true, edit: false, delete: false, create: false },
      'Truck Booking': { view: true, edit: true, delete: false, create: true },
      'Yard Density': { view: false, edit: false, delete: false, create: false },
      'Rail Coordination': { view: false, edit: false, delete: false, create: false },
      'Customs Clearance': { view: false, edit: false, delete: false, create: false },
      'Billing & Tariff': { view: true, edit: false, delete: false, create: false },
      'System Settings': { view: false, edit: false, delete: false, create: false },
      'Audit Logs': { view: false, edit: false, delete: false, create: false },
    },
  });

  const [selectedRole, setSelectedRole] = useState<string>('admin');

  const togglePermission = (role: string, module: string, permType: 'view' | 'edit' | 'delete' | 'create') => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role as keyof typeof prev],
        [module]: {
          ...prev[role as keyof typeof prev][module],
          [permType]: !prev[role as keyof typeof prev][module][permType]
        }
      }
    }));
  };

  const handleDeleteUser = (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setUsers(users.map(u => 
      u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
    ));
  };

  // Filter users based on search query and role filter
  const filteredUsers = users.filter(user => {
    const matchesSearch = searchQuery === '' || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesRole = roleFilter === 'All Roles' || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  });

  const auditLogs = [
    { id: 1, user: 'Ahmed Khan', action: 'Updated container TCLU4567890 status', timestamp: '2 min ago', type: 'update' },
    { id: 2, user: 'Fatima Rahman', action: 'Created berth assignment for MV HARMONY', timestamp: '15 min ago', type: 'create' },
    { id: 3, user: 'System', action: 'Automatic gate closure initiated', timestamp: '1 hour ago', type: 'system' },
    { id: 4, user: 'Karim Hassan', action: 'Approved customs clearance for 23 containers', timestamp: '2 hours ago', type: 'approval' },
    { id: 5, user: 'Admin', action: 'User role modified: Nazia Ahmed', timestamp: '5 hours ago', type: 'security' },
  ];

  const systemStats = [
    { time: '00:00', users: 12 },
    { time: '04:00', users: 8 },
    { time: '08:00', users: 45 },
    { time: '12:00', users: 52 },
    { time: '16:00', users: 38 },
    { time: '20:00', users: 25 },
    { time: '23:59', users: 15 },
  ];

  const kpiData = [
    { label: 'Yard Density', value: '72%', trend: '+5%', color: '#00ff88', status: 'normal' },
    { label: 'Crane Utilization', value: '84%', trend: '+12%', color: '#00d4ff', status: 'good' },
    { label: 'Avg Gate Time', value: '18 min', trend: '-8%', color: '#ffd700', status: 'good' },
    { label: 'Demurrage Revenue', value: '$45.2K', trend: '+23%', color: '#ff6b35', status: 'high' },
  ];

  const roleColors: { [key: string]: string } = {
    'Port Operator': '#00ff88',
    'Berth Planner': '#00d4ff',
    'Customs Officer': '#ff6b35',
    'Finance Manager': '#a855f7',
    'Truck Driver': '#ffd700',
    'Admin': '#ef4444',
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl mb-2">Admin Control Panel</h2>
        <p className="text-slate-400 text-sm sm:text-base">System management and configuration</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => (
          <div key={idx} className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
            <p className="text-slate-400 text-sm mb-1">{kpi.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-2xl" style={{ color: kpi.color }}>{kpi.value}</h3>
              <span className={`text-sm ${kpi.trend.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>
                {kpi.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 sm:gap-2 border-b border-slate-800 overflow-x-auto pb-2 -mb-2 scrollbar-thin">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-3 sm:px-6 py-2 sm:py-3 transition-all whitespace-nowrap text-sm sm:text-base ${
            activeTab === 'users'
              ? 'border-b-2 border-emerald-500 text-emerald-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Users className="w-4 h-4 inline mr-1 sm:mr-2" />
          <span className="hidden sm:inline">User Management</span>
          <span className="sm:hidden">Users</span>
        </button>
        <button
          onClick={() => setActiveTab('permissions')}
          className={`px-3 sm:px-6 py-2 sm:py-3 transition-all whitespace-nowrap text-sm sm:text-base ${
            activeTab === 'permissions'
              ? 'border-b-2 border-emerald-500 text-emerald-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Shield className="w-4 h-4 inline mr-1 sm:mr-2" />
          Permissions
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-3 sm:px-6 py-2 sm:py-3 transition-all whitespace-nowrap text-sm sm:text-base ${
            activeTab === 'audit'
              ? 'border-b-2 border-emerald-500 text-emerald-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <FileText className="w-4 h-4 inline mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Audit Logs</span>
          <span className="sm:hidden">Audit</span>
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`px-3 sm:px-6 py-2 sm:py-3 transition-all whitespace-nowrap text-sm sm:text-base ${
            activeTab === 'settings'
              ? 'border-b-2 border-emerald-500 text-emerald-400'
              : 'text-slate-400 hover:text-slate-300'
          }`}
        >
          <Settings className="w-4 h-4 inline mr-1 sm:mr-2" />
          Settings
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option>All Roles</option>
                <option>Port Operator</option>
                <option>Berth Planner</option>
                <option>Customs Officer</option>
              </select>
            </div>
            <button
              onClick={() => setShowAddUser(!showAddUser)}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add User
            </button>
          </div>

          {/* Edit User Modal */}
          {editingUser && (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-slate-900 border border-blue-500/50 rounded-xl p-6 max-w-2xl w-full">
                <h3 className="text-lg text-blue-400 mb-4">Edit User: {editingUser.name}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    defaultValue={editingUser.name}
                    placeholder="Full Name"
                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                  <input
                    type="email"
                    defaultValue={editingUser.email}
                    placeholder="Email Address"
                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                  <select
                    defaultValue={editingUser.role}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option>Port Operator</option>
                    <option>Berth Planner</option>
                    <option>Customs Officer</option>
                    <option>Finance Manager</option>
                    <option>Truck Driver</option>
                    <option>Admin</option>
                  </select>
                  <select
                    defaultValue={editingUser.status}
                    className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setEditingUser(null)}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      alert('User updated successfully!');
                      setEditingUser(null);
                    }}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Add User Form */}
          {showAddUser && (
            <div className="bg-slate-900/80 backdrop-blur border border-emerald-500/50 rounded-xl p-6">
              <h3 className="text-lg text-emerald-400 mb-4">Create New User</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                />
                <select className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500">
                  <option>Select Role</option>
                  <option>Port Operator</option>
                  <option>Berth Planner</option>
                  <option>Customs Officer</option>
                  <option>Finance Manager</option>
                  <option>Truck Driver</option>
                </select>
                <input
                  type="password"
                  placeholder="Initial Password"
                  className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button
                  onClick={() => setShowAddUser(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors">
                  Create User
                </button>
              </div>
            </div>
          )}

          {/* Users Table */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-4 sm:px-6 py-4 text-left text-slate-400 text-sm whitespace-nowrap">User</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-slate-400 text-sm whitespace-nowrap">Role</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-slate-400 text-sm whitespace-nowrap">Status</th>
                    <th className="px-4 sm:px-6 py-4 text-left text-slate-400 text-sm whitespace-nowrap">Last Login</th>
                    <th className="px-4 sm:px-6 py-4 text-right text-slate-400 text-sm whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 sm:px-6 py-4">
                        <div>
                          <div className="text-slate-200">{user.name}</div>
                          <div className="text-sm text-slate-500">{user.email}</div>
                        </div>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className="px-3 py-1 rounded-full text-sm whitespace-nowrap inline-block"
                          style={{
                            backgroundColor: `${roleColors[user.role]}20`,
                            color: roleColors[user.role],
                          }}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            user.status === 'active'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-slate-700 text-slate-400'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-4 text-slate-400">{user.lastLogin}</td>
                      <td className="px-4 sm:px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="p-2 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                            title="Edit user"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleToggleStatus(user.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              user.status === 'active'
                                ? 'hover:bg-yellow-500/20 text-yellow-400'
                                : 'hover:bg-emerald-500/20 text-emerald-400'
                            }`}
                            title={user.status === 'active' ? 'Deactivate' : 'Activate'}
                          >
                            {user.status === 'active' ? <X className="w-4 h-4" /> : <Check className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                            title="Delete user"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'audit' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Activity Chart */}
            <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg mb-4">System Activity (24h)</h3>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={systemStats}>
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
                  <Line type="monotone" dataKey="users" stroke="#00ff88" strokeWidth={3} dot={{ fill: '#00ff88', r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Quick Stats */}
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <h3 className="text-lg mb-4">Quick Stats</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Total Users</span>
                  <span className="text-emerald-400">127</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Active Now</span>
                  <span className="text-blue-400">38</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Actions Today</span>
                  <span className="text-orange-400">1,245</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Failed Logins</span>
                  <span className="text-red-400">3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg mb-4">Recent Activity Logs</h3>
            <div className="space-y-3">
              {auditLogs.map((log) => {
                const typeColors: { [key: string]: string } = {
                  update: 'border-blue-500/50 bg-blue-500/10',
                  create: 'border-emerald-500/50 bg-emerald-500/10',
                  system: 'border-slate-500/50 bg-slate-500/10',
                  approval: 'border-purple-500/50 bg-purple-500/10',
                  security: 'border-orange-500/50 bg-orange-500/10',
                };

                return (
                  <div key={log.id} className={`p-4 border rounded-lg ${typeColors[log.type]}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Activity className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-slate-200">{log.action}</p>
                          <p className="text-sm text-slate-500 mt-1">
                            by <span className="text-slate-400">{log.user}</span> • {log.timestamp}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-slate-800/50 text-slate-400 text-xs rounded-full uppercase">
                        {log.type}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg mb-4">Yard Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Total Yard Blocks</label>
                <input
                  type="number"
                  defaultValue="6"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Max Stack Height</label>
                <input
                  type="number"
                  defaultValue="5"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Reefer Capacity</label>
                <input
                  type="number"
                  defaultValue="120"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg mb-4">Gate Configuration</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Active Gates</label>
                <input
                  type="number"
                  defaultValue="4"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Auto-Lock Timeout (min)</label>
                <input
                  type="number"
                  defaultValue="15"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Weight Tolerance (%)</label>
                <input
                  type="number"
                  defaultValue="3"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg mb-4">Notification Settings</h3>
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg cursor-pointer">
                <span className="text-slate-300">Reefer Temperature Alerts</span>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg cursor-pointer">
                <span className="text-slate-300">Gate Operation Errors</span>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg cursor-pointer">
                <span className="text-slate-300">Crane Maintenance Warnings</span>
                <input type="checkbox" defaultChecked className="w-5 h-5" />
              </label>
              <label className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg cursor-pointer">
                <span className="text-slate-300">Customs Clearance Updates</span>
                <input type="checkbox" className="w-5 h-5" />
              </label>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg mb-4">Session Management</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Session Timeout (minutes)</label>
                <input
                  type="number"
                  defaultValue="30"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Max Concurrent Sessions</label>
                <input
                  type="number"
                  defaultValue="3"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded-lg transition-colors">
                Force Logout All Users
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'permissions' && (
        <div className="space-y-6">
          {/* Role Selector and Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl text-slate-200">Role-Based Access Control</h3>
              <p className="text-sm text-slate-400 mt-1">Manage module permissions for each user role</p>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-slate-400 text-sm">Select Role:</label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
              >
                <option value="admin">Admin</option>
                <option value="operator">Port Operator</option>
                <option value="berth">Berth Planner</option>
                <option value="customs">Customs Officer</option>
                <option value="finance">Finance Manager</option>
                <option value="truck">Truck Driver</option>
              </select>
            </div>
          </div>

          {/* Permission Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Shield className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-sm">View Access</span>
              </div>
              <p className="text-2xl text-emerald-400">
                {Object.values(permissions[selectedRole]).filter(p => p.view).length}
              </p>
              <p className="text-xs text-slate-500 mt-1">modules accessible</p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Edit2 className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 text-sm">Edit Access</span>
              </div>
              <p className="text-2xl text-blue-400">
                {Object.values(permissions[selectedRole]).filter(p => p.edit).length}
              </p>
              <p className="text-xs text-slate-500 mt-1">modules editable</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Plus className="w-4 h-4 text-purple-400" />
                <span className="text-purple-400 text-sm">Create Access</span>
              </div>
              <p className="text-2xl text-purple-400">
                {Object.values(permissions[selectedRole]).filter(p => p.create).length}
              </p>
              <p className="text-xs text-slate-500 mt-1">modules creatable</p>
            </div>
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-1">
                <Trash2 className="w-4 h-4 text-red-400" />
                <span className="text-red-400 text-sm">Delete Access</span>
              </div>
              <p className="text-2xl text-red-400">
                {Object.values(permissions[selectedRole]).filter(p => p.delete).length}
              </p>
              <p className="text-xs text-slate-500 mt-1">modules deletable</p>
            </div>
          </div>

          {/* Permission Matrix Table */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-6 py-4 text-left text-slate-400 text-sm font-semibold">Module</th>
                    <th className="px-6 py-4 text-center text-slate-400 text-sm font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span>View</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-slate-400 text-sm font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <Edit2 className="w-4 h-4" />
                        <span>Edit</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-slate-400 text-sm font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" />
                        <span>Create</span>
                      </div>
                    </th>
                    <th className="px-6 py-4 text-center text-slate-400 text-sm font-semibold">
                      <div className="flex items-center justify-center gap-2">
                        <Trash2 className="w-4 h-4" />
                        <span>Delete</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(permissions[selectedRole]).map(([module, perms], idx) => (
                    <tr
                      key={module}
                      className={`border-t border-slate-800 hover:bg-slate-800/30 transition-colors ${
                        idx % 2 === 0 ? 'bg-slate-900/30' : ''
                      }`}
                    >
                      <td className="px-6 py-4 text-slate-200 font-medium">{module}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => togglePermission(selectedRole, module, 'view')}
                          className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                            perms.view
                              ? 'bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30'
                              : 'bg-slate-700/50 text-slate-500 hover:bg-slate-700'
                          }`}
                          title={perms.view ? 'Revoke View Access' : 'Grant View Access'}
                        >
                          {perms.view ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => togglePermission(selectedRole, module, 'edit')}
                          className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                            perms.edit
                              ? 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                              : 'bg-slate-700/50 text-slate-500 hover:bg-slate-700'
                          }`}
                          title={perms.edit ? 'Revoke Edit Access' : 'Grant Edit Access'}
                        >
                          {perms.edit ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => togglePermission(selectedRole, module, 'create')}
                          className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                            perms.create
                              ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                              : 'bg-slate-700/50 text-slate-500 hover:bg-slate-700'
                          }`}
                          title={perms.create ? 'Revoke Create Access' : 'Grant Create Access'}
                        >
                          {perms.create ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => togglePermission(selectedRole, module, 'delete')}
                          className={`p-2 rounded-lg transition-all transform hover:scale-110 ${
                            perms.delete
                              ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                              : 'bg-slate-700/50 text-slate-500 hover:bg-slate-700'
                          }`}
                          title={perms.delete ? 'Revoke Delete Access' : 'Grant Delete Access'}
                        >
                          {perms.delete ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <button
                onClick={() => {
                  const allEnabled = Object.keys(permissions[selectedRole]).reduce((acc, module) => {
                    acc[module] = { view: true, edit: true, create: true, delete: true };
                    return acc;
                  }, {} as any);
                  setPermissions((prev) => ({ ...prev, [selectedRole]: allEnabled }));
                }}
                className="px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 rounded-lg transition-colors flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Enable All
              </button>
              <button
                onClick={() => {
                  const allDisabled = Object.keys(permissions[selectedRole]).reduce((acc, module) => {
                    acc[module] = { view: false, edit: false, create: false, delete: false };
                    return acc;
                  }, {} as any);
                  setPermissions((prev) => ({ ...prev, [selectedRole]: allDisabled }));
                }}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded-lg transition-colors flex items-center gap-2"
              >
                <X className="w-4 h-4" />
                Revoke All
              </button>
            </div>
            <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Save Permissions
            </button>
          </div>

          {/* Info Alert */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <h4 className="text-blue-400 font-semibold mb-1">Security Notice</h4>
                <p className="text-sm text-slate-300">
                  Permission changes take effect immediately for all active users in the selected role.
                  Users may need to refresh their session to see the updated access levels.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}