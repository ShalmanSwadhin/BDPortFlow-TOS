import { X, Phone, Mail, Clock, AlertCircle, Truck, DoorOpen, Package, Shield } from 'lucide-react';

interface SupportContactProps {
  onClose: () => void;
}

export default function SupportContact({ onClose }: SupportContactProps) {
  const supportContacts = [
    {
      title: 'Emergency Hotline',
      icon: AlertCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      borderColor: 'border-red-500/50',
      phone: '+880-31-2510-911',
      description: '24/7 Emergency Support',
      hours: 'Available 24/7'
    },
    {
      title: 'Gate Operations',
      icon: DoorOpen,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/20',
      borderColor: 'border-emerald-500/50',
      phone: '+880-31-2510-100',
      email: 'gate@chittagongport.gov.bd',
      description: 'Gate entry/exit assistance',
      hours: '6:00 AM - 10:00 PM'
    },
    {
      title: 'Truck Scheduling',
      icon: Truck,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      borderColor: 'border-blue-500/50',
      phone: '+880-31-2510-200',
      email: 'scheduling@chittagongport.gov.bd',
      description: 'Appointment booking & changes',
      hours: '8:00 AM - 8:00 PM'
    },
    {
      title: 'Container Services',
      icon: Package,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      borderColor: 'border-purple-500/50',
      phone: '+880-31-2510-300',
      email: 'containers@chittagongport.gov.bd',
      description: 'Container tracking & status',
      hours: '8:00 AM - 6:00 PM'
    },
    {
      title: 'Customs & Documentation',
      icon: Shield,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-500/20',
      borderColor: 'border-yellow-500/50',
      phone: '+880-31-2510-400',
      email: 'customs@chittagongport.gov.bd',
      description: 'Clearance & paperwork help',
      hours: '9:00 AM - 5:00 PM'
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-b border-slate-700 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl">Contact Support</h2>
            <p className="text-slate-400 text-sm mt-1">Chittagong Port Authority - Support Services</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {supportContacts.map((contact, idx) => {
              const Icon = contact.icon;
              return (
                <div
                  key={idx}
                  className={`bg-slate-800/50 border ${contact.borderColor} rounded-xl p-5 hover:bg-slate-800/70 transition-all`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`${contact.bgColor} ${contact.borderColor} border rounded-lg p-3 flex-shrink-0`}>
                      <Icon className={`w-6 h-6 ${contact.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg text-slate-100 mb-1">{contact.title}</h3>
                      <p className="text-slate-400 text-sm mb-3">{contact.description}</p>
                      
                      <div className="space-y-2">
                        {/* Phone */}
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          <a
                            href={`tel:${contact.phone}`}
                            className={`${contact.color} hover:underline text-sm sm:text-base`}
                          >
                            {contact.phone}
                          </a>
                        </div>
                        
                        {/* Email */}
                        {contact.email && (
                          <div className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-slate-500 flex-shrink-0" />
                            <a
                              href={`mailto:${contact.email}`}
                              className="text-slate-300 hover:text-slate-100 hover:underline text-sm break-all"
                            >
                              {contact.email}
                            </a>
                          </div>
                        )}
                        
                        {/* Hours */}
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-500 flex-shrink-0" />
                          <span className="text-slate-400 text-sm">{contact.hours}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Info */}
          <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-blue-400 font-medium mb-1">Important Notice</p>
                <p className="text-xs text-slate-400">
                  For urgent gate-related issues during your visit, please use the emergency hotline. 
                  For non-urgent inquiries, contact the relevant department during business hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
