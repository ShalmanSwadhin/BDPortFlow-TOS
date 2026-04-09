import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Weight, AlertCircle, Move, Eye, MapPin } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function ContainerStacking() {
  const { containers } = useApp();
  const [selectedStack, setSelectedStack] = useState<any>(null);
  const [view, setView] = useState<'top' | 'side'>('top');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  const stacks = [
    {
      id: 'A1-01',
      position: { row: 0, col: 0 },
      height: 4,
      containers: [
        { id: 'TCLU3456789', weight: 22.5, type: 'standard', priority: 3 },
        { id: 'YMMU8901234', weight: 24.8, type: 'reefer', priority: 1 },
        { id: 'MAEU5678901', weight: 20.2, type: 'standard', priority: 2 },
        { id: 'CSQU2345678', weight: 23.1, type: 'standard', priority: 4 },
      ],
      status: 'optimal',
      maxWeight: 100,
      currentWeight: 90.6,
    },
    {
      id: 'A1-02',
      position: { row: 0, col: 1 },
      height: 3,
      containers: [
        { id: 'HLBU7890123', weight: 25.3, type: 'standard', priority: 2 },
        { id: 'TCKU4567890', weight: 21.7, type: 'hazmat', priority: 1 },
        { id: 'OOLU1234567', weight: 19.8, type: 'standard', priority: 3 },
      ],
      status: 'warning',
      maxWeight: 100,
      currentWeight: 66.8,
    },
    {
      id: 'A1-03',
      position: { row: 0, col: 2 },
      height: 5,
      containers: [
        { id: 'MSCU8901234', weight: 24.2, type: 'standard', priority: 5 },
        { id: 'CMAU5678901', weight: 22.9, type: 'standard', priority: 4 },
        { id: 'APZU2345678', weight: 23.5, type: 'standard', priority: 3 },
        { id: 'SEGU7890123', weight: 21.1, type: 'standard', priority: 2 },
        { id: 'TEMU4567890', weight: 20.8, type: 'standard', priority: 1 },
      ],
      status: 'critical',
      maxWeight: 100,
      currentWeight: 112.5,
    },
    {
      id: 'A1-04',
      position: { row: 0, col: 3 },
      height: 2,
      containers: [
        { id: 'GLDU1234567', weight: 18.5, type: 'standard', priority: 2 },
        { id: 'BMOU8901234', weight: 17.2, type: 'standard', priority: 1 },
      ],
      status: 'optimal',
      maxWeight: 100,
      currentWeight: 35.7,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return { bg: '#00ff88', text: 'text-emerald-400', border: 'border-emerald-500' };
      case 'warning': return { bg: '#ffd700', text: 'text-yellow-400', border: 'border-yellow-500' };
      case 'critical': return { bg: '#ef4444', text: 'text-red-400', border: 'border-red-500' };
      default: return { bg: '#64748b', text: 'text-slate-400', border: 'border-slate-500' };
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'standard': return '#00d4ff';
      case 'reefer': return '#00ff88';
      case 'hazmat': return '#ff6b35';
      default: return '#64748b';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl mb-2">Container Stacking & 3D Yard</h2>
          <p className="text-slate-400 text-sm sm:text-base">Optimize container placement and minimize reshuffles</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="flex gap-2 p-1 bg-slate-900/50 border border-slate-800 rounded-lg">
            <button
              onClick={() => setView('top')}
              className={`px-4 py-2 rounded transition-all ${
                view === 'top'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Top View
            </button>
            <button
              onClick={() => setView('side')}
              className={`px-4 py-2 rounded transition-all ${
                view === 'side'
                  ? 'bg-emerald-500 text-white'
                  : 'text-slate-400 hover:text-slate-300'
              }`}
            >
              Side View
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Package className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl text-blue-400 mb-1">18</div>
          <div className="text-slate-400 text-sm">Total Stacks</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Weight className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl text-emerald-400 mb-1">12</div>
          <div className="text-slate-400 text-sm">Optimal Stacks</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-red-400 mb-2" />
          <div className="text-2xl text-red-400 mb-1">1</div>
          <div className="text-slate-400 text-sm">Overweight</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Move className="w-5 h-5 text-yellow-400 mb-2" />
          <div className="text-2xl text-yellow-400 mb-1">3</div>
          <div className="text-slate-400 text-sm">Reshuffle Risk</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stacking View */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">Block A1 - {view === 'top' ? 'Top View' : 'Side View'}</h3>
            <div className="flex items-center gap-2">
              <Eye className="w-4 h-4 text-slate-400" />
              <span className="text-sm text-slate-400">Interactive View</span>
            </div>
          </div>

          {view === 'top' ? (
            /* Top View */
            <div className="space-y-8">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stacks.map((stack) => {
                  const colors = getStatusColor(stack.status);
                  const isSelected = selectedStack?.id === stack.id;

                  return (
                    <div
                      key={stack.id}
                      onClick={() => setSelectedStack(stack)}
                      className={`relative cursor-pointer transition-all hover:scale-105 ${
                        isSelected ? 'scale-105' : ''
                      }`}
                    >
                      {/* Stack Visualization */}
                      <div className="relative h-48 flex flex-col justify-end">
                        {stack.containers.map((container, idx) => {
                          const containerColor = getTypeColor(container.type);
                          
                          return (
                            <div
                              key={idx}
                              className={`h-10 mb-1 rounded border-2 transition-all ${
                                isSelected ? colors.border : 'border-slate-700'
                              }`}
                              style={{
                                backgroundColor: `${containerColor}40`,
                                borderColor: isSelected ? colors.bg : '#334155',
                              }}
                            >
                              <div className="h-full flex items-center justify-center text-xs text-slate-300">
                                {container.weight}t
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Stack Info */}
                      <div className="mt-2 text-center">
                        <div className="text-sm text-slate-300 mb-1">{stack.id}</div>
                        <div className="text-xs text-slate-500">
                          {stack.height} × {stack.currentWeight.toFixed(1)}t
                        </div>
                        <div className={`text-xs mt-1 ${colors.text}`}>
                          {stack.status.toUpperCase()}
                        </div>
                      </div>

                      {/* Status Indicator */}
                      {stack.status === 'critical' && (
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center animate-pulse">
                          <AlertCircle className="w-4 h-4 text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Ground Line */}
              <div className="border-t-4 border-slate-700"></div>
            </div>
          ) : (
            /* Side View */
            <div className="space-y-4">
              {stacks.map((stack) => {
                const colors = getStatusColor(stack.status);
                const isSelected = selectedStack?.id === stack.id;

                return (
                  <div
                    key={stack.id}
                    onClick={() => setSelectedStack(stack)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      isSelected ? `${colors.border} bg-slate-800` : 'border-slate-700 bg-slate-800/30'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Stack ID */}
                      <div className="w-20 text-sm text-slate-300">{stack.id}</div>

                      {/* Side View Visualization */}
                      <div className="flex-1 flex gap-1">
                        {stack.containers.map((container, idx) => {
                          const containerColor = getTypeColor(container.type);
                          
                          return (
                            <div
                              key={idx}
                              className="flex-1 h-16 rounded border-2"
                              style={{
                                backgroundColor: `${containerColor}40`,
                                borderColor: containerColor,
                              }}
                            >
                              <div className="h-full flex flex-col items-center justify-center">
                                <div className="text-xs text-slate-300">{container.weight}t</div>
                                <div className="text-xs text-slate-500">P{container.priority}</div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Weight Info */}
                      <div className="w-32 text-right">
                        <div className="text-sm text-slate-400">
                          {stack.currentWeight.toFixed(1)}t / {stack.maxWeight}t
                        </div>
                        <div className={`text-xs ${colors.text} mt-1`}>
                          {stack.status}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Legend */}
          <div className="mt-6 flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#00d4ff' }}></div>
              <span className="text-xs text-slate-400">Standard</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#00ff88' }}></div>
              <span className="text-xs text-slate-400">Reefer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ff6b35' }}></div>
              <span className="text-xs text-slate-400">Hazmat</span>
            </div>
          </div>
        </div>

        {/* Stack Details */}
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl mb-4">
            {selectedStack ? `Stack ${selectedStack.id}` : 'Select Stack'}
          </h3>

          {selectedStack ? (
            <div className="space-y-4">
              {/* Status Badge */}
              <div
                className={`p-4 rounded-lg border-2 ${getStatusColor(selectedStack.status).border}`}
                style={{ backgroundColor: `${getStatusColor(selectedStack.status).bg}20` }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-slate-300">Status</span>
                  <span className={`uppercase text-sm ${getStatusColor(selectedStack.status).text}`}>
                    {selectedStack.status}
                  </span>
                </div>
              </div>

              {/* Weight Info */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Total Weight</span>
                  <span className="text-slate-200">{selectedStack.currentWeight.toFixed(1)}t</span>
                </div>
                <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      selectedStack.currentWeight > selectedStack.maxWeight
                        ? 'bg-red-500'
                        : selectedStack.currentWeight > selectedStack.maxWeight * 0.9
                        ? 'bg-yellow-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min((selectedStack.currentWeight / selectedStack.maxWeight) * 100, 100)}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>0t</span>
                  <span>{selectedStack.maxWeight}t max</span>
                </div>
              </div>

              {/* Container List */}
              <div>
                <div className="text-sm text-slate-400 mb-2">Containers (Top to Bottom)</div>
                <div className="space-y-2">
                  {selectedStack.containers.map((container, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-800/50 rounded-lg border border-slate-700"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300">{container.id}</span>
                        <span
                          className="text-xs px-2 py-1 rounded"
                          style={{
                            backgroundColor: `${getTypeColor(container.type)}30`,
                            color: getTypeColor(container.type),
                          }}
                        >
                          {container.type}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-500">Weight: {container.weight}t</span>
                        <span className="text-slate-500">Priority: {container.priority}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reshuffle Analysis */}
              {selectedStack.status === 'warning' && (
                <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2 text-yellow-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Reshuffle Risk Detected</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    High-priority container (P1) is blocked by lower-priority containers. Consider restacking.
                  </p>
                </div>
              )}

              {selectedStack.status === 'critical' && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2 text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span className="text-sm">Weight Limit Exceeded</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Stack weight exceeds maximum capacity. Immediate action required.
                  </p>
                </div>
              )}

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={() => setShowMoveModal(true)}
                  className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 rounded-lg transition-colors"
                >
                  Simulate Move
                </button>
                <button
                  onClick={() => setShowOptimizeModal(true)}
                  className="w-full px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 rounded-lg transition-colors"
                >
                  Optimize Stack
                </button>
                <button
                  onClick={() => setShowHistoryModal(true)}
                  className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                >
                  View History
                </button>
              </div>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-slate-500">
              <Package className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a stack to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Simulate Move Modal */}
      {showMoveModal && selectedStack && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-blue-500/50 rounded-xl max-w-2xl w-full p-6">
            <h3 className="text-xl text-blue-400 mb-6">Simulate Container Move</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Source Stack</label>
                <input
                  type="text"
                  value={selectedStack.id}
                  disabled
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100"
                />
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Select Container to Move</label>
                <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500">
                  {selectedStack.containers.map((c: any) => (
                    <option key={c.id} value={c.id}>{c.id} - {c.weight}T - Priority {c.priority}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-slate-400 text-sm mb-2">Destination Stack</label>
                <select className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 focus:outline-none focus:border-blue-500">
                  <option>A1-02</option>
                  <option>A1-03</option>
                  <option>A2-01</option>
                  <option>B1-01</option>
                  <option>B1-02</option>
                </select>
              </div>
              <div className="p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
                <div className="text-sm text-slate-300 mb-2">Move Analysis:</div>
                <ul className="text-xs text-slate-400 space-y-1">
                  <li>✓ Weight distribution: Optimal</li>
                  <li>✓ Accessibility: Improved</li>
                  <li>✓ Estimated time: 8 minutes</li>
                  <li>✓ Crane assignment: Crane 2</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowMoveModal(false)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Container move executed!', {
                    description: `Container moved from ${selectedStack?.id} - Crane 2 assigned`,
                  });
                  setShowMoveModal(false);
                }}
                className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
              >
                Execute Move
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Optimize Stack Modal */}
      {showOptimizeModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-xl max-w-3xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl text-emerald-400 mb-6">Stack Optimization Suggestions</h3>
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-emerald-400 mb-1">Suggestion #1: Restack by Priority</h4>
                    <p className="text-sm text-slate-400">Move high-priority containers to top positions</p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">High Impact</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>• Moves required: 6</div>
                  <div>• Time saved: ~45 minutes on retrieval</div>
                  <div>• Improved accessibility: +35%</div>
                </div>
              </div>

              <div className="p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-blue-400 mb-1">Suggestion #2: Balance Weight Distribution</h4>
                    <p className="text-sm text-slate-400">Redistribute heavy containers across stacks</p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">Medium Impact</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>• Moves required: 4</div>
                  <div>• Safety improvement: +20%</div>
                  <div>• Stack stability: Optimal</div>
                </div>
              </div>

              <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="text-yellow-400 mb-1">Suggestion #3: Consolidate Empty Spaces</h4>
                    <p className="text-sm text-slate-400">Merge partially filled stacks to free up space</p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">Low Impact</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>• Moves required: 8</div>
                  <div>• Space freed: 2 stack positions</div>
                  <div>• Yard utilization: +5%</div>
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowOptimizeModal(false)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => {
                  toast.success('Optimization plan created!', {
                    description: 'Stack optimization scheduled - 6 moves will be executed',
                  });
                  setShowOptimizeModal(false);
                }}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors"
              >
                Create Optimization Plan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stack History Modal */}
      {showHistoryModal && selectedStack && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-4xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl text-slate-100 mb-6">Stack History: {selectedStack.id}</h3>
            <div className="space-y-3">
              {[
                { time: '2 hours ago', action: 'Container added', details: 'TCLU3456789 placed on stack', user: 'Crane Operator 2' },
                { time: '5 hours ago', action: 'Container removed', details: 'MAEU5678901 retrieved for loading', user: 'Crane Operator 1' },
                { time: '8 hours ago', action: 'Stack inspection', details: 'Safety inspection completed - All OK', user: 'Safety Officer' },
                { time: '12 hours ago', action: 'Container moved', details: 'YMMU8901234 relocated from B1-02', user: 'Crane Operator 3' },
                { time: '1 day ago', action: 'Weight check', details: 'Total weight: 90.6T - Within limits', user: 'System' },
              ].map((event, idx) => (
                <div key={idx} className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-slate-200">{event.action}</div>
                    <div className="text-xs text-slate-500">{event.time}</div>
                  </div>
                  <div className="text-sm text-slate-400 mb-1">{event.details}</div>
                  <div className="text-xs text-slate-500">By {event.user}</div>
                </div>
              ))}
            </div>
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowHistoryModal(false)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}