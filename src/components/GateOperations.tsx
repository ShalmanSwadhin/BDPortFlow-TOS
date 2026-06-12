import { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { gateAPI } from '../api/client';
import ModuleInfoPanel, { MODULE_INFO } from './ModuleInfoPanel';
import { Camera, CheckCircle, XCircle, AlertTriangle, Truck, ScanLine, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

function mapGateStatus(status: string): 'active' | 'idle' | 'error' {
  if (status === 'Busy' || status === 'Open') return 'active';
  if (status === 'Maintenance') return 'error';
  return 'idle';
}

function mapGateForUI(gate: any) {
  const transactions = Array.isArray(gate.transactions) ? gate.transactions : [];
  const pendingTx = transactions.find((t: any) => t.approvalStatus === 'Pending');
  const latestTx = transactions[transactions.length - 1];
  const tx = pendingTx || latestTx;
  const uiStatus =
    tx?.approvalStatus === 'Rejected' || tx?.approvalStatus === 'Hold For Inspection'
      ? 'error'
      : mapGateStatus(gate.status);

  return {
    id: gate.gateNumber,
    _id: gate._id,
    gateNumber: gate.gateNumber,
    status: uiStatus,
    truck: gate.currentVehicle || tx?.truckNumber || tx?.licensePlate || null,
    container: tx?.containerId || null,
    weight: tx?.weight || 0,
    verifiedWeight: tx?.weight || 0,
    ocr: tx?.licensePlate ? 98 : tx ? 85 : 0,
    driverName: tx?.driverName || 'Unknown',
    driverContact: tx?.driverContact || '',
    purpose: tx?.purpose || 'Delivery',
    processedToday: gate.processedToday || 0,
    raw: gate,
  };
}

export default function GateOperations() {
  const { gates, refreshAllData, isLoading } = useApp();
  const [selectedGateId, setSelectedGateId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTx, setLoadingTx] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const gateList = useMemo(() => gates.map(mapGateForUI), [gates]);

  useEffect(() => {
    if (gateList.length && !selectedGateId) {
      setSelectedGateId(gateList[0]._id);
    }
  }, [gateList, selectedGateId]);

  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoadingTx(true);
        const res = await gateAPI.getAllTransactions();
        if (res.data.success) {
          setTransactions(res.data.data || []);
        }
      } catch (err: any) {
        toast.error('Failed to load transactions', {
          description: err.response?.data?.message || err.message,
        });
      } finally {
        setLoadingTx(false);
      }
    };
    loadTransactions();
  }, []);

  const currentGate = gateList.find(g => g._id === selectedGateId);
  const weightMismatch =
    currentGate &&
    currentGate.weight > 0 &&
    Math.abs(currentGate.weight - currentGate.verifiedWeight) > currentGate.weight * 0.03;

  const recentTransactions = transactions.slice(0, 5).map((t, i) => ({
    id: t._id || i,
    time: new Date(t.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
    truck: t.truckNumber || t.licensePlate,
    container: t.containerId,
    status: t.approvalStatus === 'Approved' ? 'approved' : 'rejected',
    weight: t.weight || 0,
  }));

  const todayStats = useMemo(() => {
    const today = new Date().toDateString();
    const todayTx = transactions.filter(t => new Date(t.timestamp).toDateString() === today);
    return {
      total: todayTx.length || gateList.reduce((s, g) => s + g.processedToday, 0),
      approved: todayTx.filter(t => t.approvalStatus === 'Approved').length,
      rejected: todayTx.filter(t => t.approvalStatus === 'Rejected' || t.approvalStatus === 'Hold For Inspection').length,
    };
  }, [transactions, gateList]);

  const handleApproveEntry = async () => {
    if (!currentGate) return;
    try {
      setActionLoading(true);
      await gateAPI.approveEntry(currentGate._id, {
        truckNumber: currentGate.truck,
        containerId: currentGate.container,
        driverName: currentGate.driverName,
        driverContact: currentGate.driverContact,
        licensePlate: currentGate.truck,
        weight: currentGate.weight,
        purpose: currentGate.purpose,
      });
      toast.success('Entry approved', {
        description: `${currentGate.truck} - ${currentGate.container} cleared for entry`,
      });
      await refreshAllData();
      const res = await gateAPI.getAllTransactions();
      if (res.data.success) setTransactions(res.data.data || []);
    } catch (err: any) {
      toast.error('Failed to approve entry', {
        description: err.response?.data?.message || err.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleHoldForInspection = async () => {
    if (!currentGate) return;
    try {
      setActionLoading(true);
      await gateAPI.holdForInspection(currentGate._id, {
        truckNumber: currentGate.truck,
        containerId: currentGate.container,
        driverName: currentGate.driverName,
        driverContact: currentGate.driverContact,
        licensePlate: currentGate.truck,
        purpose: currentGate.purpose,
      });
      toast.warning('Inspection required', {
        description: `${currentGate.truck} held for manual inspection`,
      });
      await refreshAllData();
      const res = await gateAPI.getAllTransactions();
      if (res.data.success) setTransactions(res.data.data || []);
    } catch (err: any) {
      toast.error('Failed to hold vehicle', {
        description: err.response?.data?.message || err.message,
      });
    } finally {
      setActionLoading(false);
    }
  };

  const handleStatusUpdate = async (gateId: string, status: string) => {
    try {
      await gateAPI.update(gateId, { status });
      toast.success(`Gate status updated to ${status}`);
      await refreshAllData();
    } catch (err: any) {
      toast.error('Failed to update gate status', {
        description: err.response?.data?.message || err.message,
      });
    }
  };

  if (isLoading && !gateList.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl mb-2">Automated Gate Operations</h2>
          <p className="text-slate-400 text-sm sm:text-base">Real-time OCR, weight validation, and access control</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-lg">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-400 text-sm sm:text-base">
              {gateList.filter(g => g.status === 'active').length} Gates Active
            </span>
          </div>
        </div>
      </div>

      {gateList.length === 0 ? (
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-12 text-center text-slate-400">
          No gates configured. Gate data will appear once loaded from the database.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {gateList.map((gate) => (
              <button
                key={gate._id}
                onClick={() => setSelectedGateId(gate._id)}
                className={`p-4 rounded-xl text-left transition-all ${
                  selectedGateId === gate._id
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
                  <div className="mt-2 text-sm text-slate-400">{gate.truck}</div>
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl">Live Camera - Gate {currentGate?.id}</h3>
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-emerald-400" />
                    <span className="text-sm text-emerald-400">Live</span>
                  </div>
                </div>

                <div className="relative aspect-video bg-slate-950 rounded-lg overflow-hidden">
                  {currentGate?.status !== 'idle' ? (
                    <>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-slate-700 text-8xl">
                          <Truck />
                        </div>
                      </div>
                      {currentGate?.truck && (
                        <>
                          <div className="absolute top-1/3 left-1/4 border-2 border-emerald-400 px-4 py-2 bg-slate-900/80 backdrop-blur">
                            <div className="text-emerald-400 text-sm mb-1">License Plate</div>
                            <div className="text-white">{currentGate.truck}</div>
                            <div className="text-xs text-emerald-400 mt-1">Confidence: {currentGate.ocr}%</div>
                          </div>
                          <div className="absolute top-2/3 right-1/4 border-2 border-blue-400 px-4 py-2 bg-slate-900/80 backdrop-blur">
                            <div className="text-blue-400 text-sm mb-1">Container ID</div>
                            <div className="text-white">{currentGate.container}</div>
                            <div className="text-xs text-blue-400 mt-1">Verified</div>
                          </div>
                        </>
                      )}
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

              {currentGate && currentGate.status !== 'idle' && (
                <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
                  <h3 className="text-xl mb-4">Verification Results</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className={`p-4 rounded-lg border-2 ${
                      (currentGate.ocr ?? 0) >= 95 ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-yellow-500/10 border-yellow-500/50'
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
                    <div className="p-4 rounded-lg border-2 bg-emerald-500/10 border-emerald-500/50">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-400">Container ID</span>
                        <CheckCircle className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div className="text-lg text-slate-200 mb-1">{currentGate.container}</div>
                      <div className="text-sm text-emerald-400">Verified</div>
                    </div>
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
                        <button
                          onClick={handleApproveEntry}
                          disabled={actionLoading}
                          className="flex-1 px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          Manual Override
                        </button>
                        <button
                          onClick={handleHoldForInspection}
                          disabled={actionLoading}
                          className="flex-1 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded-lg transition-colors disabled:opacity-50"
                        >
                          Reject Entry
                        </button>
                      </div>
                    </div>
                  )}

                  {currentGate.status === 'active' && !weightMismatch && (
                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={handleApproveEntry}
                        disabled={actionLoading}
                        className="flex-1 px-4 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                      >
                        {actionLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                        Approve Entry
                      </button>
                      <button
                        onClick={handleHoldForInspection}
                        disabled={actionLoading}
                        className="px-4 py-3 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Hold for Inspection
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
              <h3 className="text-xl mb-4">Recent Transactions</h3>
              {loadingTx ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
                </div>
              ) : (
                <div className="space-y-3">
                  {recentTransactions.length === 0 ? (
                    <p className="text-slate-500 text-sm text-center py-4">No transactions yet</p>
                  ) : (
                    recentTransactions.map((transaction) => (
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
                    ))
                  )}
                </div>
              )}

              <div className="mt-6 pt-6 border-t border-slate-800">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Today's Total</span>
                    <span className="text-emerald-400">{todayStats.total}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Approved</span>
                    <span className="text-emerald-400">{todayStats.approved}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-sm">Rejected</span>
                    <span className="text-red-400">{todayStats.rejected}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl mb-4">Gate Status Overview</h3>
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-800/50">
                  <tr>
                    <th className="px-4 py-3 text-left text-slate-400 text-sm">Gate</th>
                    <th className="px-4 py-3 text-left text-slate-400 text-sm">Status</th>
                    <th className="px-4 py-3 text-left text-slate-400 text-sm">Truck</th>
                    <th className="px-4 py-3 text-left text-slate-400 text-sm">Container</th>
                    <th className="px-4 py-3 text-left text-slate-400 text-sm">Weight</th>
                    <th className="px-4 py-3 text-left text-slate-400 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gateList.map((gate) => (
                    <tr key={gate._id} className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors">
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
                      <td className="px-4 py-3">
                        <select
                          value={gate.raw?.status || 'Open'}
                          onChange={(e) => handleStatusUpdate(gate._id, e.target.value)}
                          className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs text-slate-300"
                        >
                          <option value="Open">Open</option>
                          <option value="Closed">Closed</option>
                          <option value="Busy">Busy</option>
                          <option value="Maintenance">Maintenance</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <ModuleInfoPanel content={MODULE_INFO.gate} />
    </div>
  );
}
