import { useEffect, useRef, useState } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle, AlertTriangle, XCircle, Info, X } from 'lucide-react';

interface NotificationPanelProps {
  onClose: () => void;
  anchorRef?: React.RefObject<HTMLElement | null>;
}

export default function NotificationPanel({ onClose, anchorRef }: NotificationPanelProps) {
  const { notifications, markNotificationRead, markAllNotificationsRead, refreshNotifications } = useApp();
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 64, right: 16 });

  useEffect(() => {
    refreshNotifications?.();
  }, [refreshNotifications]);

  useEffect(() => {
    const updatePosition = () => {
      if (anchorRef?.current) {
        const rect = anchorRef.current.getBoundingClientRect();
        setPosition({
          top: rect.bottom + 8,
          right: Math.max(8, window.innerWidth - rect.right),
        });
      }
    };
    updatePosition();
    window.addEventListener('scroll', updatePosition, true);
    window.addEventListener('resize', updatePosition);
    return () => {
      window.removeEventListener('scroll', updatePosition, true);
      window.removeEventListener('resize', updatePosition);
    };
  }, [anchorRef]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        anchorRef?.current &&
        !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose, anchorRef]);

  const getIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'error': return <XCircle className="w-4 h-4 text-red-400" />;
      default: return <Info className="w-4 h-4 text-blue-400" />;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'success': return 'bg-emerald-500/10 border-emerald-500/50';
      case 'warning': return 'bg-yellow-500/10 border-yellow-500/50';
      case 'error': return 'bg-red-500/10 border-red-500/50';
      default: return 'bg-blue-500/10 border-blue-500/50';
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} aria-hidden="true" />
      <div
        ref={panelRef}
        style={{ top: position.top, right: position.right }}
        className="fixed w-[min(24rem,calc(100vw-1rem))] max-h-[min(32rem,70vh)] bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-4 border-b border-slate-800 shrink-0">
          <div>
            <h3 className="text-lg text-slate-100">Notifications</h3>
            <p className="text-xs text-slate-400">
              {notifications.filter(n => !n.read).length} unread
            </p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded transition-colors">
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-slate-500">
              <Info className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p>No notifications</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-800">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  onClick={() => markNotificationRead(notification.id)}
                  className={`p-4 cursor-pointer transition-all hover:bg-slate-800/50 ${
                    !notification.read ? 'bg-slate-800/30' : ''
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg border shrink-0 ${getColor(notification.type)}`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 mb-1">{notification.message}</p>
                      <p className="text-xs text-slate-500">{notification.time}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-emerald-400 rounded-full shrink-0 mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {notifications.length > 0 && (
          <div className="p-3 border-t border-slate-800 shrink-0">
            <button
              onClick={() => markAllNotificationsRead()}
              className="w-full px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </>
  );
}
