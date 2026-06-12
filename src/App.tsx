import { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import PublicDashboard from './components/PublicDashboard';
import MainLayout from './components/MainLayout';
import { Toaster } from "sonner";

function AppContent() {
  const { isAuthenticated, user, logout: contextLogout } = useApp();
  const [userRole, setUserRole] = useState<string>('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPublicDashboard, setShowPublicDashboard] = useState(true);

  useEffect(() => {
    if (isAuthenticated && user?.role) {
      setUserRole(user.role);
      setShowPublicDashboard(false);
    }
  }, [isAuthenticated, user]);

  const handleLogin = (role: string) => {
    setUserRole(role);
    setShowPublicDashboard(false);
  };

  const handleLogout = () => {
    contextLogout();
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

  if (isAuthenticated && userRole) {
    return <MainLayout userRole={userRole} onLogout={handleLogout} />;
  }

  if (showPublicDashboard) {
    return <PublicDashboard onNavigateToLogin={handleNavigateToLogin} />;
  }

  if (showForgotPassword) {
    return <ForgotPassword onBackToLogin={handleBackToLogin} />;
  }

  return (
    <Login
      onLogin={handleLogin}
      onForgotPassword={handleForgotPassword}
      onBackToPublic={handleBackToPublic}
    />
  );
}

export default function App() {
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
      <AppContent />
    </AppProvider>
  );
}
