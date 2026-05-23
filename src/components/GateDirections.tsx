import { X, Navigation, MapPin, Clock, AlertCircle, Phone, Info } from 'lucide-react';

interface GateDirectionsProps {
  onClose: () => void;
  gateNumber: number;
  containerLocation?: string;
}

export default function GateDirections({ onClose, gateNumber, containerLocation }: GateDirectionsProps) {
  const gateInfo = {
    1: { location: 'North Terminal Entrance', coordinates: '22.3475°N, 91.8123°E', distance: '1.2 km' },
    2: { location: 'South Terminal Entrance', coordinates: '22.3412°N, 91.8095°E', distance: '1.8 km' },
    3: { location: 'East Gate (Container Yard)', coordinates: '22.3521°N, 91.8201°E', distance: '2.1 km' },
    4: { location: 'West Gate (Logistics)', coordinates: '22.3398°N, 91.8067°E', distance: '2.5 km' },
  };

  const gate = gateInfo[gateNumber as keyof typeof gateInfo] || gateInfo[3];

  const directions = [
    { step: 1, instruction: 'Enter Chittagong Port Authority main access road from Patenga Highway', distance: '0 km' },
    { step: 2, instruction: 'Continue straight for 800m past the administrative building', distance: '0.8 km' },
    { step: 3, instruction: 'Turn right at the Container Terminal signage', distance: '1.4 km' },
    { step: 4, instruction: `Proceed to Gate ${gateNumber} checkpoint`, distance: gate.distance },
    { step: 5, instruction: 'Present your booking ID and truck registration at the security checkpoint', distance: gate.distance },
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-emerald-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Navigation className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl text-white">Gate {gateNumber} Directions</h2>
              <p className="text-emerald-100 text-sm">{gate.location}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {/* Gate Info Card */}
          <div className="bg-gradient-to-br from-slate-800/80 to-slate-900/80 border border-slate-700 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span className="text-slate-400 text-sm">Location</span>
                </div>
                <p className="text-slate-200">{gate.location}</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="w-4 h-4 text-blue-400" />
                  <span className="text-slate-400 text-sm">Distance</span>
                </div>
                <p className="text-slate-200">{gate.distance} from current location</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-purple-400" />
                  <span className="text-slate-400 text-sm">Est. Time</span>
                </div>
                <p className="text-slate-200">~8 minutes</p>
              </div>
            </div>

            {containerLocation && (
              <div className="mt-4 pt-4 border-t border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-yellow-400" />
                  <span className="text-slate-400 text-sm">Container Location After Entry</span>
                </div>
                <p className="text-yellow-400 font-medium">{containerLocation}</p>
              </div>
            )}
          </div>

          {/* Directions List */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 mb-6">
            <h3 className="text-lg mb-4 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-emerald-400" />
              Turn-by-Turn Directions
            </h3>
            <div className="space-y-4">
              {directions.map((dir) => (
                <div key={dir.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-emerald-500/20 border border-emerald-500/50 rounded-full flex items-center justify-center">
                    <span className="text-emerald-400 text-sm font-medium">{dir.step}</span>
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-slate-200 mb-1">{dir.instruction}</p>
                    <p className="text-slate-500 text-xs">{dir.distance} total</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Important Notes */}
          <div className="bg-orange-500/10 border border-orange-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-orange-400 font-medium mb-2">Important Notes</h4>
                <ul className="space-y-1 text-sm text-slate-300">
                  <li>• Have your booking ID ready (TCLU3456789)</li>
                  <li>• Present truck registration documents at checkpoint</li>
                  <li>• Follow speed limit (20 km/h inside port premises)</li>
                  <li>• Stay in designated truck lanes</li>
                  <li>• Wear safety vest and helmet in container yard areas</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-slate-400 text-sm">Gate Control Room</p>
                <p className="text-slate-200">+880-31-2510-{500 + gateNumber}</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
            <button
              onClick={() => {
                window.open(`https://www.google.com/maps/dir/?api=1&destination=${gate.coordinates}`, '_blank');
              }}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Navigation className="w-5 h-5" />
              Open in Google Maps
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-slate-700 hover:bg-slate-600 text-slate-200 rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
