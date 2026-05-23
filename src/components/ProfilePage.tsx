import { 
  User, Shield, Settings, HelpCircle, Bell, Lock, Globe, Moon, Info, 
  ChevronRight, Mail, Phone, MapPin, Calendar, Clock, Award, 
  Activity, TrendingUp, FileText, Download, Edit2, Camera, X
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { useState } from 'react';

interface ProfilePageProps {
  userRole: string;
  onClose: () => void;
}

export default function ProfilePage({ userRole, onClose }: ProfilePageProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'settings' | 'activity' | 'stats'>('overview');

  const getRoleInfo = (role: string) => {
    const roleMap: { [key: string]: { 
      name: string; 
      badge: string; 
      color: string;
      department: string;
      employeeId: string;
      permissions: string[];
    } } = {
      admin: { 
        name: 'Administrator', 
        badge: 'Full Access', 
        color: 'red',
        department: 'System Administration',
        employeeId: 'CPA-ADM-001',
        permissions: ['Full System Access', 'User Management', 'System Configuration', 'Analytics & Reports']
      },
      operator: { 
        name: 'Port Operator', 
        badge: 'Operations Team', 
        color: 'emerald',
        department: 'Operations Department',
        employeeId: 'CPA-OPS-024',
        permissions: ['Yard Management', 'Equipment Control', 'Container Operations', 'Crane Monitoring']
      },
      berth: { 
        name: 'Berth Planner', 
        badge: 'Planning Team', 
        color: 'blue',
        department: 'Berth Planning Division',
        employeeId: 'CPA-BRT-012',
        permissions: ['Vessel Scheduling', 'Berth Allocation', 'Ship Manifest', 'Stowage Planning']
      },
      driver: { 
        name: 'Truck Driver', 
        badge: 'Logistics Partner', 
        color: 'yellow',
        department: 'External Contractor',
        employeeId: 'CTG-DRV-458',
        permissions: ['Gate Entry', 'Container Pickup', 'Appointment Booking', 'Delivery Status']
      },
      customs: { 
        name: 'Customs Officer', 
        badge: 'Customs Authority', 
        color: 'orange',
        department: 'Bangladesh Customs',
        employeeId: 'BD-CUS-089',
        permissions: ['Clearance Approval', 'Document Verification', 'Inspection Access', 'Tax Assessment']
      },
      finance: { 
        name: 'Finance Manager', 
        badge: 'Finance Department', 
        color: 'purple',
        department: 'Finance & Accounting',
        employeeId: 'CPA-FIN-015',
        permissions: ['Billing Management', 'Payment Processing', 'Invoice Generation', 'Financial Reports']
      },
    };
    return roleMap[role] || { 
      name: 'User', 
      badge: 'General Access', 
      color: 'slate',
      department: 'General',
      employeeId: 'CPA-USR-000',
      permissions: ['Basic Access']
    };
  };

  const roleInfo = getRoleInfo(userRole);

  const getBadgeColor = (color: string) => {
    const colors: { [key: string]: string } = {
      red: 'bg-red-500/20 text-red-400 border-red-500/50',
      emerald: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
      blue: 'bg-blue-500/20 text-blue-400 border-blue-500/50',
      yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
      orange: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
      purple: 'bg-purple-500/20 text-purple-400 border-purple-500/50',
      slate: 'bg-slate-500/20 text-slate-400 border-slate-500/50',
    };
    return colors[color] || colors.slate;
  };

  const getIconColor = (color: string) => {
    const colors: { [key: string]: string } = {
      red: 'text-red-400',
      emerald: 'text-emerald-400',
      blue: 'text-blue-400',
      yellow: 'text-yellow-400',
      orange: 'text-orange-400',
      purple: 'text-purple-400',
      slate: 'text-slate-400',
    };
    return colors[color] || colors.slate;
  };

  const settingsGroups = [
    {
      title: 'Account',
      items: [
        { label: 'Profile Settings', icon: User, action: () => toast.info('Profile settings') },
        { label: 'Security & Privacy', icon: Lock, action: () => toast.info('Security settings') },
        { label: 'Notifications', icon: Bell, action: () => toast.info('Notification preferences') },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { label: 'Language', icon: Globe, action: () => toast.info('Language: English') },
        { label: 'Appearance', icon: Moon, action: () => toast.info('Theme: Dark Mode') },
      ]
    },
    {
      title: 'Support',
      items: [
        { label: 'Help & Support', icon: HelpCircle, action: () => toast.info('Help center') },
        { label: 'About BDPortFlow', icon: Info, action: () => toast.info('BDPortFlow v2.1.0') },
      ]
    }
  ];

  const recentActivity = [
    { action: 'Logged in', time: '2 hours ago', icon: Activity, color: 'text-emerald-400' },
    { action: 'Updated vessel schedule', time: '5 hours ago', icon: FileText, color: 'text-blue-400' },
    { action: 'Generated report', time: 'Yesterday', icon: Download, color: 'text-purple-400' },
    { action: 'Modified berth allocation', time: '2 days ago', icon: Edit2, color: 'text-yellow-400' },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-2xl">User Profile</h2>
            <p className="text-slate-400 text-sm mt-1">{roleInfo.department}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Left Column - Profile Card */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Header */}
            <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-xl p-6">
              <div className="flex flex-col items-center text-center mb-4">
                <div className="relative mb-4">
                  <div className={`w-24 h-24 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center`}>
                    <User className="w-12 h-12 text-white" />
                  </div>
                  <button 
                    onClick={() => toast.info('Upload photo')}
                    className="absolute bottom-0 right-0 p-2 bg-blue-500 hover:bg-blue-600 rounded-full border-2 border-slate-900 transition-colors"
                  >
                    <Camera className="w-4 h-4 text-white" />
                  </button>
                </div>
                <h3 className="text-xl text-slate-100 font-medium mb-1">
                  {roleInfo.name}
                </h3>
                <p className="text-slate-400 text-sm mb-3">user@bdportflow.com</p>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs ${getBadgeColor(roleInfo.color)}`}>
                  <Shield className="w-3 h-3" />
                  {roleInfo.badge}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3 pt-4 border-t border-slate-700">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-300">user@bdportflow.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-300">+880-31-2510-500</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-300">Chittagong Port Authority</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-slate-500" />
                  <span className="text-slate-300">Joined: Dec 2024</span>
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
              <h4 className="text-sm text-slate-400 mb-4">Activity Statistics</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-emerald-400 text-2xl font-semibold">127</p>
                  <p className="text-slate-500 text-xs mt-1">Sessions</p>
                </div>
                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-blue-400 text-2xl font-semibold">45</p>
                  <p className="text-slate-500 text-xs mt-1">Days Active</p>
                </div>
                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-purple-400 text-2xl font-semibold">98%</p>
                  <p className="text-slate-500 text-xs mt-1">Uptime</p>
                </div>
                <div className="text-center p-3 bg-slate-900/50 rounded-lg">
                  <p className="text-yellow-400 text-2xl font-semibold">4.8</p>
                  <p className="text-slate-500 text-xs mt-1">Rating</p>
                </div>
              </div>
            </div>

            {/* System Status */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-slate-300 text-sm">System Status</span>
                <span className="flex items-center gap-2 text-emerald-400 text-xs">
                  <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                  Online
                </span>
              </div>
              <div className="space-y-2 text-xs text-slate-500">
                <div className="flex justify-between">
                  <span>Version</span>
                  <span className="text-slate-400">v2.1.0</span>
                </div>
                <div className="flex justify-between">
                  <span>Last Login</span>
                  <span className="text-slate-400">Today, 14:30</span>
                </div>
                <div className="flex justify-between">
                  <span>Session</span>
                  <span className="text-slate-400">2h 15m</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tabs Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tabs */}
            <div className="flex gap-2 border-b border-slate-800">
              {[
                { id: 'overview', label: 'Overview', icon: User },
                { id: 'settings', label: 'Settings', icon: Settings },
                { id: 'activity', label: 'Activity', icon: Activity },
                { id: 'stats', label: 'Statistics', icon: TrendingUp },
              ].map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-all ${
                      activeTab === tab.id
                        ? 'border-emerald-500 text-emerald-400'
                        : 'border-transparent text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-sm">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Employee Details */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h4 className="text-lg mb-4">Employee Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-500 text-xs">Employee ID</label>
                      <p className="text-slate-200 mt-1">{roleInfo.employeeId}</p>
                    </div>
                    <div>
                      <label className="text-slate-500 text-xs">Department</label>
                      <p className="text-slate-200 mt-1">{roleInfo.department}</p>
                    </div>
                    <div>
                      <label className="text-slate-500 text-xs">Position</label>
                      <p className="text-slate-200 mt-1">{roleInfo.name}</p>
                    </div>
                    <div>
                      <label className="text-slate-500 text-xs">Access Level</label>
                      <p className={`mt-1 ${getIconColor(roleInfo.color)}`}>{roleInfo.badge}</p>
                    </div>
                    <div>
                      <label className="text-slate-500 text-xs">Work Location</label>
                      <p className="text-slate-200 mt-1">Chittagong Port Authority</p>
                    </div>
                    <div>
                      <label className="text-slate-500 text-xs">Shift</label>
                      <p className="text-slate-200 mt-1">Day Shift (08:00 - 16:00)</p>
                    </div>
                  </div>
                </div>

                {/* Permissions */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className={`w-5 h-5 ${getIconColor(roleInfo.color)}`} />
                    <h4 className="text-lg">Access Permissions</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {roleInfo.permissions.map((permission, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2 p-3 bg-slate-900/50 border border-slate-700 rounded-lg"
                      >
                        <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                        <span className="text-sm text-slate-300">{permission}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h4 className="text-lg mb-4">Quick Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => toast.info('Edit profile')}
                      className="p-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/50 rounded-lg transition-all text-left"
                    >
                      <Edit2 className="w-5 h-5 text-blue-400 mb-2" />
                      <p className="text-sm text-blue-400">Edit Profile</p>
                    </button>
                    <button
                      onClick={() => toast.info('Change password')}
                      className="p-4 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 rounded-lg transition-all text-left"
                    >
                      <Lock className="w-5 h-5 text-purple-400 mb-2" />
                      <p className="text-sm text-purple-400">Change Password</p>
                    </button>
                    <button
                      onClick={() => toast.info('Download data')}
                      className="p-4 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 rounded-lg transition-all text-left"
                    >
                      <Download className="w-5 h-5 text-emerald-400 mb-2" />
                      <p className="text-sm text-emerald-400">Export Data</p>
                    </button>
                    <button
                      onClick={() => toast.info('View certificates')}
                      className="p-4 bg-yellow-500/20 hover:bg-yellow-500/30 border border-yellow-500/50 rounded-lg transition-all text-left"
                    >
                      <Award className="w-5 h-5 text-yellow-400 mb-2" />
                      <p className="text-sm text-yellow-400">Certificates</p>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                {settingsGroups.map((group, idx) => (
                  <div key={idx} className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
                    <div className="px-6 py-3 bg-slate-900/50 border-b border-slate-700">
                      <h4 className="text-sm text-slate-400">{group.title}</h4>
                    </div>
                    <div>
                      {group.items.map((item, itemIdx) => {
                        const Icon = item.icon;
                        return (
                          <button
                            key={itemIdx}
                            onClick={item.action}
                            className={`w-full flex items-center justify-between p-4 hover:bg-slate-700/50 transition-colors ${
                              itemIdx !== group.items.length - 1 ? 'border-b border-slate-700' : ''
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <Icon className="w-5 h-5 text-slate-400" />
                              <span className="text-slate-300 text-sm">{item.label}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-slate-500" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-4">
                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h4 className="text-lg mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    {recentActivity.map((activity, idx) => {
                      const Icon = activity.icon;
                      return (
                        <div
                          key={idx}
                          className="flex items-center gap-4 p-4 bg-slate-900/50 border border-slate-700 rounded-lg hover:border-slate-600 transition-all"
                        >
                          <div className="p-2 bg-slate-800 rounded-lg">
                            <Icon className={`w-5 h-5 ${activity.color}`} />
                          </div>
                          <div className="flex-1">
                            <p className="text-slate-200 text-sm">{activity.action}</p>
                            <p className="text-slate-500 text-xs mt-0.5">{activity.time}</p>
                          </div>
                          <Clock className="w-4 h-4 text-slate-600" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'stats' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h4 className="text-sm text-slate-400 mb-4">Performance Metrics</h4>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-slate-300">Task Completion</span>
                          <span className="text-emerald-400 text-sm">94%</span>
                        </div>
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '94%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-slate-300">Response Time</span>
                          <span className="text-blue-400 text-sm">87%</span>
                        </div>
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: '87%' }}></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-slate-300">Accuracy</span>
                          <span className="text-purple-400 text-sm">96%</span>
                        </div>
                        <div className="h-2 bg-slate-900 rounded-full overflow-hidden">
                          <div className="h-full bg-purple-500 rounded-full" style={{ width: '96%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                    <h4 className="text-sm text-slate-400 mb-4">This Month</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                        <span className="text-sm text-slate-300">Tasks Completed</span>
                        <span className="text-emerald-400 font-semibold">42</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                        <span className="text-sm text-slate-300">Hours Logged</span>
                        <span className="text-blue-400 font-semibold">156</span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-900/50 rounded-lg">
                        <span className="text-sm text-slate-300">Reports Generated</span>
                        <span className="text-purple-400 font-semibold">18</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                  <h4 className="text-lg mb-4">Achievements</h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                      <Award className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                      <p className="text-slate-400 text-xs">Perfect Week</p>
                    </div>
                    <div className="text-center p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                      <Award className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
                      <p className="text-slate-400 text-xs">Top Performer</p>
                    </div>
                    <div className="text-center p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                      <Award className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                      <p className="text-slate-400 text-xs">Fast Response</p>
                    </div>
                    <div className="text-center p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
                      <Award className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                      <p className="text-slate-400 text-xs">Team Player</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
