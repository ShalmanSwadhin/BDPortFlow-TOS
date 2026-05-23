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

  const [containers, setContainers] = useState<Container[]>([]);

  const [vessels, setVessels] = useState<Vessel[]>([]);

  const [bookings, setBookings] = useState<TruckBooking[]>([]);

  const [notifications, setNotifications] = useState<Notification[]>([]);

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

  // Load truck bookings from the database when token is available
  useEffect(() => {
    const loadBookings = async () => {
      if (!token) return;
      
      try {
        const response = await truckAPI.getAll();
        if (response.data.success && response.data.data) {
          const loadedBookings = response.data.data.map((truck: any) => ({
            id: truck._id.toString(),
            truck: truck.truckNumber,
            container: truck.containerId,
            slot: truck.appointmentTime,
            date: new Date(truck.appointmentDate).toISOString().split('T')[0],
            status: truck.status === 'Scheduled' ? 'pending' : 
                    truck.status === 'Arrived' ? 'confirmed' :
                    truck.status,
            driver: truck.driverName,
            contact: truck.driverContact,
          }));
          setBookings(loadedBookings);
        }
      } catch (error) {
        console.error('Error loading truck bookings:', error);
      }
    };

    loadBookings();
  }, [token]);

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