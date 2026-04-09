import { useState } from 'react';
import { FileText, AlertTriangle, CheckCircle, X, Clock, Package, Shield, Search, Filter, Eye } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Container {
  id: string;
  type: string;
  status: 'pending' | 'approved' | 'inspection' | 'hold' | 'cleared';
  priority: 'High' | 'Normal' | 'Low';
  origin: string;
  destination: string;
  weight: number;
  declaredValue: number;
  documents: string[];
  submittedDate: string;
  shipper: string;
  consignee: string;
  hsCode: string;
  contents: string;
  riskLevel: 'Low' | 'Medium' | 'High';
}

export default function CustomClearance() {
  const [selectedContainer, setSelectedContainer] = useState<Container | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const [containers, setContainers] = useState<Container[]>([
    {
      id: 'TCLU3456789',
      type: 'Standard 20ft',
      status: 'pending',
      priority: 'High',
      origin: 'Singapore',
      destination: 'Dhaka',
      weight: 22500,
      declaredValue: 125000,
      documents: ['Bill of Lading', 'Invoice', 'Packing List', 'Certificate of Origin'],
      submittedDate: '2025-01-15 10:30',
      shipper: 'Global Traders Ltd',
      consignee: 'BD Import Corp',
      hsCode: '8471.30.00',
      contents: 'Electronic Equipment',
      riskLevel: 'Medium'
    },
    {
      id: 'YMMU8901234',
      type: 'Reefer 40ft',
      status: 'pending',
      priority: 'High',
      origin: 'Dubai',
      destination: 'Chittagong',
      weight: 24800,
      declaredValue: 280000,
      documents: ['Bill of Lading', 'Invoice', 'Packing List', 'Health Certificate', 'Phytosanitary Certificate'],
      submittedDate: '2025-01-15 09:15',
      shipper: 'MedPharma International',
      consignee: 'Healthcare Solutions BD',
      hsCode: '3004.90.00',
      contents: 'Pharmaceutical Products',
      riskLevel: 'High'
    },
    {
      id: 'MAEU5678901',
      type: 'Standard 40ft',
      status: 'inspection',
      priority: 'Normal',
      origin: 'Shanghai',
      destination: 'Dhaka',
      weight: 28300,
      declaredValue: 95000,
      documents: ['Bill of Lading', 'Invoice', 'Packing List'],
      submittedDate: '2025-01-14 16:45',
      shipper: 'China Exports Inc',
      consignee: 'Bangladesh Wholesale',
      hsCode: '6204.42.00',
      contents: 'Textile Products',
      riskLevel: 'Low'
    },
    {
      id: 'CSQU2345678',
      type: 'Standard 20ft',
      status: 'hold',
      priority: 'High',
      origin: 'Mumbai',
      destination: 'Sylhet',
      weight: 19500,
      declaredValue: 45000,
      documents: ['Bill of Lading', 'Invoice'],
      submittedDate: '2025-01-14 11:20',
      shipper: 'India Trade Co',
      consignee: 'BD Commerce Ltd',
      hsCode: '8708.29.00',
      contents: 'Automotive Parts',
      riskLevel: 'Medium'
    },
    {
      id: 'HLCU9012345',
      type: 'Standard 40ft',
      status: 'approved',
      priority: 'Normal',
      origin: 'Colombo',
      destination: 'Dhaka',
      weight: 26700,
      declaredValue: 78000,
      documents: ['Bill of Lading', 'Invoice', 'Packing List', 'Certificate of Origin'],
      submittedDate: '2025-01-15 08:00',
      shipper: 'Lanka Exports',
      consignee: 'BD Retailers',
      hsCode: '0901.21.00',
      contents: 'Coffee & Tea',
      riskLevel: 'Low'
    },
    {
      id: 'OOLU4567890',
      type: 'Reefer 20ft',
      status: 'pending',
      priority: 'Normal',
      origin: 'Bangkok',
      destination: 'Chittagong',
      weight: 18200,
      declaredValue: 62000,
      documents: ['Bill of Lading', 'Invoice', 'Packing List', 'Health Certificate'],
      submittedDate: '2025-01-15 12:15',
      shipper: 'Thai Fresh Exports',
      consignee: 'BD Fresh Foods',
      hsCode: '0803.90.00',
      contents: 'Fresh Fruits',
      riskLevel: 'Low'
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/50' };
      case 'pending': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50' };
      case 'inspection': return { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/50' };
      case 'hold': return { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/50' };
      case 'cleared': return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/50' };
      default: return { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/50' };
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-400';
      case 'Normal': return 'text-blue-400';
      case 'Low': return 'text-slate-400';
      default: return 'text-slate-400';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'High': return { bg: 'bg-red-500/20', text: 'text-red-400' };
      case 'Medium': return { bg: 'bg-orange-500/20', text: 'text-orange-400' };
      case 'Low': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400' };
      default: return { bg: 'bg-slate-500/20', text: 'text-slate-400' };
    }
  };

  const handleApprove = (container: Container) => {
    setContainers(prev => prev.map(c => 
      c.id === container.id ? { ...c, status: 'approved' as const } : c
    ));
    toast.success('Clearance Approved', {
      description: `Container ${container.id} has been cleared for release`,
    });
    setShowDetails(false);
  };

  const handleFlagInspection = (container: Container) => {
    setContainers(prev => prev.map(c => 
      c.id === container.id ? { ...c, status: 'inspection' as const } : c
    ));
    toast.warning('Flagged for Inspection', {
      description: `Container ${container.id} has been marked for physical inspection`,
    });
    setShowDetails(false);
  };

  const handlePlaceHold = (container: Container) => {
    setContainers(prev => prev.map(c => 
      c.id === container.id ? { ...c, status: 'hold' as const } : c
    ));
    toast.error('Placed on Hold', {
      description: `Container ${container.id} has been placed on customs hold`,
    });
    setShowDetails(false);
  };

  const filteredContainers = containers.filter(container => {
    const matchesStatus = filterStatus === 'all' || container.status === filterStatus;
    const matchesSearch = container.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         container.shipper.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         container.contents.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const stats = {
    pending: containers.filter(c => c.status === 'pending').length,
    approved: containers.filter(c => c.status === 'approved').length,
    inspection: containers.filter(c => c.status === 'inspection').length,
    hold: containers.filter(c => c.status === 'hold').length,
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl mb-2">Custom Clearance</h2>
          <p className="text-slate-400 text-sm sm:text-base">Review and process container clearance requests</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Clock className="w-5 h-5 text-yellow-400 mb-2" />
          <div className="text-2xl text-yellow-400 mb-1">{stats.pending}</div>
          <div className="text-slate-400 text-sm">Pending Review</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <CheckCircle className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl text-emerald-400 mb-1">{stats.approved}</div>
          <div className="text-slate-400 text-sm">Approved</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-orange-400 mb-2" />
          <div className="text-2xl text-orange-400 mb-1">{stats.inspection}</div>
          <div className="text-slate-400 text-sm">For Inspection</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Shield className="w-5 h-5 text-red-400 mb-2" />
          <div className="text-2xl text-red-400 mb-1">{stats.hold}</div>
          <div className="text-slate-400 text-sm">On Hold</div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by container ID, shipper, or contents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-100 text-sm focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="inspection">Inspection</option>
              <option value="hold">On Hold</option>
            </select>
          </div>
        </div>
      </div>

      {/* Containers Table */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl mb-4">Clearance Queue ({filteredContainers.length})</h3>
        
        {/* Desktop Table View */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                <th className="px-4 py-3 text-left text-slate-400 text-sm whitespace-nowrap">Container ID</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm whitespace-nowrap">Type</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm whitespace-nowrap">Contents</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm whitespace-nowrap">Shipper</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm whitespace-nowrap">Priority</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm whitespace-nowrap">Risk</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm whitespace-nowrap">Status</th>
                <th className="px-4 py-3 text-left text-slate-400 text-sm whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContainers.map((container) => {
                const statusColors = getStatusColor(container.status);
                const riskColors = getRiskColor(container.riskLevel);
                
                return (
                  <tr
                    key={container.id}
                    className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-4 py-3 text-slate-200 font-mono text-sm whitespace-nowrap">{container.id}</td>
                    <td className="px-4 py-3 text-slate-300 text-sm whitespace-nowrap">{container.type}</td>
                    <td className="px-4 py-3 text-slate-300 text-sm whitespace-nowrap">{container.contents}</td>
                    <td className="px-4 py-3 text-slate-300 text-sm whitespace-nowrap">{container.shipper}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`text-sm ${getPriorityColor(container.priority)}`}>
                        {container.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs ${riskColors.bg} ${riskColors.text}`}>
                        {container.riskLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs ${statusColors.bg} ${statusColors.text}`}>
                        {container.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedContainer(container);
                          setShowDetails(true);
                        }}
                        className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors text-sm flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" />
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-3">
          {filteredContainers.map((container) => {
            const statusColors = getStatusColor(container.status);
            const riskColors = getRiskColor(container.riskLevel);
            
            return (
              <div
                key={container.id}
                className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 space-y-3"
              >
                {/* Container ID & Status */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Container ID</div>
                    <div className="text-slate-200 font-mono text-sm">{container.id}</div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${statusColors.bg} ${statusColors.text} whitespace-nowrap`}>
                    {container.status}
                  </span>
                </div>

                {/* Type & Contents */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Type</div>
                    <div className="text-slate-300 text-sm">{container.type}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400 mb-1">Contents</div>
                    <div className="text-slate-300 text-sm">{container.contents}</div>
                  </div>
                </div>

                {/* Shipper */}
                <div>
                  <div className="text-xs text-slate-400 mb-1">Shipper</div>
                  <div className="text-slate-300 text-sm">{container.shipper}</div>
                </div>

                {/* Priority, Risk, Actions */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-700">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">Priority:</span>
                      <span className={`text-xs ${getPriorityColor(container.priority)}`}>
                        {container.priority}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-slate-400">Risk:</span>
                      <span className={`px-2 py-0.5 rounded text-xs ${riskColors.bg} ${riskColors.text}`}>
                        {container.riskLevel}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedContainer(container);
                      setShowDetails(true);
                    }}
                    className="px-3 py-1.5 bg-blue-500/20 text-blue-400 rounded hover:bg-blue-500/30 transition-colors text-xs flex items-center gap-1 whitespace-nowrap"
                  >
                    <Eye className="w-3 h-3" />
                    Review
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Container Details Modal */}
      {showDetails && selectedContainer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-blue-500/50 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="sticky top-0 bg-slate-900 border-b border-slate-800 p-4 sm:p-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl text-blue-400">Container Clearance Review</h3>
                <p className="text-sm text-slate-400 mt-1">ID: {selectedContainer.id}</p>
              </div>
              <button
                onClick={() => setShowDetails(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-6">
              {/* Status & Priority */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="text-slate-400 text-sm mb-2">Current Status</div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(selectedContainer.status).bg} ${getStatusColor(selectedContainer.status).text}`}>
                    {selectedContainer.status.toUpperCase()}
                  </span>
                </div>
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="text-slate-400 text-sm mb-2">Priority Level</div>
                  <span className={`text-lg ${getPriorityColor(selectedContainer.priority)}`}>
                    {selectedContainer.priority}
                  </span>
                </div>
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="text-slate-400 text-sm mb-2">Risk Assessment</div>
                  <span className={`px-3 py-1 rounded-full text-sm ${getRiskColor(selectedContainer.riskLevel).bg} ${getRiskColor(selectedContainer.riskLevel).text}`}>
                    {selectedContainer.riskLevel} Risk
                  </span>
                </div>
              </div>

              {/* Container Information */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sm:p-6">
                <h4 className="text-lg mb-4 text-slate-200 flex items-center gap-2">
                  <Package className="w-5 h-5 text-blue-400" />
                  Container Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-slate-400 text-sm mb-1">Container Type</div>
                    <div className="text-slate-200">{selectedContainer.type}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm mb-1">Contents</div>
                    <div className="text-slate-200">{selectedContainer.contents}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm mb-1">HS Code</div>
                    <div className="text-slate-200 font-mono">{selectedContainer.hsCode}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm mb-1">Weight</div>
                    <div className="text-slate-200">{selectedContainer.weight.toLocaleString()} kg</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm mb-1">Origin</div>
                    <div className="text-slate-200">{selectedContainer.origin}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm mb-1">Destination</div>
                    <div className="text-slate-200">{selectedContainer.destination}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm mb-1">Declared Value</div>
                    <div className="text-emerald-400">${selectedContainer.declaredValue.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm mb-1">Submitted Date</div>
                    <div className="text-slate-200">{selectedContainer.submittedDate}</div>
                  </div>
                </div>
              </div>

              {/* Party Information */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sm:p-6">
                <h4 className="text-lg mb-4 text-slate-200">Party Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-slate-400 text-sm mb-1">Shipper</div>
                    <div className="text-slate-200">{selectedContainer.shipper}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-sm mb-1">Consignee</div>
                    <div className="text-slate-200">{selectedContainer.consignee}</div>
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 sm:p-6">
                <h4 className="text-lg mb-4 text-slate-200 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-emerald-400" />
                  Submitted Documents
                </h4>
                <div className="space-y-2">
                  {selectedContainer.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="text-slate-300">{doc}</span>
                      </div>
                      <span className="text-emerald-400 text-sm">✓ Verified</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-slate-800 pt-6">
                <h4 className="text-lg mb-4 text-slate-200">Clearance Actions</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button
                    onClick={() => handleApprove(selectedContainer)}
                    disabled={selectedContainer.status === 'approved'}
                    className="p-4 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 rounded-lg transition-colors flex flex-col items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <CheckCircle className="w-6 h-6" />
                    <span>Approve Clearance</span>
                    <span className="text-xs text-slate-400">Release for pickup</span>
                  </button>
                  <button
                    onClick={() => handleFlagInspection(selectedContainer)}
                    disabled={selectedContainer.status === 'inspection'}
                    className="p-4 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/50 rounded-lg transition-colors flex flex-col items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <AlertTriangle className="w-6 h-6" />
                    <span>Flag for Inspection</span>
                    <span className="text-xs text-slate-400">Physical examination</span>
                  </button>
                  <button
                    onClick={() => handlePlaceHold(selectedContainer)}
                    disabled={selectedContainer.status === 'hold'}
                    className="p-4 bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/50 rounded-lg transition-colors flex flex-col items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Shield className="w-6 h-6" />
                    <span>Place on Hold</span>
                    <span className="text-xs text-slate-400">Suspend clearance</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}