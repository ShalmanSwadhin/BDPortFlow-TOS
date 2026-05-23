import { useState } from 'react';
import { Grid3x3, Package, AlertTriangle, TrendingUp, Filter } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function YardDensity() {
  const [selectedBlock, setSelectedBlock] = useState<any>(null);
  const [filterType, setFilterType] = useState('all');
  const [showBlockDetails, setShowBlockDetails] = useState(false);
  const [showOptimize, setShowOptimize] = useState(false);

  // Yard blocks with density data
  const blocks = [
    { id: 'A', capacity: 120, occupied: 108, type: 'mixed', avgAge: 3, density: 90 },
    { id: 'B', capacity: 100, occupied: 45, type: 'export', avgAge: 1, density: 45 },
    { id: 'C', capacity: 80, occupied: 76, type: 'reefer', avgAge: 2, density: 95 },
    { id: 'D', capacity: 150, occupied: 135, type: 'import', avgAge: 5, density: 90 },
    { id: 'E', capacity: 100, occupied: 85, type: 'mixed', avgAge: 4, density: 85 },
    { id: 'F', capacity: 120, occupied: 60, type: 'export', avgAge: 2, density: 50 },
    { id: 'G', capacity: 90, occupied: 88, type: 'import', avgAge: 6, density: 98 },
    { id: 'H', capacity: 110, occupied: 77, type: 'mixed', avgAge: 3, density: 70 },
  ];

  const getDensityColor = (density: number) => {
    if (density >= 90) return { bg: '#ef4444', text: 'text-red-400', level: 'Critical' };
    if (density >= 75) return { bg: '#ff6b35', text: 'text-orange-400', level: 'High' };
    if (density >= 50) return { bg: '#ffd700', text: 'text-yellow-400', level: 'Medium' };
    return { bg: '#00ff88', text: 'text-emerald-400', level: 'Low' };
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'import': return '#00d4ff';
      case 'export': return '#00ff88';
      case 'reefer': return '#a855f7';
      case 'mixed': return '#ffd700';
      default: return '#64748b';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl mb-2">Yard Density Heatmap</h2>
          <p className="text-slate-400 text-sm sm:text-base">Real-time capacity monitoring and optimization</p>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 sm:px-4 py-2 bg-slate-900/50 border border-slate-800 rounded-lg text-slate-100 text-sm sm:text-base focus:outline-none focus:border-emerald-500 flex-1 sm:flex-initial"
          >
            <option value="all">All Types</option>
            <option value="import">Import Only</option>
            <option value="export">Export Only</option>
            <option value="reefer">Reefer Only</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Grid3x3 className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl text-blue-400 mb-1">8</div>
          <div className="text-slate-400 text-sm">Total Blocks</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Package className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl text-emerald-400 mb-1">674</div>
          <div className="text-slate-400 text-sm">Total Containers</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <TrendingUp className="w-5 h-5 text-orange-400 mb-2" />
          <div className="text-2xl text-orange-400 mb-1">77%</div>
          <div className="text-slate-400 text-sm">Avg Density</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-red-400 mb-2" />
          <div className="text-2xl text-red-400 mb-1">3</div>
          <div className="text-slate-400 text-sm">Critical Blocks</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 sm:p-6">
          <div className="flex items-center justify-between gap-2 mb-4">
            <h3 className="text-base sm:text-lg lg:text-xl truncate">Yard Heatmap - Top View</h3>
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              <Filter className="w-4 h-4 text-slate-400" />
              <span className="text-xs sm:text-sm text-slate-400 whitespace-nowrap">Live View</span>
            </div>
          </div>

          {/* Heatmap Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4 lg:gap-5">
            {blocks.map((block) => {
              const densityColors = getDensityColor(block.density);
              const isSelected = selectedBlock?.id === block.id;

              return (
                <div
                  key={block.id}
                  onClick={() => setSelectedBlock(block)}
                  className={`relative aspect-square cursor-pointer transition-all hover:scale-105 ${
                    isSelected ? 'scale-105 ring-4 ring-emerald-400' : ''
                  }`}
                >
                  {/* Block Card */}
                  <div
                    className="absolute inset-0 rounded-xl p-2 md:p-3 flex flex-col overflow-hidden"
                    style={{
                      backgroundColor: `${densityColors.bg}40`,
                      borderWidth: '2px',
                      borderStyle: 'solid',
                      borderColor: densityColors.bg,
                    }}
                  >
                    {/* Block ID */}
                    <div className="flex items-center justify-between mb-1 min-h-0 flex-shrink-0">
                      <span className="text-[10px] md:text-xs xl:text-sm text-white leading-none truncate pr-1">Block {block.id}</span>
                      {block.density >= 90 && (
                        <AlertTriangle className="w-3 h-3 md:w-3.5 md:h-3.5 text-white animate-pulse flex-shrink-0" />
                      )}
                    </div>

                    {/* Density Percentage - Centered section */}
                    <div className="flex-1 flex flex-col items-center justify-center min-h-0 overflow-hidden">
                      <div className="text-lg md:text-xl xl:text-2xl text-white leading-none mb-0.5">{block.density}%</div>
                      <div className="text-[9px] md:text-[10px] xl:text-xs text-white/70 leading-none truncate max-w-full px-0.5">{densityColors.level}</div>
                    </div>

                    {/* Capacity Info - Fixed at bottom */}
                    <div className="text-[9px] md:text-[10px] xl:text-xs text-white/80 text-center mt-1 leading-none truncate flex-shrink-0">
                      {block.occupied}/{block.capacity}
                    </div>
                  </div>

                  {/* Type Badge */}
                  <div
                    className="absolute -top-1.5 -right-1.5 md:-top-2 md:-right-2 px-1 md:px-1.5 py-0.5 rounded text-[8px] md:text-[9px] xl:text-[10px] text-white shadow-lg truncate max-w-[55%] leading-tight"
                    style={{ backgroundColor: getTypeColor(block.type) }}
                  >
                    {block.type}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <div className="text-sm text-slate-400 mb-2">Density Level</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#00ff88' }}></div>
                  <span className="text-xs text-slate-400">Low (0-49%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ffd700' }}></div>
                  <span className="text-xs text-slate-400">Medium (50-74%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ff6b35' }}></div>
                  <span className="text-xs text-slate-400">High (75-89%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ef4444' }}></div>
                  <span className="text-xs text-slate-400">Critical (90%+)</span>
                </div>
              </div>
            </div>
            <div>
              <div className="text-sm text-slate-400 mb-2">Block Type</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#00d4ff' }}></div>
                  <span className="text-xs text-slate-400">Import</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#00ff88' }}></div>
                  <span className="text-xs text-slate-400">Export</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#a855f7' }}></div>
                  <span className="text-xs text-slate-400">Reefer</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ffd700' }}></div>
                  <span className="text-xs text-slate-400">Mixed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Block Details & Recommendations */}
        <div className="space-y-6">
          {/* Selected Block Details */}
          <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl mb-4">
              {selectedBlock ? `Block ${selectedBlock.id}` : 'Select Block'}
            </h3>

            {selectedBlock ? (
              <div className="space-y-4">
                {/* Status Badge */}
                <div
                  className="p-4 rounded-lg border-2"
                  style={{
                    backgroundColor: `${getDensityColor(selectedBlock.density).bg}20`,
                    borderColor: getDensityColor(selectedBlock.density).bg,
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-300">Density Level</span>
                    <span className={getDensityColor(selectedBlock.density).text}>
                      {getDensityColor(selectedBlock.density).level}
                    </span>
                  </div>
                  <div className="text-3xl" style={{ color: getDensityColor(selectedBlock.density).bg }}>
                    {selectedBlock.density}%
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400">Occupied</span>
                    <span className="text-slate-200">{selectedBlock.occupied}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400">Capacity</span>
                    <span className="text-slate-200">{selectedBlock.capacity}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400">Available</span>
                    <span className="text-emerald-400">{selectedBlock.capacity - selectedBlock.occupied}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400">Type</span>
                    <span
                      className="px-2 py-1 rounded text-sm"
                      style={{
                        backgroundColor: `${getTypeColor(selectedBlock.type)}30`,
                        color: getTypeColor(selectedBlock.type),
                      }}
                    >
                      {selectedBlock.type}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                    <span className="text-slate-400">Avg Dwell Time</span>
                    <span className="text-slate-200">{selectedBlock.avgAge} days</span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-slate-400">Capacity Usage</span>
                    <span className="text-slate-300">{selectedBlock.occupied}/{selectedBlock.capacity}</span>
                  </div>
                  <div className="h-4 bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${selectedBlock.density}%`,
                        backgroundColor: getDensityColor(selectedBlock.density).bg,
                      }}
                    ></div>
                  </div>
                </div>

                {/* Recommendations */}
                {selectedBlock.density >= 85 && (
                  <div className="p-4 bg-orange-500/10 border border-orange-500/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-orange-400">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm">Capacity Warning</span>
                    </div>
                    <p className="text-xs text-slate-400 mb-3">
                      This block is approaching maximum capacity. Consider:
                    </p>
                    <ul className="text-xs text-slate-400 space-y-1">
                      <li>• Relocate older containers to Block B or F</li>
                      <li>• Expedite outbound processing</li>
                      <li>• Restrict new incoming containers</li>
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  <button
                    onClick={() => setShowBlockDetails(true)}
                    className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 rounded-lg transition-colors"
                  >
                    View Block Details
                  </button>
                  <button
                    onClick={() => setShowOptimize(true)}
                    className="w-full px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 rounded-lg transition-colors"
                  >
                    Optimize Placement
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-96 flex flex-col items-center justify-center text-slate-500">
                <Grid3x3 className="w-16 h-16 mb-4 opacity-20" />
                <p>Click a block to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Capacity Summary Table */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl mb-4">Capacity Summary</h3>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-slate-400 text-sm">Block</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm">Type</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm">Occupied</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm">Capacity</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm">Density</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm">Avg Age</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm">Status</th>
              </tr>
            </thead>
            <tbody>
              {blocks.map((block) => {
                const densityColors = getDensityColor(block.density);
                
                return (
                  <tr
                    key={block.id}
                    className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors cursor-pointer"
                    onClick={() => setSelectedBlock(block)}
                  >
                    <td className="px-4 py-3 text-slate-200">Block {block.id}</td>
                    <td className="px-4 py-3">
                      <span
                        className="px-2 py-1 rounded text-xs"
                        style={{
                          backgroundColor: `${getTypeColor(block.type)}30`,
                          color: getTypeColor(block.type),
                        }}
                      >
                        {block.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{block.occupied}</td>
                    <td className="px-4 py-3 text-slate-300">{block.capacity}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden max-w-[80px]">
                          <div
                            className="h-full"
                            style={{
                              width: `${block.density}%`,
                              backgroundColor: densityColors.bg,
                            }}
                          ></div>
                        </div>
                        <span className={densityColors.text}>{block.density}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{block.avgAge}d</td>
                    <td className="px-4 py-3">
                      <span className={`text-sm ${densityColors.text}`}>
                        {densityColors.level}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Block Details Modal */}
      {showBlockDetails && selectedBlock && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-blue-500/50 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-4 sm:p-6">
            <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg lg:text-xl text-blue-400 truncate">Block {selectedBlock.id} - Detailed View</h3>
              <button
                onClick={() => setShowBlockDetails(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <span className="text-slate-400 text-xl">×</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                <div className="text-slate-400 text-sm mb-1">Total Capacity</div>
                <div className="text-2xl text-slate-100">{selectedBlock.capacity}</div>
              </div>
              <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                <div className="text-slate-400 text-sm mb-1">Occupied</div>
                <div className="text-2xl text-emerald-400">{selectedBlock.occupied}</div>
              </div>
              <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                <div className="text-slate-400 text-sm mb-1">Available</div>
                <div className="text-2xl text-blue-400">{selectedBlock.capacity - selectedBlock.occupied}</div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6">
              <h4 className="text-base sm:text-lg mb-4 text-slate-200">Container Distribution</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Standard Containers</span>
                  <div className="flex items-center gap-3">
                    <div className="w-48 bg-slate-700 rounded-full h-2">
                      <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-slate-300 w-12 text-right">70</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Reefer Containers</span>
                  <div className="flex items-center gap-3">
                    <div className="w-48 bg-slate-700 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                    <span className="text-slate-300 w-12 text-right">27</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Hazmat Containers</span>
                  <div className="flex items-center gap-3">
                    <div className="w-48 bg-slate-700 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                    <span className="text-slate-300 w-12 text-right">11</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sm:p-6">
              <h4 className="text-base sm:text-lg mb-4 text-slate-200">Recent Activity</h4>
              <div className="space-y-3">
                {[
                  { time: '15 min ago', action: 'Container added', id: 'TCLU3456789' },
                  { time: '1 hour ago', action: 'Container removed', id: 'YMMU8901234' },
                  { time: '2 hours ago', action: 'Container moved', id: 'MAEU5678901' },
                  { time: '3 hours ago', action: 'Container added', id: 'CSQU2345678' },
                ].map((activity, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                    <div>
                      <div className="text-slate-200 text-sm">{activity.action}</div>
                      <div className="text-slate-500 text-xs">{activity.id}</div>
                    </div>
                    <div className="text-slate-500 text-xs">{activity.time}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-4 sm:mt-6">
              <button
                onClick={() => setShowBlockDetails(false)}
                className="px-4 sm:px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm sm:text-base"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Optimize Placement Modal */}
      {showOptimize && selectedBlock && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-emerald-500/50 rounded-xl max-w-3xl w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="flex items-center justify-between gap-2 mb-4 sm:mb-6">
              <h3 className="text-base sm:text-lg lg:text-xl text-emerald-400 truncate">Optimize Block {selectedBlock.id}</h3>
              <button
                onClick={() => setShowOptimize(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <span className="text-slate-400 text-xl">×</span>
              </button>
            </div>

            <div className="space-y-4 mb-4 sm:mb-6">
              <div className="p-3 sm:p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-sm sm:text-base text-emerald-400 mb-1">Consolidate Similar Types</h4>
                    <p className="text-sm text-slate-400">Group containers by type to improve efficiency</p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full">Recommended</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>• Expected improvement: +15% efficiency</div>
                  <div>• Moves required: 12</div>
                  <div>• Estimated time: 45 minutes</div>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-sm sm:text-base text-blue-400 mb-1">Priority-Based Stacking</h4>
                    <p className="text-sm text-slate-400">Place high-priority containers on top</p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full">High Impact</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>• Retrieval time reduction: 30%</div>
                  <div>• Moves required: 18</div>
                  <div>• Estimated time: 1 hour</div>
                </div>
              </div>

              <div className="p-3 sm:p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                <div className="flex flex-col sm:flex-row items-start justify-between gap-2 mb-3">
                  <div>
                    <h4 className="text-sm sm:text-base text-yellow-400 mb-1">Load Balance</h4>
                    <p className="text-sm text-slate-400">Distribute weight evenly across the block</p>
                  </div>
                  <span className="text-xs px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">Safety</span>
                </div>
                <div className="text-xs text-slate-400 space-y-1">
                  <div>• Safety improvement: +25%</div>
                  <div>• Moves required: 8</div>
                  <div>• Estimated time: 30 minutes</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
              <button
                onClick={() => setShowOptimize(false)}
                className="px-4 sm:px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  toast.success('Optimization plan created!', {
                    description: `Block ${selectedBlock.id} placement optimized - Ready to execute`,
                  });
                  setShowOptimize(false);
                }}
                className="px-4 sm:px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm sm:text-base"
              >
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}