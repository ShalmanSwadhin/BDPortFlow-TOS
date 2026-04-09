import { useState } from 'react';
import { 
  Ship, Anchor, Container, Truck, TrendingUp, Users, Globe, 
  Shield, Clock, Award, CheckCircle, ArrowRight, Menu, X,
  MapPin, Phone, Mail, Zap, Database, BarChart3, Lock,
  Package, Thermometer, DollarSign, FileText, Grid3x3, Train
} from 'lucide-react';

interface PublicDashboardProps {
  onNavigateToLogin: () => void;
}

export default function PublicDashboard({ onNavigateToLogin }: PublicDashboardProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const stats = [
    { label: 'Annual Cargo', value: '92M', unit: 'Tons', icon: Package, color: '#00ff88' },
    { label: 'Vessels/Year', value: '3,200+', unit: '', icon: Ship, color: '#00d4ff' },
    { label: 'Container TEUs', value: '3.1M', unit: '/Year', icon: Container, color: '#ffd700' },
    { label: 'Efficiency', value: '98.5%', unit: '', icon: TrendingUp, color: '#ff6b35' },
  ];

  const features = [
    {
      icon: Ship,
      title: 'Vessel Management',
      description: 'Real-time vessel tracking, berth allocation, and scheduling optimization.',
      color: '#00d4ff'
    },
    {
      icon: Container,
      title: 'Container Operations',
      description: 'Automated stacking, retrieval, and inventory management systems.',
      color: '#00ff88'
    },
    {
      icon: Thermometer,
      title: 'Reefer Monitoring',
      description: '24/7 temperature monitoring for refrigerated containers with alerts.',
      color: '#a855f7'
    },
    {
      icon: Truck,
      title: 'Gate & Logistics',
      description: 'Smart gate operations with truck appointments and queue management.',
      color: '#ffd700'
    },
    {
      icon: Grid3x3,
      title: 'Yard Density',
      description: 'Heat-mapped yard visualization for optimal space utilization.',
      color: '#ef4444'
    },
    {
      icon: Train,
      title: 'Rail Coordination',
      description: 'Integrated rail logistics for seamless multimodal transport.',
      color: '#ec4899'
    },
    {
      icon: DollarSign,
      title: 'Billing & Tariff',
      description: 'Automated billing, invoicing, and financial reporting systems.',
      color: '#8b5cf6'
    },
    {
      icon: Shield,
      title: 'Customs Integration',
      description: 'Direct customs clearance and compliance management.',
      color: '#f59e0b'
    },
  ];

  const benefits = [
    { text: 'Reduce vessel turnaround time by 40%', icon: Clock },
    { text: 'Increase yard capacity utilization by 35%', icon: TrendingUp },
    { text: 'Real-time visibility across all operations', icon: BarChart3 },
    { text: 'Automated compliance and reporting', icon: FileText },
    { text: 'Enhanced security and access control', icon: Lock },
    { text: 'Scalable cloud-based infrastructure', icon: Database },
  ];

  const modules = [
    { name: 'Admin Panel', users: 'System Administrators', icon: Shield },
    { name: 'Berth Planning', users: 'Port Planners', icon: Anchor },
    { name: 'Yard Management', users: 'Yard Operators', icon: Grid3x3 },
    { name: 'Gate Operations', users: 'Gate Controllers', icon: Truck },
    { name: 'Crane Operations', users: 'Crane Operators', icon: Package },
    { name: 'Mobile Dashboard', users: 'Field Staff', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="relative">
                <Ship className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-400" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl lg:text-2xl text-emerald-400">BDPortFlow</h1>
                <p className="text-[10px] sm:text-xs text-slate-400">Chittagong Port TOS</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-slate-300 hover:text-emerald-400 transition-colors">Features</a>
              <a href="#about" className="text-slate-300 hover:text-emerald-400 transition-colors">About</a>
              <a href="#contact" className="text-slate-300 hover:text-emerald-400 transition-colors">Contact</a>
              <button
                onClick={onNavigateToLogin}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                Sign In
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-400 hover:text-emerald-400 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-slate-800">
              <div className="flex flex-col gap-4">
                <a href="#features" className="text-slate-300 hover:text-emerald-400 transition-colors px-4 py-2">Features</a>
                <a href="#about" className="text-slate-300 hover:text-emerald-400 transition-colors px-4 py-2">About</a>
                <a href="#contact" className="text-slate-300 hover:text-emerald-400 transition-colors px-4 py-2">Contact</a>
                <button
                  onClick={onNavigateToLogin}
                  className="mx-4 px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/5 to-transparent"></div>
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>

        <div className="max-w-7xl mx-auto relative">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full mb-6">
              <Zap className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-emerald-400">Next-Generation Terminal Operating System</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl mb-6 bg-gradient-to-r from-emerald-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Welcome to BDPortFlow
            </h1>
            <p className="text-lg sm:text-xl lg:text-2xl text-slate-300 max-w-4xl mx-auto mb-8">
              Revolutionizing <span className="text-emerald-400">Chittagong Port</span> operations with cutting-edge technology, 
              real-time analytics, and seamless logistics management.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                onClick={onNavigateToLogin}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all transform hover:scale-105 flex items-center gap-2 text-lg shadow-lg shadow-emerald-500/30"
              >
                Get Started
                <ArrowRight className="w-5 h-5" />
              </button>
              <a
                href="#features"
                className="px-8 py-4 bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-200 rounded-xl transition-all flex items-center gap-2 text-lg"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 sm:p-6 hover:border-emerald-500/50 transition-all group"
              >
                <stat.icon className="w-8 h-8 sm:w-10 sm:h-10 mb-3 group-hover:scale-110 transition-transform" style={{ color: stat.color }} />
                <div className="text-2xl sm:text-3xl lg:text-4xl mb-1" style={{ color: stat.color }}>
                  {stat.value}
                  {stat.unit && <span className="text-lg sm:text-xl text-slate-400 ml-1">{stat.unit}</span>}
                </div>
                <div className="text-sm sm:text-base text-slate-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-4">Comprehensive Features</h2>
            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto">
              Complete digital transformation of port operations with integrated modules for every aspect of terminal management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-opacity-100 transition-all group hover:transform hover:scale-105"
                style={{ borderColor: `${feature.color}00`, ['--hover-border' as any]: feature.color }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = feature.color}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = '#1e293b'}
              >
                <div className="p-3 rounded-lg inline-flex mb-4" style={{ backgroundColor: `${feature.color}20` }}>
                  <feature.icon className="w-6 h-6" style={{ color: feature.color }} />
                </div>
                <h3 className="text-lg mb-2 text-slate-100">{feature.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-6">About Chittagong Port</h2>
              <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                Chittagong Port is Bangladesh's principal seaport, handling over 92% of the country's export-import trade. 
                As the largest port in the Bay of Bengal region, it serves as a critical gateway for international commerce.
              </p>
              <p className="text-lg text-slate-300 mb-8 leading-relaxed">
                BDPortFlow modernizes every aspect of port operations - from vessel scheduling and cargo handling to 
                customs clearance and billing - creating a unified, intelligent system that drives efficiency and growth.
              </p>

              <div className="space-y-4 mb-8">
                {benefits.map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    </div>
                    <span className="text-slate-300">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={onNavigateToLogin}
                className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all flex items-center gap-2 shadow-lg shadow-blue-500/30"
              >
                Access Dashboard
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6">
              <div className="bg-gradient-to-br from-emerald-500/10 to-blue-500/10 border border-emerald-500/30 rounded-xl p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Globe className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-400" />
                  <div>
                    <h3 className="text-xl sm:text-2xl text-emerald-400">Global Standards</h3>
                    <p className="text-sm text-slate-400">ISO Certified Operations</p>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Compliant with international maritime standards and best practices, ensuring seamless global trade operations.
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-xl p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Award className="w-10 h-10 sm:w-12 sm:h-12 text-blue-400" />
                  <div>
                    <h3 className="text-xl sm:text-2xl text-blue-400">Award Winning</h3>
                    <p className="text-sm text-slate-400">Excellence in Innovation</p>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Recognized for technological advancement and operational excellence in port management systems.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-500/10 to-orange-500/10 border border-purple-500/30 rounded-xl p-6 sm:p-8">
                <div className="flex items-center gap-4 mb-6">
                  <Users className="w-10 h-10 sm:w-12 sm:h-12 text-purple-400" />
                  <div>
                    <h3 className="text-xl sm:text-2xl text-purple-400">24/7 Support</h3>
                    <p className="text-sm text-slate-400">Always Available</p>
                  </div>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Round-the-clock technical support and monitoring to ensure continuous, uninterrupted operations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Modules */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-4">Role-Based Access</h2>
            <p className="text-lg sm:text-xl text-slate-400 max-w-3xl mx-auto">
              Tailored dashboards and tools for every role in your organization
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {modules.map((module, idx) => (
              <div
                key={idx}
                className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6 hover:border-emerald-500/50 transition-all group"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-emerald-500/20 rounded-lg group-hover:bg-emerald-500/30 transition-colors">
                    <module.icon className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h3 className="text-lg text-slate-100">{module.name}</h3>
                    <p className="text-sm text-slate-400">{module.users}</p>
                  </div>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-emerald-500/30 rounded-2xl p-8 sm:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl mb-4">Get in Touch</h2>
              <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto">
                Have questions? Our team is here to help you transform your port operations
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="inline-flex p-4 bg-emerald-500/20 rounded-xl mb-4">
                  <MapPin className="w-8 h-8 text-emerald-400" />
                </div>
                <h3 className="text-lg mb-2">Location</h3>
                <p className="text-slate-400">Chittagong Port Authority</p>
                <p className="text-slate-400">Chittagong, Bangladesh</p>
              </div>

              <div className="text-center">
                <div className="inline-flex p-4 bg-blue-500/20 rounded-xl mb-4">
                  <Phone className="w-8 h-8 text-blue-400" />
                </div>
                <h3 className="text-lg mb-2">Phone</h3>
                <p className="text-slate-400">+880-31-2522001</p>
                <p className="text-slate-400">24/7 Support</p>
              </div>

              <div className="text-center">
                <div className="inline-flex p-4 bg-purple-500/20 rounded-xl mb-4">
                  <Mail className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="text-lg mb-2">Email</h3>
                <p className="text-slate-400">info@bdportflow.com</p>
                <p className="text-slate-400">support@bdportflow.com</p>
              </div>
            </div>

            <div className="text-center mt-12">
              <button
                onClick={onNavigateToLogin}
                className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl transition-all transform hover:scale-105 inline-flex items-center gap-2 text-lg shadow-lg shadow-emerald-500/30"
              >
                Request Demo Access
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <Ship className="w-8 h-8 text-emerald-400" />
                <div>
                  <h3 className="text-xl text-emerald-400">BDPortFlow</h3>
                  <p className="text-xs text-slate-400">Chittagong Port TOS</p>
                </div>
              </div>
              <p className="text-slate-400 max-w-md leading-relaxed">
                Transforming port operations through intelligent automation, real-time analytics, 
                and seamless integration of all terminal activities.
              </p>
            </div>

            <div>
              <h4 className="text-slate-200 mb-4">Quick Links</h4>
              <div className="space-y-2">
                <a href="#features" className="block text-slate-400 hover:text-emerald-400 transition-colors">Features</a>
                <a href="#about" className="block text-slate-400 hover:text-emerald-400 transition-colors">About</a>
                <a href="#contact" className="block text-slate-400 hover:text-emerald-400 transition-colors">Contact</a>
                <button onClick={onNavigateToLogin} className="block text-slate-400 hover:text-emerald-400 transition-colors">Sign In</button>
              </div>
            </div>

            <div>
              <h4 className="text-slate-200 mb-4">Legal</h4>
              <div className="space-y-2">
                <a href="#" className="block text-slate-400 hover:text-emerald-400 transition-colors">Privacy Policy</a>
                <a href="#" className="block text-slate-400 hover:text-emerald-400 transition-colors">Terms of Service</a>
                <a href="#" className="block text-slate-400 hover:text-emerald-400 transition-colors">Security</a>
                <a href="#" className="block text-slate-400 hover:text-emerald-400 transition-colors">Documentation</a>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-slate-400 text-sm">
              © 2025 BDPortFlow. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Secure & Compliant</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
