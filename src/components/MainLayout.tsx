import { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import AdminPanel from './AdminPanel';
import BerthPlanner from './BerthPlanner';
import ReeferMonitoring from './ReeferMonitoring';
import ContainerStacking from './ContainerStacking';
import ShipStowage from './ShipStowage';
import GateOperations from './GateOperations';
import TruckAppointment from './TruckAppointment';
import YardDensity from './YardDensity';
import RailCoordination from './RailCoordination';
import BillingTariff from './BillingTariff';
import CustomClearance from './CustomClearance';
import NotificationPanel from './NotificationPanel';
import GlobalSearch from './GlobalSearch';
import KeyboardShortcuts from './KeyboardShortcuts';
import SupportContact from './SupportContact';
import ProfilePage from './ProfilePage';
// New mobile components
import MobileHome from './mobile/MobileHome';
import MobileTasks from './mobile/MobileTasks';
import MobileAlerts from './mobile/MobileAlerts';
import MobileProfile from './mobile/MobileProfile';
import MobileBottomNav from './mobile/MobileBottomNav';
import { Menu, Bell, User, LogOut, Search, Keyboard, Ship, ArrowLeft } from 'lucide-react';

interface MainLayoutProps {
  userRole: string;
  onLogout: () => void;
}

export default function MainLayout({ userRole, onLogout }: MainLayoutProps) {
  const { notifications, logout: contextLogout, user } = useApp();
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileTab, setMobileTab] = useState<'home' | 'tasks' | 'alerts' | 'profile'>('home');
  const [mobileTaskFilter, setMobileTaskFilter] = useState<'all' | 'pending' | 'active' | 'completed'>('all');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showSupport, setShowSupport] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [mobileShowDesktopScreen, setMobileShowDesktopScreen] = useState(false);
  const [adminSection, setAdminSection] = useState<'users' | 'settings' | 'reports'>('users');
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const handleLogout = () => {
    contextLogout();
    onLogout();
  };

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      const isMobileScreen = window.innerWidth < 768;
      setIsMobile(isMobileScreen);
      if (!isMobileScreen) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Keyboard shortcuts (desktop only)
  useEffect(() => {
    if (isMobile) return;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setShowSearch(true);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
      }
      if (e.key === '?') {
        e.preventDefault();
        setShowShortcuts(true);
      }
      if (e.key === 'Escape') {
        setShowSearch(false);
        setShowNotifications(false);
        setShowShortcuts(false);
        setShowSupport(false);
        setShowProfile(false);
      }
      // Module shortcuts
      if (e.altKey && e.key >= '1' && e.key <= '9') {
        e.preventDefault();
        const shortcuts: { [key: string]: string } = {
          '1': 'dashboard',
          '2': 'yard',
          '3': 'berth',
          '4': 'stacking',
          '5': 'stowage',
          '6': 'gate',
          '7': 'truck',
          '8': 'rail',
          '9': 'billing',
        };
        const screen = shortcuts[e.key];
        if (screen) setCurrentScreen(screen);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isMobile]);

  const renderDesktopScreen = () => {
    switch (currentScreen) {
      case 'dashboard':
        return <Dashboard userRole={userRole} onNavigate={(screen) => {
          if (screen === 'book-slot') {
            setCurrentScreen('truck');
          } else if (screen === 'track-container') {
            setCurrentScreen('yard');
          } else if (screen === 'contact-support') {
            setShowSupport(true);
          }
        }} />;
      case 'admin':
        // Map 'reports' to 'audit' since there's no separate reports tab
        const mappedSection = adminSection === 'reports' ? 'audit' : adminSection;
        return <AdminPanel initialTab={mappedSection as 'users' | 'settings' | 'audit'} />;
      case 'berth':
        return <BerthPlanner />;
      case 'reefer':
        return <ReeferMonitoring />;
      case 'stacking':
        return <ContainerStacking />;
      case 'stowage':
        return <ShipStowage />;
      case 'gate':
        return <GateOperations />;
      case 'truck':
        return <TruckAppointment />;
      case 'yard':
        return <YardDensity />;
      case 'rail':
        return <RailCoordination />;
      case 'billing':
        return <BillingTariff />;
      case 'customs':
        return <CustomClearance />;
      case 'clients':
        // Simple clients list view
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl sm:text-3xl mb-2">Client Management</h2>
              <p className="text-slate-400 text-sm sm:text-base">Active shipping line clients</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: 'Maersk Line', containers: 1247, revenue: '$2.4M', status: 'active' },
                { name: 'MSC Mediterranean', containers: 1089, revenue: '$2.1M', status: 'active' },
                { name: 'COSCO Shipping', containers: 956, revenue: '$1.9M', status: 'active' },
                { name: 'CMA CGM', containers: 834, revenue: '$1.6M', status: 'active' },
                { name: 'Hapag-Lloyd', containers: 723, revenue: '$1.4M', status: 'active' },
                { name: 'ONE Line', containers: 612, revenue: '$1.2M', status: 'active' },
                { name: 'Evergreen Marine', containers: 589, revenue: '$1.1M', status: 'active' },
                { name: 'Yang Ming Marine', containers: 467, revenue: '$890K', status: 'active' },
                { name: 'OOCL', containers: 345, revenue: '$680K', status: 'active' },
              ].map((client, idx) => (
                <div key={idx} className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg text-slate-100">{client.name}</h3>
                    <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 rounded text-xs">
                      {client.status}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Containers:</span>
                      <span className="text-slate-300">{client.containers}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-400">Total Revenue:</span>
                      <span className="text-emerald-400 font-medium">{client.revenue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      default:
        return <Dashboard userRole={userRole} onNavigate={(screen) => {
          if (screen === 'book-slot') {
            setCurrentScreen('truck');
          } else if (screen === 'track-container') {
            setCurrentScreen('yard');
          } else if (screen === 'contact-support') {
            setShowSupport(true);
          }
        }} />;
    }
  };

  const renderMobileTab = () => {
    switch (mobileTab) {
      case 'home':
        return (
          <MobileHome
            userRole={userRole}
            onNavigateToTasks={(filter) => {
              setMobileTab('tasks');
              if (filter) {
                setMobileTaskFilter(filter);
              }
            }}
            onNavigateToAlerts={() => setMobileTab('alerts')}
            onNavigateToAdmin={(section) => {
              setCurrentScreen('admin');
              if (section) {
                setAdminSection(section);
              }
              setMobileShowDesktopScreen(true);
            }}
            onNavigateToBilling={() => {
              setCurrentScreen('billing');
              setMobileShowDesktopScreen(true);
            }}
            onNavigateToClients={() => {
              setCurrentScreen('clients');
              setMobileShowDesktopScreen(true);
            }}
            onNavigateToBerth={() => {
              setCurrentScreen('berth');
              setMobileShowDesktopScreen(true);
            }}
            onNavigateToYard={() => {
              setCurrentScreen('yard');
              setMobileShowDesktopScreen(true);
            }}
            onNavigateToGate={() => {
              setCurrentScreen('gate');
              setMobileShowDesktopScreen(true);
            }}
            onNavigateToTruck={() => {
              setCurrentScreen('truck');
              setMobileShowDesktopScreen(true);
            }}
            onNavigateToReefer={() => {
              setCurrentScreen('reefer');
              setMobileShowDesktopScreen(true);
            }}
            onNavigateToCustoms={() => {
              setCurrentScreen('customs');
              setMobileShowDesktopScreen(true);
            }}
          />
        );
      case 'tasks':
        return <MobileTasks userRole={userRole} filter={mobileTaskFilter} onFilterChange={setMobileTaskFilter} />;
      case 'alerts':
        return <MobileAlerts />;
      case 'profile':
        return <MobileProfile userRole={userRole} onLogout={handleLogout} />;
      default:
        return <MobileHome userRole={userRole} />;
    }
  };

  const getRoleName = (role: string) => {
    const roleMap: { [key: string]: string } = {
      admin: 'Administrator',
      operator: 'Port Operator',
      berth: 'Berth Planner',
      driver: 'Truck Driver',
      customs: 'Customs Officer',
      finance: 'Finance Manager',
    };
    return roleMap[role] || 'User';
  };

  // MOBILE VIEW (393×852)
  if (isMobile) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        {/* Mobile Header */}
        <header className="h-14 bg-slate-900/95 backdrop-blur-xl border-b border-slate-800 fixed top-0 left-0 right-0 z-40">
          <div className="h-full px-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              {mobileShowDesktopScreen && (
                <button
                  onClick={() => setMobileShowDesktopScreen(false)}
                  className="p-1.5 hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 text-slate-400" />
                </button>
              )}
              <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Ship className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-sm bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  BDPortFlow
                </h1>
              </div>
            </div>
            <button
              onClick={() => setIsMobile(false)}
              className="px-3 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-lg text-xs"
            >
              Desktop
            </button>
          </div>
        </header>

        {/* Mobile Content */}
        <main className="pt-14 bg-slate-950 min-h-screen">
          {mobileShowDesktopScreen ? (
            <div className="p-4">
              {renderDesktopScreen()}
            </div>
          ) : (
            renderMobileTab()
          )}
        </main>

        {/* Bottom Navigation - hide when showing desktop screen */}
        {!mobileShowDesktopScreen && (
          <MobileBottomNav 
            activeTab={mobileTab}
            onTabChange={(tab) => {
              setMobileTab(tab);
              // Reset task filter when navigating away from tasks
              if (tab !== 'tasks') {
                setMobileTaskFilter('all');
              }
            }}
            unreadAlerts={unreadCount}
          />
        )}
      </div>
    );
  }

  // DESKTOP VIEW (unchanged)
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Desktop Header */}
      <header className="h-16 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800 fixed top-0 left-0 right-0 z-50">
        <div className="h-full px-3 sm:px-4 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              title="Toggle Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <Ship className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-base sm:text-lg bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                  BDPortFlow
                </h1>
                <p className="text-xs text-slate-500">Chittagong Port TOS</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Search */}
            <button
              onClick={() => setShowSearch(true)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors hidden md:block"
              title="Search (Ctrl+K)"
            >
              <Search className="w-5 h-5 text-slate-400" />
            </button>

            {/* Keyboard Shortcuts */}
            <button
              onClick={() => setShowShortcuts(true)}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors hidden md:block"
              title="Keyboard Shortcuts (?)"
            >
              <Keyboard className="w-5 h-5 text-slate-400" />
            </button>

            {/* Mobile Toggle */}
            <button
              onClick={() => setIsMobile(true)}
              className="px-2 sm:px-4 py-1.5 sm:py-2 bg-slate-800 text-slate-400 hover:bg-slate-700 rounded-lg text-xs sm:text-sm transition-all"
              title="Switch to Mobile View"
            >
              <span className="hidden sm:inline">📱 Mobile</span>
              <span className="sm:hidden">📱</span>
            </button>

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-5 h-5 text-slate-400" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
            </div>

            {/* User Menu */}
            <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-slate-800">
              <button
                onClick={() => setShowProfile(true)}
                className="hidden sm:block text-right hover:bg-slate-800 rounded-lg px-3 py-2 transition-colors"
                title="View Profile"
              >
                <div className="text-sm text-slate-300">{getRoleName(userRole)}</div>
                <div className="text-xs text-slate-500">Active Now</div>
              </button>
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex pt-16">
        {/* Sidebar */}
        <Sidebar
          currentScreen={currentScreen}
          onNavigate={(screen) => {
            setCurrentScreen(screen);
          }}
          userRole={userRole}
          isOpen={sidebarOpen}
          isMobile={false}
        />

        {/* Main Content */}
        <main
          className={`flex-1 transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-0'
          }`}
        >
          <div className="p-4 lg:p-6">{renderDesktopScreen()}</div>
        </main>
      </div>

      {/* Global Search */}
      {showSearch && <GlobalSearch onClose={() => setShowSearch(false)} />}

      {/* Notifications Panel */}
      {showNotifications && <NotificationPanel onClose={() => setShowNotifications(false)} />}

      {/* Keyboard Shortcuts */}
      {showShortcuts && <KeyboardShortcuts onClose={() => setShowShortcuts(false)} />}

      {/* Support Contact */}
      {showSupport && <SupportContact onClose={() => setShowSupport(false)} />}

      {/* Profile Page */}
      {showProfile && <ProfilePage userRole={userRole} onClose={() => setShowProfile(false)} />}
    </div>
  );
}