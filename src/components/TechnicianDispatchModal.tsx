import { X, Phone, MapPin, Wrench, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface TechnicianDispatchModalProps {
  container: any;
  onClose: () => void;
  onDispatch: (techId: number) => void;
}

export default function TechnicianDispatchModal({ container, onClose, onDispatch }: TechnicianDispatchModalProps) {
  const technicians = [
    { id: 1, name: 'Rafiq Ahmed', phone: '+880 1712-345678', location: 'Block A', status: 'available', specialty: 'Refrigeration', rating: 4.8, jobs: 245 },
    { id: 2, name: 'Kamal Hossain', phone: '+880 1812-345679', location: 'Block C', status: 'available', specialty: 'Electrical', rating: 4.9, jobs: 312 },
    { id: 3, name: 'Jamal Uddin', phone: '+880 1912-345680', location: 'Block B', status: 'busy', specialty: 'Mechanical', rating: 4.7, jobs: 198 },
    { id: 4, name: 'Tarek Rahman', phone: '+880 1612-345681', location: 'Block D', status: 'available', specialty: 'Refrigeration', rating: 4.6, jobs: 167 },
    { id: 5, name: 'Farid Khan', phone: '+880 1512-345682', location: 'Office', status: 'offline', specialty: 'Electronics', rating: 4.5, jobs: 134 },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-slate-900 border border-orange-500/50 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-lg sm:text-xl text-orange-400 mb-1">Dispatch Technician</h3>
            <p className="text-xs sm:text-sm text-slate-400 truncate">Container: {container?.id} • {container?.location}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-3">
            {technicians.map((tech) => (
              <div
                key={tech.id}
                className={`p-4 rounded-xl border-2 transition-all ${
                  tech.status === 'available'
                    ? 'border-emerald-500/50 bg-emerald-500/5 hover:bg-emerald-500/10'
                    : tech.status === 'busy'
                    ? 'border-yellow-500/50 bg-yellow-500/5'
                    : 'border-slate-700 bg-slate-800/50 opacity-50'
                }`}
              >
                <div className="flex items-start sm:items-center justify-between gap-2 flex-col sm:flex-row">
                  <div className="flex items-start gap-3 sm:gap-4 flex-1 w-full">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white flex-shrink-0 text-xs sm:text-sm">
                      {tech.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                        <h4 className="text-base sm:text-lg text-slate-100">{tech.name}</h4>
                        <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs ${
                          tech.status === 'available'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : tech.status === 'busy'
                            ? 'bg-yellow-500/20 text-yellow-400'
                            : 'bg-slate-700 text-slate-400'
                        }`}>
                          {tech.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 text-xs sm:text-sm mb-3">
                        <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400">
                          <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{tech.phone}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400">
                          <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{tech.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400">
                          <Wrench className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{tech.specialty}</span>
                        </div>
                        <div className="flex items-center gap-1.5 sm:gap-2 text-slate-400">
                          <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span className="truncate">{tech.jobs} jobs</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-400">★</span>
                          <span className="text-sm text-slate-300">{tech.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {tech.status === 'available' && (
                    <button
                      onClick={() => {
                        onDispatch(tech.id);
                        toast.success('Technician dispatched!', {
                          description: `${tech.name} is on the way to ${container?.id}`,
                        });
                        onClose();
                      }}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Clock className="w-4 h-4" />
                      Dispatch
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center justify-between text-sm text-slate-400">
            <div>
              <span className="text-emerald-400">{technicians.filter(t => t.status === 'available').length} Available</span>
              <span className="mx-2">•</span>
              <span className="text-yellow-400">{technicians.filter(t => t.status === 'busy').length} Busy</span>
              <span className="mx-2">•</span>
              <span className="text-slate-500">{technicians.filter(t => t.status === 'offline').length} Offline</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
