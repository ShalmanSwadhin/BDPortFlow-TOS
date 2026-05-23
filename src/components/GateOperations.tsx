import { useState } from 'react';
import { Camera, CheckCircle, XCircle, AlertTriangle, Truck, Weight, ScanLine } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function GateOperations() {
  const [selectedGate, setSelectedGate] = useState(1);

  const gates = [
    { id: 1, status: 'active', truck: 'DHK-GA-1234', container: 'TCLU3456789', weight: 22500, verifiedWeight: 22450, ocr: 100 },
    { id: 2, status: 'active', truck: 'CHT-BA-5678', container: 'YMMU8901234', weight: 24800, verifiedWeight: 25200, ocr: 98 },
    { id: 3, status: 'idle', truck: null, container: null, weight: 0, verifiedWeight: 0, ocr: 0 },
    { id: 4, status: 'error', truck: 'DHK-KA-9012', container: 'MAEU5678901', weight: 20200, verifiedWeight: 24500, ocr: 85 },
  ];

  const recentTransactions = [
    { id: 1, time: '14:32', truck: 'DHK-GA-1234', container: 'TCLU3456789', status: 'approved', weight: 22500 },
    { id: 2, time: '14:28', truck: 'CHT-TA-4567', container: 'CSQU2345678', status: 'approved', weight: 23100 },
    { id: 3, time: '14:25', truck: 'DHK-MA-7890', container: 'HLBU7890123', status: 'rejected', weight: 0 },
    { id: 4, time: '14:20', truck: 'CHT-BA-3456', container: 'TCKU4567890', status: 'approved', weight: 21700 },
    { id: 5, time: '14:15', truck: 'DHK-GA-6789', container: 'OOLU1234567', status: 'approved', weight: 19800 },
  ];

  const currentGate = gates.find(g => g.id === selectedGate);
  const weightMismatch = currentGate && Math.abs(currentGate.weight - currentGate.verifiedWeight) > currentGate.weight * 0.03;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl mb-2">Automated Gate Operations</h2>
          <p className="text-slate-400 text-sm sm:text-base">Real-time OCR, weight validation, and access control</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 text-sm sm:text-base">{gates.filter(g => g.status === 'active').length} Gates Active</span>
          </div>
        </div>
      </div>

      {/* Gate Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {gates.map((gate) => (
          <button
            key={gate.id}
            onClick={() => setSelectedGate(gate.id)}
            className={`p-4 rounded-xl text-left transition-all ${
              selectedGate === gate.id
                ? gate.status === 'error'
                  ? 'bg-red-500/20 border-2 border-red-500'
                  : gate.status === 'active'
                  ? 'bg-emerald-500/20 border-2 border-emerald-500'
                  : 'bg-slate-800 border-2 border-slate-600'
                : 'bg-slate-900/50 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg text-slate-200">Gate {gate.id}</span>
              <div className={`w-3 h-3 rounded-full ${
                gate.status === 'active' ? 'bg-emerald-400 animate-pulse' :
                gate.status === 'error' ? 'bg-red-400 animate-pulse' :
                'bg-slate-600'
              }`}></div>
            </div>
            <div className={`text-xs uppercase ${
              gate.status === 'active' ? 'text-emerald-400' :
              gate.status === 'error' ? 'text-red-400' :
              'text-slate-500'
            }`}>
              {gate.status}
            </div>
            {gate.truck && (
              <div className="mt-2 text-sm text-slate-400">
                {gate.truck}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Camera Feed & OCR */}
        <div className="lg:col-span-2 space-y-6">
          {/* Camera Feed */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl">Live Camera - Gate {selectedGate}</h3>
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-emerald-400" />
                <span className="text-sm text-emerald-400">Live</span>
              </div>
            </div>

            {/* Camera View */}
            <div className="relative aspect-video bg-slate-950 rounded-lg overflow-hidden">
              {currentGate?.status !== 'idle' ? (
                <>
                  {/* Simulated camera feed with truck */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-slate-700 text-8xl">
                      <Truck />
                    </div>
                  </div>

                  {/* OCR Overlays */}
                  {currentGate?.truck && (
                    <>
                      {/* License Plate Detection */}
                      <div className="absolute top-1/3 left-1/4 border-2 border-emerald-400 px-4 py-2 bg-slate-900/80 backdrop-blur">
                        <div className="text-emerald-400 text-sm mb-1">License Plate</div>
                        <div className="text-white">{currentGate.truck}</div>
                        <div className="text-xs text-emerald-400 mt-1">Confidence: {currentGate.ocr}%</div>
                      </div>

                      {/* Container ID Detection */}
                      <div className="absolute top-2/3 right-1/4 border-2 border-blue-400 px-4 py-2 bg-slate-900/80 backdrop-blur">
                        <div className="text-blue-400 text-sm mb-1">Container ID</div>
                        <div className="text-white">{currentGate.container}</div>
                        <div className="text-xs text-blue-400 mt-1">Verified</div>
                      </div>
                    </>
                  )}

                  {/* Status Indicator */}
                  <div className="absolute top-4 right-4">
                    {currentGate?.status === 'error' ? (
                      <div className="flex items-center gap-2 px-3 py-2 bg-red-500/90 rounded-lg">
                        <XCircle className="w-4 h-4 text-white" />
                        <span className="text-white text-sm">REJECTED</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/90 rounded-lg">
                        <ScanLine className="w-4 h-4 text-white" />
                        <span className="text-white text-sm">SCANNING</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                  <div className="text-center">
                    <Camera className="w-16 h-16 mx-auto mb-4 opacity-20" />
                    <p>No vehicle detected</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Verification Results */}
          {currentGate?.status !== 'idle' && (
            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl mb-4">Verification Results</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* License Plate */}
                <div className={`p-4 rounded-lg border-2 ${
                  currentGate.ocr >= 95 ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-yellow-500/10 border-yellow-500/50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">License Plate</span>
                    {currentGate.ocr >= 95 ? (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                    )}
                  </div>
                  <div className="text-lg text-slate-200 mb-1">{currentGate.truck}</div>
                  <div className={`text-sm ${currentGate.ocr >= 95 ? 'text-emerald-400' : 'text-yellow-400'}`}>
                    {currentGate.ocr}% Confidence
                  </div>
                </div>

                {/* Container ID */}
                <div className="p-4 rounded-lg border-2 bg-emerald-500/10 border-emerald-500/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Container ID</span>
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div className="text-lg text-slate-200 mb-1">{currentGate.container}</div>
                  <div className="text-sm text-emerald-400">Verified</div>
                </div>

                {/* Weight Check */}
                <div className={`p-4 rounded-lg border-2 ${
                  weightMismatch ? 'bg-red-500/10 border-red-500/50' : 'bg-emerald-500/10 border-emerald-500/50'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-400">Weight Check</span>
                    {weightMismatch ? (
                      <XCircle className="w-5 h-5 text-red-400" />
                    ) : (
                      <CheckCircle className="w-5 h-5 text-emerald-400" />
                    )}
                  </div>
                  <div className="text-lg text-slate-200 mb-1">{currentGate.weight} kg</div>
                  <div className={`text-sm ${weightMismatch ? 'text-red-400' : 'text-emerald-400'}`}>
                    {weightMismatch ? `Mismatch: ${currentGate.verifiedWeight} kg` : 'Within tolerance'}
                  </div>
                </div>
              </div>

              {/* Error Details */}
              {currentGate.status === 'error' && (
                <div className="mt-4 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                    <span className="text-red-400">Validation Failed</span>
                  </div>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {weightMismatch && (
                      <li>• Weight mismatch detected: Expected {currentGate.weight} kg, Actual {currentGate.verifiedWeight} kg</li>
                    )}
                    {currentGate.ocr < 95 && (
                      <li>• Low OCR confidence on license plate ({currentGate.ocr}%)</li>
                    )}
                  </ul>
                  <div className="mt-4 flex gap-3">
                    <button className="flex-1 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 rounded-lg transition-colors">
                      Manual Override
                    </button>
                    <button className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded-lg transition-colors">
                      Reject Entry
                    </button>
                  </div>
                </div>
              )}

              {/* Success Actions */}
              {currentGate.status === 'active' && !weightMismatch && (
                <div className="mt-4 flex gap-3">
                  <button 
                    onClick={() => {
                      toast.success('Entry approved', {
                        description: `${currentGate.truck} - ${currentGate.container} cleared for entry`,
                      });
                    }}
                    className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Approve Entry
                  </button>
                  <button 
                    onClick={() => {
                      toast.warning('Inspection required', {
                        description: `${currentGate.truck} held for manual inspection`,
                      });
                    }}
                    className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                  >
                    Hold for Inspection
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Recent Transactions */}
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl mb-4">Recent Transactions</h3>

          <div className="space-y-3">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className={`p-4 rounded-lg border transition-all hover:scale-[1.02] ${
                  transaction.status === 'approved'
                    ? 'bg-emerald-500/10 border-emerald-500/50'
                    : 'bg-red-500/10 border-red-500/50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">{transaction.time}</span>
                  {transaction.status === 'approved' ? (
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <div className="text-slate-200 mb-1">{transaction.truck}</div>
                <div className="text-sm text-slate-400">{transaction.container}</div>
                {transaction.weight > 0 && (
                  <div className="text-xs text-slate-500 mt-2">{transaction.weight} kg</div>
                )}
              </div>
            ))}
          </div>

          {/* Stats Summary */}
          <div className="mt-6 pt-6 border-t border-slate-800">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Today's Total</span>
                <span className="text-emerald-400">147</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Approved</span>
                <span className="text-emerald-400">142</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Rejected</span>
                <span className="text-red-400">5</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-sm">Avg Process Time</span>
                <span className="text-blue-400">2.5 min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All Gates Status */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl mb-4">Gate Status Overview</h3>
        
        {/* Desktop Table */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-slate-400 text-sm">Gate</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm">Status</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm">Truck</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm">Container</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm">Weight</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm">OCR</th>
              </tr>
            </thead>
            <tbody>
              {gates.map((gate) => (
                <tr key={gate.id} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 text-slate-200">Gate {gate.id}</td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      gate.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                      gate.status === 'error' ? 'bg-red-500/20 text-red-400' :
                      'bg-slate-700 text-slate-400'
                    }`}>
                      {gate.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-300">{gate.truck || '—'}</td>
                  <td className="px-4 py-3 text-slate-300">{gate.container || '—'}</td>
                  <td className="px-4 py-3 text-slate-300">{gate.weight > 0 ? `${gate.weight} kg` : '—'}</td>
                  <td className="px-4 py-3 text-slate-300">{gate.ocr > 0 ? `${gate.ocr}%` : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="lg:hidden space-y-3">
          {gates.map((gate) => (
            <div key={gate.id} className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="text-slate-200 font-medium">Gate {gate.id}</div>
                <span className={`px-3 py-1 rounded-full text-xs ${
                  gate.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                  gate.status === 'error' ? 'bg-red-500/20 text-red-400' :
                  'bg-slate-700 text-slate-400'
                }`}>
                  {gate.status}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <div className="text-slate-500 text-xs mb-1">Truck</div>
                  <div className="text-slate-300">{gate.truck || '—'}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs mb-1">Container</div>
                  <div className="text-slate-300">{gate.container || '—'}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs mb-1">Weight</div>
                  <div className="text-slate-300">{gate.weight > 0 ? `${gate.weight} kg` : '—'}</div>
                </div>
                <div>
                  <div className="text-slate-500 text-xs mb-1">OCR Accuracy</div>
                  <div className="text-slate-300">{gate.ocr > 0 ? `${gate.ocr}%` : '—'}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}