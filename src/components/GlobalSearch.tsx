import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, Package, Truck, Ship } from 'lucide-react';

interface GlobalSearchProps {
  onClose: () => void;
}

export default function GlobalSearch({ onClose }: GlobalSearchProps) {
  const { containers, vessels, bookings } = useApp();
  const [query, setQuery] = useState('');

  const results = {
    containers: containers.filter(c =>
      c.id.toLowerCase().includes(query.toLowerCase()) ||
      c.location.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 5),
    vessels: vessels.filter(v =>
      v.name.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3),
    bookings: bookings.filter(b =>
      b.truck.toLowerCase().includes(query.toLowerCase()) ||
      b.container.toLowerCase().includes(query.toLowerCase())
    ).slice(0, 3),
  };

  const hasResults = results.containers.length > 0 || results.vessels.length > 0 || results.bookings.length > 0;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" onClick={onClose}></div>
      <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] sm:w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-50">
        <div className="p-4 border-b border-slate-800">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search containers, vessels, bookings..."
              autoFocus
              className="w-full pl-10 pr-10 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
            />
            <button
              onClick={onClose}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-700 rounded transition-colors"
            >
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto p-3 sm:p-4">
          {!query ? (
            <div className="text-center py-8 text-slate-500">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">Start typing to search...</p>
            </div>
          ) : !hasResults ? (
            <div className="text-center py-8 text-slate-500">
              <p className="text-sm">No results found for "{query}"</p>
            </div>
          ) : (
            <div className="space-y-4">
              {results.containers.length > 0 && (
                <div>
                  <h3 className="text-sm text-slate-400 mb-2">Containers</h3>
                  <div className="space-y-2">
                    {results.containers.map((container) => (
                      <div
                        key={container.id}
                        className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Package className="w-4 h-4 text-emerald-400" />
                          <div className="flex-1">
                            <div className="text-slate-200">{container.id}</div>
                            <div className="text-xs text-slate-500">{container.location} • {container.type}</div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            container.status === 'ready' ? 'bg-emerald-500/20 text-emerald-400' :
                            container.status === 'processing' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-orange-500/20 text-orange-400'
                          }`}>
                            {container.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.vessels.length > 0 && (
                <div>
                  <h3 className="text-sm text-slate-400 mb-2">Vessels</h3>
                  <div className="space-y-2">
                    {results.vessels.map((vessel) => (
                      <div
                        key={vessel.id}
                        className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Ship className="w-4 h-4 text-blue-400" />
                          <div className="flex-1">
                            <div className="text-slate-200">{vessel.name}</div>
                            <div className="text-xs text-slate-500">Berth {vessel.berth || 'TBD'} • {vessel.containers} containers</div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            vessel.status === 'loading' ? 'bg-blue-500/20 text-blue-400' :
                            vessel.status === 'unloading' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {vessel.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {results.bookings.length > 0 && (
                <div>
                  <h3 className="text-sm text-slate-400 mb-2">Bookings</h3>
                  <div className="space-y-2">
                    {results.bookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="p-3 bg-slate-800/50 hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Truck className="w-4 h-4 text-yellow-400" />
                          <div className="flex-1">
                            <div className="text-slate-200">{booking.truck}</div>
                            <div className="text-xs text-slate-500">{booking.container} • {booking.slot}</div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded ${
                            booking.status === 'confirmed' ? 'bg-emerald-500/20 text-emerald-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
