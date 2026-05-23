import { useState } from 'react';
import { Ship, AlertTriangle, CheckCircle, TrendingDown, TrendingUp, Scale } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function ShipStowage() {
  const [selectedCell, setSelectedCell] = useState<any>(null);
  const [balanceStatus, setBalanceStatus] = useState('stable');

  // Ship bay grid - simplified representation
  const bays = 8;
  const rows = 6;
  const tiers = 4;

  // Mock container assignments (bay, row, tier)
  const assignments = [
    { bay: 1, row: 1, tier: 1, container: 'TCLU3456789', weight: 22.5, type: 'standard', destination: 'Singapore' },
    { bay: 1, row: 1, tier: 2, container: 'YMMU8901234', weight: 24.8, type: 'reefer', destination: 'Singapore' },
    { bay: 1, row: 2, tier: 1, container: 'MAEU5678901', weight: 20.2, type: 'standard', destination: 'Dubai' },
    { bay: 2, row: 1, tier: 1, container: 'CSQU2345678', weight: 23.1, type: 'standard', destination: 'Shanghai' },
    { bay: 2, row: 2, tier: 1, container: 'HLBU7890123', weight: 25.3, type: 'hazmat', destination: 'Singapore' },
    { bay: 3, row: 1, tier: 1, container: 'TCKU4567890', weight: 21.7, type: 'standard', destination: 'Dubai' },
    { bay: 3, row: 1, tier: 2, container: 'OOLU1234567', weight: 19.8, type: 'standard', destination: 'Dubai' },
    { bay: 3, row: 2, tier: 1, container: 'MSCU8901234', weight: 24.2, type: 'standard', destination: 'Singapore' },
    { bay: 4, row: 1, tier: 1, container: 'CMAU5678901', weight: 22.9, type: 'reefer', destination: 'Shanghai' },
    { bay: 5, row: 1, tier: 1, container: 'APZU2345678', weight: 23.5, type: 'standard', destination: 'Dubai' },
    { bay: 5, row: 2, tier: 1, container: 'SEGU7890123', weight: 21.1, type: 'standard', destination: 'Singapore' },
    { bay: 6, row: 1, tier: 1, container: 'TEMU4567890', weight: 20.8, type: 'standard', destination: 'Shanghai' },
  ];

  const getContainerAt = (bay: number, row: number, tier: number) => {
    return assignments.find(a => a.bay === bay && a.row === row && a.tier === tier);
  };

  const getTypeColor = (type?: string) => {
    if (!type) return '#334155';
    switch (type) {
      case 'standard': return '#00d4ff';
      case 'reefer': return '#00ff88';
      case 'hazmat': return '#ff6b35';
      default: return '#64748b';
    }
  };

  const getDestinationColor = (destination?: string) => {
    if (!destination) return '#64748b';
    const colors: { [key: string]: string } = {
      'Singapore': '#00ff88',
      'Dubai': '#ffd700',
      'Shanghai': '#ff6b35',
    };
    return colors[destination] || '#64748b';
  };

  const calculateBalance = () => {
    const leftWeight = assignments.filter(a => a.row <= 3).reduce((sum, a) => sum + a.weight, 0);
    const rightWeight = assignments.filter(a => a.row > 3).reduce((sum, a) => sum + a.weight, 0);
    const total = leftWeight + rightWeight;
    const difference = Math.abs(leftWeight - rightWeight);
    const percentDiff = (difference / total) * 100;

    return {
      left: leftWeight,
      right: rightWeight,
      difference: percentDiff,
      status: percentDiff < 5 ? 'stable' : percentDiff < 10 ? 'caution' : 'unstable',
    };
  };

  const balance = calculateBalance();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl mb-2">Ship Stowage Planning</h2>
          <p className="text-slate-400 text-sm sm:text-base">Container placement and weight distribution</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <div className="px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg">
            <span className="text-slate-400 text-sm">Vessel: </span>
            <span className="text-emerald-400">MV HARMONY</span>
          </div>
        </div>
      </div>

      {/* Stats & Balance */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Ship className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl text-blue-400 mb-1">245</div>
          <div className="text-slate-400 text-sm">Containers Loaded</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Scale className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl text-emerald-400 mb-1">{balance.difference.toFixed(1)}%</div>
          <div className="text-slate-400 text-sm">Balance Variance</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          {balance.status === 'stable' ? (
            <CheckCircle className="w-5 h-5 text-emerald-400 mb-2" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-yellow-400 mb-2" />
          )}
          <div className={`text-2xl mb-1 ${
            balance.status === 'stable' ? 'text-emerald-400' : 
            balance.status === 'caution' ? 'text-yellow-400' : 'text-red-400'
          }`}>
            {balance.status.toUpperCase()}
          </div>
          <div className="text-slate-400 text-sm">Balance Status</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <TrendingUp className="w-5 h-5 text-cyan-400 mb-2" />
          <div className="text-2xl text-cyan-400 mb-1">412</div>
          <div className="text-slate-400 text-sm">Total Capacity</div>
        </div>
      </div>

      {/* Main Stowage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ship Cross-Section View */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">Cross-Section View - All Bays</h3>
            <div className="flex items-center gap-2">
              <div className={`px-3 py-1 rounded ${
                balance.status === 'stable' ? 'bg-emerald-500/20 text-emerald-400' :
                balance.status === 'caution' ? 'bg-yellow-500/20 text-yellow-400' :
                'bg-red-500/20 text-red-400'
              }`}>
                {balance.status.toUpperCase()}
              </div>
            </div>
          </div>

          {/* Ship Hull Visualization */}
          <div className="relative bg-slate-950 rounded-lg p-6 overflow-x-auto">
            {/* Grid Container */}
            <div className="min-w-[800px]">
              {/* Row Labels (Port/Starboard) */}
              <div className="flex mb-2">
                <div className="w-16"></div>
                {[...Array(bays)].map((_, bayIdx) => (
                  <div key={bayIdx} className="flex-1 text-center text-xs text-slate-500">
                    Bay {bayIdx + 1}
                  </div>
                ))}
              </div>

              {/* Container Grid */}
              {[...Array(rows)].map((_, rowIdx) => (
                <div key={rowIdx} className="flex items-center mb-1">
                  {/* Row Label */}
                  <div className="w-16 text-xs text-slate-500">
                    {rowIdx < 3 ? `Port ${3 - rowIdx}` : `Star ${rowIdx - 2}`}
                  </div>

                  {/* Bay Cells */}
                  {[...Array(bays)].map((_, bayIdx) => {
                    const container = getContainerAt(bayIdx + 1, rowIdx + 1, 1);
                    const hasContainer = !!container;

                    return (
                      <div
                        key={`${bayIdx}-${rowIdx}`}
                        onClick={() => hasContainer && setSelectedCell(container)}
                        className={`flex-1 mx-0.5 cursor-pointer transition-all ${
                          hasContainer ? 'hover:scale-105' : ''
                        }`}
                      >
                        <div
                          className={`h-16 rounded border-2 flex items-center justify-center ${
                            selectedCell?.container === container?.container
                              ? 'ring-2 ring-emerald-400'
                              : ''
                          }`}
                          style={{
                            backgroundColor: hasContainer ? `${getTypeColor(container.type)}40` : '#1e293b',
                            borderColor: hasContainer ? getTypeColor(container.type) : '#334155',
                          }}
                        >
                          {hasContainer && (
                            <div className="text-center">
                              <div className="text-xs text-slate-300">{container.weight}t</div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}

              {/* Centerline */}
              <div className="flex items-center my-4">
                <div className="w-16"></div>
                <div className="flex-1 border-t-2 border-dashed border-yellow-500/50"></div>
              </div>

              {/* Weight Distribution Bars */}
              <div className="flex items-center mt-6">
                <div className="w-16 text-xs text-slate-500">Weight</div>
                <div className="flex-1 flex items-center gap-4">
                  {/* Left Side */}
                  <div className="flex-1">
                    <div className="text-xs text-slate-400 mb-1">Port: {balance.left.toFixed(1)}t</div>
                    <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600"
                        style={{ width: `${(balance.left / (balance.left + balance.right)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  {/* Right Side */}
                  <div className="flex-1">
                    <div className="text-xs text-slate-400 mb-1 text-right">Starboard: {balance.right.toFixed(1)}t</div>
                    <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 ml-auto"
                        style={{ width: `${(balance.right / (balance.left + balance.right)) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4">
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

        {/* Container Details & COG */}
        <div className="space-y-6">
          {/* Selected Container */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <h3 className="text-xl mb-4">
              {selectedCell ? 'Container Details' : 'Select Container'}
            </h3>

            {selectedCell ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
                  <div className="text-sm text-slate-400 mb-1">Container ID</div>
                  <div className="text-lg text-slate-200">{selectedCell.container}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-slate-400 mb-1">Weight</div>
                    <div className="text-slate-200">{selectedCell.weight}t</div>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-slate-400 mb-1">Type</div>
                    <div
                      className="text-sm"
                      style={{ color: getTypeColor(selectedCell.type) }}
                    >
                      {selectedCell.type}
                    </div>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-slate-400 mb-1">Bay</div>
                    <div className="text-slate-200">{selectedCell.bay}</div>
                  </div>
                  <div className="p-3 bg-slate-800/50 rounded-lg">
                    <div className="text-xs text-slate-400 mb-1">Row</div>
                    <div className="text-slate-200">{selectedCell.row}</div>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-lg">
                  <div className="text-xs text-slate-400 mb-1">Destination</div>
                  <div
                    className="text-lg"
                    style={{ color: getDestinationColor(selectedCell.destination) }}
                  >
                    {selectedCell.destination}
                  </div>
                </div>

                <div className="space-y-2">
                  <button 
                    onClick={() => {
                      toast.success('Container move initiated', {
                        description: `${selectedCell?.id} scheduled for relocation`,
                      });
                    }}
                    className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 rounded-lg transition-colors"
                  >
                    Move Container
                  </button>
                  <button 
                    onClick={() => {
                      toast.success('Container removed', {
                        description: `${selectedCell?.id} discharged from vessel`,
                      });
                      setSelectedCell(null);
                    }}
                    className="w-full px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded-lg transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-64 flex flex-col items-center justify-center text-slate-500">
                <Ship className="w-12 h-12 mb-3 opacity-20" />
                <p className="text-sm">Click a container to view details</p>
              </div>
            )}
          </div>

          {/* Center of Gravity Indicator */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
            <h3 className="text-lg mb-4">Center of Gravity</h3>

            {/* Visual COG Indicator */}
            <div className="relative h-48 bg-slate-950 rounded-lg p-4">
              {/* Grid */}
              <div className="absolute inset-4 border-2 border-dashed border-slate-700 rounded">
                {/* Center Lines */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="absolute w-full h-px bg-slate-700"></div>
                  <div className="absolute h-full w-px bg-slate-700"></div>
                </div>

                {/* COG Point */}
                <div
                  className={`absolute w-4 h-4 rounded-full ${
                    balance.status === 'stable' ? 'bg-emerald-400' :
                    balance.status === 'caution' ? 'bg-yellow-400' : 'bg-red-400'
                  }`}
                  style={{
                    left: `${48 + (balance.right - balance.left) / 20}%`,
                    top: '45%',
                    boxShadow: `0 0 20px ${
                      balance.status === 'stable' ? '#00ff88' :
                      balance.status === 'caution' ? '#ffd700' : '#ef4444'
                    }`,
                  }}
                ></div>

                {/* Target Zone */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-emerald-500/30 rounded-full"></div>
              </div>
            </div>

            {/* Status */}
            <div className={`mt-4 p-3 rounded-lg ${
              balance.status === 'stable' ? 'bg-emerald-500/20 border border-emerald-500/50' :
              balance.status === 'caution' ? 'bg-yellow-500/20 border border-yellow-500/50' :
              'bg-red-500/20 border border-red-500/50'
            }`}>
              <div className={`text-sm mb-1 ${
                balance.status === 'stable' ? 'text-emerald-400' :
                balance.status === 'caution' ? 'text-yellow-400' : 'text-red-400'
              }`}>
                {balance.status === 'stable' ? '✓ Balanced' :
                 balance.status === 'caution' ? '⚠ Caution' : '✗ Unstable'}
              </div>
              <div className="text-xs text-slate-400">
                {balance.status === 'stable'
                  ? 'Weight distribution is within acceptable range'
                  : balance.status === 'caution'
                  ? 'Weight distribution needs attention'
                  : 'Critical: Immediate rebalancing required'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Loading Plan Summary */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl mb-4">Loading Plan by Destination</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-lg border-l-4 border-emerald-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-emerald-400">Singapore</span>
              <span className="text-2xl text-emerald-400">
                {assignments.filter(a => a.destination === 'Singapore').length}
              </span>
            </div>
            <div className="text-sm text-slate-400">
              {assignments.filter(a => a.destination === 'Singapore').reduce((sum, a) => sum + a.weight, 0).toFixed(1)}t total
            </div>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg border-l-4 border-yellow-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-yellow-400">Dubai</span>
              <span className="text-2xl text-yellow-400">
                {assignments.filter(a => a.destination === 'Dubai').length}
              </span>
            </div>
            <div className="text-sm text-slate-400">
              {assignments.filter(a => a.destination === 'Dubai').reduce((sum, a) => sum + a.weight, 0).toFixed(1)}t total
            </div>
          </div>
          <div className="p-4 bg-slate-800/50 rounded-lg border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <span className="text-orange-400">Shanghai</span>
              <span className="text-2xl text-orange-400">
                {assignments.filter(a => a.destination === 'Shanghai').length}
              </span>
            </div>
            <div className="text-sm text-slate-400">
              {assignments.filter(a => a.destination === 'Shanghai').reduce((sum, a) => sum + a.weight, 0).toFixed(1)}t total
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
