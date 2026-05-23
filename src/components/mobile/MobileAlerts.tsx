import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AlertTriangle, CheckCircle, Info, XCircle, Check, X, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function MobileAlerts() {
  const { notifications, markNotificationRead } = useApp();
  const [selectedAlert, setSelectedAlert] = useState<any>(null);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'error':
        return <XCircle className="w-6 h-6 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-orange-400" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-emerald-400" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-400" />;
      default:
        return <Info className="w-6 h-6 text-slate-400" />;
    }
  };

  const getAlertColor = (type: string) => {
    const colors: { [key: string]: { bg: string; border: string; text: string } } = {
      error: { bg: 'bg-red-500/20', border: 'border-red-500/50', text: 'text-red-400' },
      warning: { bg: 'bg-orange-500/20', border: 'border-orange-500/50', text: 'text-orange-400' },
      success: { bg: 'bg-emerald-500/20', border: 'border-emerald-500/50', text: 'text-emerald-400' },
      info: { bg: 'bg-blue-500/20', border: 'border-blue-500/50', text: 'text-blue-400' },
    };
    return colors[type] || colors.info;
  };

  const handleMarkAsRead = (id: number) => {
    markNotificationRead(id);
    toast.success('Alert marked as read');
  };

  const handleMarkAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.read) markNotificationRead(n.id);
    });
    toast.success('All alerts marked as read');
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const criticalAlerts = notifications.filter(n => n.type === 'error' && !n.read);

  if (selectedAlert) {
    const colors = getAlertColor(selectedAlert.type);
    
    return (
      <div className="fixed inset-0 bg-slate-950 z-50 overflow-y-auto pb-6">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 px-4 py-4 flex items-center gap-3 z-10">
          <button onClick={() => setSelectedAlert(null)} className="p-2 -ml-2 hover:bg-slate-800 rounded-lg">
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg text-slate-100 font-medium">Alert Details</h1>
          </div>
        </div>

        {/* Content */}
        <div className="px-4 pt-6 space-y-4">
          {/* Alert Card */}
          <div className={`${colors.bg} border ${colors.border} rounded-2xl p-6`}>
            <div className="flex items-start gap-4 mb-4">
              {getAlertIcon(selectedAlert.type)}
              <div className="flex-1">
                <p className={`${colors.text} font-medium mb-1 uppercase text-sm`}>
                  {selectedAlert.type} Alert
                </p>
                <p className="text-slate-100 text-lg leading-relaxed">
                  {selectedAlert.message}
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-between pt-4 border-t border-slate-700">
              <span className="text-slate-400 text-sm">{selectedAlert.time}</span>
              <span className={`text-sm px-3 py-1 rounded-full ${
                selectedAlert.read 
                  ? 'bg-slate-700 text-slate-400' 
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {selectedAlert.read ? 'Read' : 'Unread'}
              </span>
            </div>
          </div>

          {/* Suggested Actions */}
          {selectedAlert.type === 'error' && (
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-slate-300 font-medium mb-3">Suggested Actions</p>
              <div className="space-y-2">
                <button className="w-full bg-red-500/20 border border-red-500/50 text-red-400 rounded-lg p-3 text-left text-sm">
                  • Dispatch emergency technician
                </button>
                <button className="w-full bg-orange-500/20 border border-orange-500/50 text-orange-400 rounded-lg p-3 text-left text-sm">
                  • Contact supervisor
                </button>
                <button className="w-full bg-blue-500/20 border border-blue-500/50 text-blue-400 rounded-lg p-3 text-left text-sm">
                  • View detailed logs
                </button>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-2">
            {!selectedAlert.read && (
              <button 
                onClick={() => {
                  handleMarkAsRead(selectedAlert.id);
                  setSelectedAlert(null);
                }}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl p-4 font-medium flex items-center justify-center gap-2"
              >
                <Check className="w-5 h-5" />
                Mark as Read
              </button>
            )}
            <button 
              onClick={() => setSelectedAlert(null)}
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-xl p-4 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 px-4 pt-6 space-y-4">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl text-slate-100 font-medium mb-1">Alerts</h1>
          <p className="text-slate-400 text-sm">{unreadCount} unread</p>
        </div>
        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllAsRead}
            className="text-emerald-400 text-sm px-3 py-1.5 bg-emerald-500/20 border border-emerald-500/50 rounded-lg"
          >
            Mark all read
          </button>
        )}
      </div>

      {/* Critical Alerts Banner */}
      {criticalAlerts.length > 0 && (
        <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <XCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400 font-medium">Critical Alerts</p>
          </div>
          <p className="text-slate-300 text-sm">
            {criticalAlerts.length} critical {criticalAlerts.length === 1 ? 'alert requires' : 'alerts require'} immediate attention
          </p>
        </div>
      )}

      {/* Alert List */}
      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle className="w-12 h-12 text-slate-700 mx-auto mb-3" />
            <p className="text-slate-400">No alerts</p>
          </div>
        ) : (
          notifications
            .sort((a, b) => {
              // Sort: unread first, then by type (error > warning > info > success)
              if (a.read !== b.read) return a.read ? 1 : -1;
              const priority: { [key: string]: number } = { error: 0, warning: 1, info: 2, success: 3 };
              return (priority[a.type] || 999) - (priority[b.type] || 999);
            })
            .map((notification) => {
              const colors = getAlertColor(notification.type);
              
              return (
                <button
                  key={notification.id}
                  onClick={() => setSelectedAlert(notification)}
                  className={`w-full ${colors.bg} border ${colors.border} rounded-xl p-4 active:opacity-80 transition-opacity ${
                    notification.read ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Icon */}
                    {getAlertIcon(notification.type)}

                    {/* Content */}
                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={`${colors.text} text-xs font-medium uppercase`}>
                          {notification.type}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 bg-emerald-400 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-slate-100 text-sm mb-2 leading-relaxed">
                        {notification.message}
                      </p>
                      <p className="text-slate-500 text-xs">{notification.time}</p>
                    </div>
                  </div>

                  {/* Quick Action for Critical */}
                  {!notification.read && notification.type === 'error' && (
                    <div className="mt-3 pt-3 border-t border-red-500/30">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                        className="w-full bg-red-500 hover:bg-red-600 text-white rounded-lg py-2 text-sm font-medium"
                      >
                        Acknowledge
                      </button>
                    </div>
                  )}
                </button>
              );
            })
        )}
      </div>
    </div>
  );
}
