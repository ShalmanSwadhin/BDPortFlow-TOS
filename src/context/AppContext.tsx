import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authAPI, truckAPI, containerAPI, vesselAPI } from '../api/client';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

interface Container {
  id: string;
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
}

interface Vessel {
  id: number;
  name: string;
  length: number;
  draft: number;
  eta: string;
  etd: string;
  berth: number | null;
  status: string;
  cargo: string;
  containers: number;
  progress: number;
  color: string;
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
}

interface Notification {
  id: number;
  type: 'success' | 'warning' | 'error' | 'info';
  message: string;
  time: string;
  read: boolean;
}

interface AppContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  containers: Container[];
  vessels: Vessel[];
  bookings: TruckBooking[];
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'time' | 'read'>) => void;
  markNotificationRead: (id: number) => void;
  updateContainer: (id: string, updates: Partial<Container>) => void;
  updateVessel: (id: number, updates: Partial<Vessel>) => void;
  addBooking: (booking: Omit<TruckBooking, 'id'>) => void;
  updateBooking: (id: string, updates: Partial<TruckBooking>) => void;
  deleteBooking: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const [containers, setContainers] = useState<Container[]>([
    { id: 'TCLU3456789', status: 'ready', location: 'Block A-12', type: 'standard', weight: 22.5, destination: 'Singapore' },
    { id: 'YMMU8901234', status: 'customs', location: 'Block C-15', type: 'reefer', weight: 24.8, destination: 'Dubai', temperature: -22.8, targetTemp: -20, power: 100, humidity: 45, cargo: 'Pharmaceuticals', alarm: true },
    { id: 'MAEU5678901', status: 'ready', location: 'Block A-08', type: 'standard', weight: 20.2, destination: 'Shanghai' },
    { id: 'CSQU2345678', status: 'processing', location: 'Block D-20', type: 'standard', weight: 23.1, destination: 'Singapore' },
    { id: 'HLBU7890123', status: 'ready', location: 'Block B-05', type: 'hazmat', weight: 25.3, destination: 'Dubai' },
    { id: 'TCKU4567890', status: 'ready', location: 'Block C-18', type: 'reefer', weight: 21.7, destination: 'Shanghai', temperature: -19.9, targetTemp: -20, power: 94, humidity: 60, cargo: 'Frozen Fish', alarm: false },
  ]);

  const [vessels, setVessels] = useState<Vessel[]>([
    { id: 1, name: 'MV HARMONY', length: 280, draft: 12.5, eta: '14:30', etd: '18:00', berth: 1, status: 'loading', cargo: 'Container', containers: 245, progress: 65, color: '#00ff88' },
    { id: 2, name: 'MSC AURORA', length: 350, draft: 14.2, eta: '16:00', etd: '22:00', berth: 2, status: 'unloading', cargo: 'Container', containers: 412, progress: 45, color: '#00d4ff' },
    { id: 3, name: 'MAERSK LIBERTY', length: 320, draft: 13.8, eta: '09:00', etd: '15:00', berth: 3, status: 'loading', cargo: 'Container', containers: 328, progress: 85, color: '#ffd700' },
    { id: 4, name: 'EVERGREEN PRIDE', length: 290, draft: 13.0, eta: 'Tomorrow 08:00', etd: 'Tomorrow 16:00', berth: null, status: 'incoming', cargo: 'Container', containers: 298, progress: 0, color: '#ff6b35' },
  ]);

  const [bookings, setBookings] = useState<TruckBooking[]>([
    { id: '1', truck: 'DHK-GA-1234', container: 'TCLU3456789', slot: '14:30', date: '2024-11-28', status: 'confirmed', driver: 'Ahmed Khan', contact: '+880 1234-567890' },
    { id: '2', truck: 'CHT-BA-5678', container: 'YMMU8901234', slot: '15:00', date: '2024-11-28', status: 'confirmed', driver: 'Fatima Rahman', contact: '+880 1234-567891' },
    { id: '3', truck: 'DHK-KA-9012', container: 'MAEU5678901', slot: '15:30', date: '2024-11-28', status: 'pending', driver: 'Karim Hassan', contact: '+880 1234-567892' },
    { id: '4', truck: 'CHT-TA-3456', container: 'CSQU2345678', slot: '16:00', date: '2024-11-28', status: 'confirmed', driver: 'Nazia Ahmed', contact: '+880 1234-567893' },
  ]);

  const [notifications, setNotifications] = useState<Notification[]>([
    { id: 1, type: 'error', message: 'Reefer YMMU8901234 temperature critical: -22.8°C', time: '2 min ago', read: false },
    { id: 2, type: 'warning', message: 'Gate 3 weight mismatch detected', time: '5 min ago', read: false },
    { id: 3, type: 'info', message: 'Berth 2 vessel MV HARMONY arrived', time: '15 min ago', read: false },
    { id: 4, type: 'warning', message: 'Yard Block C approaching 95% capacity', time: '22 min ago', read: false },
    { id: 5, type: 'error', message: 'Crane 4 maintenance alert', time: '1 hour ago', read: false },
    { id: 6, type: 'success', message: 'Container TCLU3456789 ready for pickup', time: '1 hour ago', read: true },
    { id: 7, type: 'success', message: 'Invoice INV-2024-001247 payment received', time: '2 hours ago', read: true },
  ]);

  const addNotification = (notification: Omit<Notification, 'id' | 'time' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now(),
      time: 'Just now',
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationRead = (id: number) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const updateContainer = (id: string, updates: Partial<Container>) => {
    setContainers(prev =>
      prev.map(container => (container.id === id ? { ...container, ...updates } : container))
    );
  };

  const updateVessel = (id: number, updates: Partial<Vessel>) => {
    setVessels(prev =>
      prev.map(vessel => (vessel.id === id ? { ...vessel, ...updates } : vessel))
    );
  };

  const addBooking = async (booking: Omit<TruckBooking, 'id'>) => {
    try {
      const response = await truckAPI.create({
        truckNumber: booking.truck,
        driverName: booking.driver || 'Unknown Driver',
        driverContact: booking.contact || '',
        containerId: booking.container,
        appointmentDate: booking.date,
        appointmentTime: booking.slot,
        purpose: booking.operationType === 'Container Pickup' ? 'Pickup' : 
                booking.operationType === 'Container Delivery' ? 'Delivery' : 
                booking.operationType === 'Empty Return' ? 'Empty Return' : 'Delivery',
        status: booking.status || 'Scheduled',
      });

      if (response.data.success) {
        const apiBooking = response.data.data;
        const newBooking: TruckBooking = {
          id: apiBooking._id.toString(),
          truck: apiBooking.truckNumber,
          container: apiBooking.containerId,
          slot: apiBooking.appointmentTime,
          date: new Date(apiBooking.appointmentDate).toISOString().split('T')[0],
          status: apiBooking.status,
          driver: apiBooking.driverName,
          contact: apiBooking.driverContact,
        };
        setBookings(prev => [...prev, newBooking]);
        addNotification({
          type: 'success',
          message: `Booking confirmed for ${booking.container} at ${booking.slot}`,
        });
      }
    } catch (error: any) {
      console.error('Error adding booking:', error);
      addNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to create booking',
      });
    }
  };

  const updateBooking = async (id: string, updates: Partial<TruckBooking>) => {
    try {
      const response = await truckAPI.update(id.toString(), {
        status: updates.status,
        appointmentTime: updates.slot,
        appointmentDate: updates.date,
      });

      if (response.data.success) {
        setBookings(prev =>
          prev.map(booking => (booking.id === id ? { ...booking, ...updates } : booking))
        );
        addNotification({
          type: 'success',
          message: 'Booking updated successfully',
        });
      }
    } catch (error: any) {
      console.error('Error updating booking:', error);
      addNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to update booking',
      });
    }
  };

  const deleteBooking = async (id: string) => {
    try {
      const response = await truckAPI.delete(id.toString());

      if (response.data.success) {
        setBookings(prev => prev.filter(booking => booking.id !== id));
        addNotification({
          type: 'info',
          message: 'Booking cancelled successfully',
        });
      }
    } catch (error: any) {
      console.error('Error deleting booking:', error);
      addNotification({
        type: 'error',
        message: error.response?.data?.message || 'Failed to delete booking',
      });
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login({ email, password });
      const { user: userData, token: authToken } = response.data.data;
      
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', authToken);
      
      addNotification({
        type: 'success',
        message: `Welcome back, ${userData.name}!`,
      });
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw new Error(errorMessage);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    addNotification({
      type: 'info',
      message: 'Logged out successfully',
    });
  };

  return (
    <AppContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        login,
        logout,
        containers,
        vessels,
        bookings,
        notifications,
        addNotification,
        markNotificationRead,
        updateContainer,
        updateVessel,
        addBooking,
        updateBooking,
        deleteBooking,
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