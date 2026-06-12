import { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import {
  authAPI,
  truckAPI,
  containerAPI,
  vesselAPI,
  notificationAPI,
  reeferAPI,
  gateAPI,
  railAPI,
  billingAPI,
  permissionAPI,
} from '../api/client';
import {
  mapContainerFromApi,
  mapVesselFromApi,
  mapBookingFromApi,
  mapNotificationFromApi,
  formatDateKey,
} from '../utils/dataMappers';

interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface Container {
  id: string;
  _id?: string;
  status: string;
  location: string;
  type: string;
  weight: number;
  destination?: string;
  temperature?: number;
  targetTemp?: number;
  power?: number;
  humidity?: number;
  cargo?: string;
  alarm?: boolean;
  raw?: any;
}

interface Vessel {
  id: string | number;
  _id?: string;
  name: string;
  length: number;
  draft: number;
  eta: string;
  etd: string;
  berth: number | null;
  berthNumber?: string;
  status: string;
  cargo: string;
  containers: number;
  progress: number;
  color: string;
  raw?: any;
}

interface TruckBooking {
  id: string;
  truck: string;
  container: string;
  slot: string;
  date: string;
  status: string;
  driver?: string;
  contact?: string;
  operationType?: string;
  createdAt?: string;
  raw?: any;
}

interface Notification {
  id: string | number;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  time: string;
  read: boolean;
  module?: string;
  raw?: any;
}

interface AppContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  permissions: Record<string, any> | null;
  login: (email: string, password: string) => Promise<string>;
  logout: () => void;
  refreshAllData: () => Promise<void>;
  refreshBookings: (date?: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
  containers: Container[];
  vessels: Vessel[];
  bookings: TruckBooking[];
  notifications: Notification[];
  reefers: any[];
  gates: any[];
  rails: any[];
  invoices: any[];
  markNotificationRead: (id: string | number) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  updateContainer: (id: string, updates: Partial<Container>) => Promise<void>;
  patchContainersFromStackMove: (updates: Array<{ containerId: string; location: Record<string, string> }>) => void;
  updateVessel: (id: string, updates: Partial<Vessel>) => Promise<void>;
  addBooking: (booking: Omit<TruckBooking, 'id'>) => Promise<void>;
  updateBooking: (id: string, updates: Partial<TruckBooking>, refreshDate?: string) => Promise<void>;
  deleteBooking: (id: string, refreshDate?: string) => Promise<void>;
  hasPermission: (module: string, action?: 'view' | 'edit' | 'delete' | 'create') => boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(false);
  const [permissions, setPermissions] = useState<Record<string, any> | null>(null);
  const [containers, setContainers] = useState<Container[]>([]);
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [bookings, setBookings] = useState<TruckBooking[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reefers, setReefers] = useState<any[]>([]);
  const [gates, setGates] = useState<any[]>([]);
  const [rails, setRails] = useState<any[]>([]);
  const [invoices, setInvoices] = useState<any[]>([]);

  const loadPermissions = useCallback(async () => {
    try {
      const res = await permissionAPI.getMy();
      if (res.data.success) {
        setPermissions(res.data.data.modules);
      }
    } catch {
      setPermissions(null);
    }
  }, []);

  const refreshNotifications = useCallback(async () => {
    if (!token) return;
    try {
      const res = await notificationAPI.getAll();
      if (res.data.success) {
        setNotifications(res.data.data.map(mapNotificationFromApi));
      }
    } catch (error) {
      console.error('Failed to load notifications:', error);
    }
  }, [token]);

  const refreshBookings = useCallback(async (date?: string) => {
    if (!token) return;
    try {
      const dateKey = date || formatDateKey(new Date());
      const res = await truckAPI.getByDate(dateKey);
      if (res.data.success) {
        setBookings(res.data.data.map(mapBookingFromApi));
      }
    } catch (error) {
      console.error('Failed to load bookings:', error);
      setBookings([]);
    }
  }, [token]);

  const refreshAllData = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [containersRes, vesselsRes, notificationsRes, reefersRes, gatesRes, railsRes, billingRes] =
        await Promise.allSettled([
          containerAPI.getAll(),
          vesselAPI.getAll(),
          notificationAPI.getAll(),
          reeferAPI.getAll(),
          gateAPI.getAll(),
          railAPI.getAll(),
          billingAPI.getAll(),
        ]);

      if (containersRes.status === 'fulfilled' && containersRes.value.data.success) {
        setContainers(containersRes.value.data.data.map(mapContainerFromApi));
      }
      if (vesselsRes.status === 'fulfilled' && vesselsRes.value.data.success) {
        setVessels(vesselsRes.value.data.data.map((v: any, i: number) => mapVesselFromApi(v, i)));
      }
      if (notificationsRes.status === 'fulfilled' && notificationsRes.value.data.success) {
        setNotifications(notificationsRes.value.data.data.map(mapNotificationFromApi));
      }
      if (reefersRes.status === 'fulfilled' && reefersRes.value.data.success) {
        setReefers(reefersRes.value.data.data);
      }
      if (gatesRes.status === 'fulfilled' && gatesRes.value.data.success) {
        setGates(gatesRes.value.data.data);
      }
      if (railsRes.status === 'fulfilled' && railsRes.value.data.success) {
        setRails(railsRes.value.data.data);
      }
      if (billingRes.status === 'fulfilled' && billingRes.value.data.success) {
        setInvoices(billingRes.value.data.data);
      }

      await loadPermissions();
    } catch (error) {
      console.error('Failed to refresh data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [token, loadPermissions]);

  useEffect(() => {
    if (!token) {
      setBookings([]);
      return;
    }
    refreshBookings(formatDateKey(new Date()));
  }, [token, refreshBookings]);

  useEffect(() => {
    if (!token) return;
    const interval = setInterval(() => {
      refreshAllData();
    }, 30000);
    const onFocus = () => refreshAllData();
    window.addEventListener('focus', onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [token, refreshAllData]);

  useEffect(() => {
    if (token) {
      refreshAllData();
    } else {
      setContainers([]);
      setVessels([]);
      setBookings([]);
      setNotifications([]);
      setReefers([]);
      setGates([]);
      setRails([]);
      setInvoices([]);
      setPermissions(null);
    }
  }, [token, refreshAllData]);

  const hasPermission = useCallback((module: string, action: 'view' | 'edit' | 'delete' | 'create' = 'view') => {
    if (user?.role === 'admin') return true;
    if (!permissions) return false;
    return permissions[module]?.[action] === true;
  }, [user, permissions]);

  const markNotificationRead = async (id: string | number) => {
    try {
      await notificationAPI.markAsRead(String(id));
      setNotifications(prev =>
        prev.map(n => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (error) {
      console.error('Failed to mark notification read:', error);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (error) {
      console.error('Failed to mark all read:', error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await notificationAPI.delete(id);
      setNotifications(prev => prev.filter(n => String(n.id) !== id));
    } catch (error) {
      console.error('Failed to delete notification:', error);
    }
  };

  const updateContainer = async (id: string, updates: Partial<Container>) => {
    try {
      const container = containers.find(c => c.id === id);
      const apiId = container?._id || id;
      const response = await containerAPI.update(apiId, updates);
      if (response.data.success) {
        setContainers(prev =>
          prev.map(c => (c.id === id ? { ...c, ...mapContainerFromApi(response.data.data) } : c))
        );
      }
    } catch (error) {
      console.error('Failed to update container:', error);
      throw error;
    }
  };

  const patchContainersFromStackMove = useCallback(
    (updates: Array<{ containerId: string; location: Record<string, string> }>) => {
      if (!updates?.length) return;
      const byId = new Map(
        updates.map(u => [String(u.containerId).toUpperCase(), u.location])
      );
      setContainers(prev =>
        prev.map(c => {
          const location = byId.get(String(c.id).toUpperCase());
          if (!location) return c;
          return mapContainerFromApi({ ...c.raw, location });
        })
      );
    },
    []
  );

  const updateVessel = async (id: string | number, updates: Partial<Vessel>) => {
    try {
      const response = await vesselAPI.update(String(id), updates);
      if (response.data.success) {
        setVessels(prev =>
          prev.map((v, i) => (v.id === id ? mapVesselFromApi(response.data.data, i) : v))
        );
      }
    } catch (error) {
      console.error('Failed to update vessel:', error);
      throw error;
    }
  };

  const addBooking = async (booking: Omit<TruckBooking, 'id'>) => {
    const response = await truckAPI.create({
      truckNumber: booking.truck,
      driverName: booking.driver || 'Unknown Driver',
      driverContact: booking.contact || '',
      containerId: booking.container,
      appointmentDate: booking.date,
      appointmentTime: booking.slot,
      purpose: booking.operationType === 'Container Pickup' ? 'Pickup'
        : booking.operationType === 'Container Delivery' ? 'Delivery'
        : booking.operationType === 'Empty Return' ? 'Empty Return' : 'Delivery',
      status: booking.status || 'Scheduled',
    });

    if (response.data.success) {
      await refreshBookings(booking.date);
      await refreshNotifications();
    } else {
      throw new Error(response.data.message);
    }
  };

  const updateBooking = async (id: string, updates: Partial<TruckBooking>, refreshDate?: string) => {
    const response = await truckAPI.update(id, {
      status: updates.status,
      appointmentTime: updates.slot,
      appointmentDate: updates.date,
    });

    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to update booking');
    }

    await refreshBookings(refreshDate || updates.date || formatDateKey(new Date()));
    await refreshNotifications();
  };

  const deleteBooking = async (id: string, refreshDate?: string) => {
    const response = await truckAPI.delete(id);
    if (response.data.success) {
      await refreshBookings(refreshDate || formatDateKey(new Date()));
      await refreshNotifications();
    } else {
      throw new Error(response.data.message || 'Failed to cancel booking');
    }
  };

  const login = async (email: string, password: string): Promise<string> => {
    const response = await authAPI.login({ email, password });
    const { user: userData, token: authToken } = response.data.data;

    setUser(userData);
    setToken(authToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', authToken);

    return userData.role;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        permissions,
        login,
        logout,
        refreshAllData,
        refreshBookings,
        refreshNotifications,
        containers,
        vessels,
        bookings,
        notifications,
        reefers,
        gates,
        rails,
        invoices,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        updateContainer,
        patchContainersFromStackMove,
        updateVessel,
        addBooking,
        updateBooking,
        deleteBooking,
        hasPermission,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
