import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import PublicDashboard from './components/PublicDashboard';
import MainLayout from './components/MainLayout';
import { Toaster } from "sonner";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string>('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPublicDashboard, setShowPublicDashboard] = useState(true);

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