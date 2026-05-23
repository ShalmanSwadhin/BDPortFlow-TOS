import { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import PublicDashboard from './components/PublicDashboard';
import MainLayout from './components/MainLayout';
import { Toaster } from "sonner";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize from localStorage on app load
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    return !!(token && user);
  });
  const [userRole, setUserRole] = useState<string>(() => {
    // Initialize from localStorage on app load
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user).role : '';
    } catch {
      return '';
    }
  });
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPublicDashboard, setShowPublicDashboard] = useState(() => {
    // Show public dashboard only if not authenticated
    const token = localStorage.getItem('token');
    return !token;
  });

  useEffect(() => {
    // Sync state if localStorage changes (e.g., logout from another tab)
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      const isAuth = !!(token && user);
      setIsAuthenticated(isAuth);
      if (!isAuth) {
        setShowPublicDashboard(true);
      } else {
        try {
          const userData = JSON.parse(user || '{}');
          setUserRole(userData.role || '');
        } catch {
          // Invalid user data
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogin = (role: string) => {
    setUserRole(role);
    setIsAuthenticated(true);
    setShowPublicDashboard(false);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole('');
    setShowPublicDashboard(true);
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setShowPublicDashboard(false);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowPublicDashboard(false);
  };

  const handleNavigateToLogin = () => {
    setShowPublicDashboard(false);
    setShowForgotPassword(false);
  };

  const handleBackToPublic = () => {
    setShowPublicDashboard(true);
    setShowForgotPassword(false);
  };

  return (
    <AppProvider>
      <Toaster 
        position="top-center" 
        theme="dark"
        toastOptions={{
          style: {
            background: '#1e293b',
            border: '1px solid #334155',
            color: '#e2e8f0',
          },
        }}
      />
      {!isAuthenticated ? (
        showPublicDashboard ? (
          <PublicDashboard onNavigateToLogin={handleNavigateToLogin} />
        ) : showForgotPassword ? (
          <ForgotPassword onBackToLogin={handleBackToLogin} />
        ) : (
          <Login 
            onLogin={handleLogin} 
            onForgotPassword={handleForgotPassword}
            onBackToPublic={handleBackToPublic}
          />
        )
      ) : (
        <MainLayout userRole={userRole} onLogout={handleLogout} />
      )}
    </AppProvider>
  );
}