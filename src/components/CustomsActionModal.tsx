import { X, CheckCircle, AlertTriangle, XCircle, Package, Ship, Users } from 'lucide-react';
import { useState } from 'react';

interface CustomsActionModalProps {
  onClose: () => void;
  actionType: 'approve' | 'flag' | 'hold';
}

export default function CustomsActionModal({ onClose, actionType }: CustomsActionModalProps) {
  const [selectedContainer, setSelectedContainer] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  // Mock pending containers data
  const pendingContainers = [
    {
      id: 'TCLU3456789',
      shipper: 'Global Trade Inc.',
      cargoType: 'Electronics',
      weight: '12.5 tons',
      origin: 'Singapore',
      vessel: 'MV OCEAN STAR',
      risk: 'Low',
      documents: 'Complete'
    },
    {
      id: 'YMMU8901234',
      shipper: 'Industrial Supplies Ltd.',
      cargoType: 'Machinery Parts',
      weight: '18.2 tons',
      origin: 'Dubai',
      vessel: 'MV PACIFIC WAVE',
      risk: 'Medium',
      documents: 'Complete'
    },
    {
      id: 'MAEU5678901',
      shipper: 'Food Imports Co.',
      cargoType: 'Frozen Goods',
      weight: '15.8 tons',
      origin: 'Thailand',
      vessel: 'MV CORAL EXPRESS',
      risk: 'Low',
      documents: 'Pending Review'
    },
    {
      id: 'CSNU2345678',
      shipper: 'Chemical Solutions',
      cargoType: 'Industrial Chemicals',
      weight: '20.0 tons',
      origin: 'South Korea',
      vessel: 'MV BRIGHT HORIZON',
      risk: 'High',
      documents: 'Complete'
    },
    {
      id: 'HLBU9876543',
      shipper: 'Textile Exports',
      cargoType: 'Garments',
      weight: '8.5 tons',
      origin: 'India',
      vessel: 'MV TRADE WIND',
      risk: 'Low',
      documents: 'Complete'
    }
  ];

  const getActionConfig = () => {
    switch (actionType) {
      case 'approve':
        return {
          title: 'Approve Clearance',
          icon: CheckCircle,
          color: 'emerald',
          buttonText: 'Approve',
          description: 'Select a container to approve for customs clearance'
        };
      case 'flag':
        return {
          title: 'Flag for Inspection',
          icon: AlertTriangle,
          color: 'orange',
          buttonText: 'Flag',
          description: 'Select a container to flag for physical inspection'
        };
      case 'hold':
        return {
          title: 'Place on Hold',
          icon: XCircle,
          color: 'red',
          buttonText: 'Place Hold',
          description: 'Select a container to place on customs hold'
        };
    }
  };

  const config = getActionConfig();
  const Icon = config.icon;

  const handleSubmit = () => {
    if (!selectedContainer) return;
    
    setShowSuccess(true);
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  if (showSuccess) {
    return (
      <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 max-w-md w-full text-center">
          <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-${config.color}-500/20 flex items-center justify-center`}>
            <Icon className={`w-10 h-10 text-${config.color}-400`} />
          </div>
          <h2 className="text-2xl mb-3">Action Completed</h2>
          <p className="text-slate-400">
            Container <span className="text-slate-200 font-mono">{selectedContainer}</span> has been successfully {actionType === 'approve' ? 'approved' : actionType === 'flag' ? 'flagged for inspection' : 'placed on hold'}.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`bg-gradient-to-r from-${config.color}-500/20 to-${config.color}-600/20 border-b border-${config.color}-500/30 p-6`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-4">
              <div className={`p-3 bg-${config.color}-500/20 rounded-xl`}>
                <Icon className={`w-6 h-6 text-${config.color}-400`} />
              </div>
              <div>
                <h2 className="text-2xl mb-1">{config.title}</h2>
                <p className="text-slate-400 text-sm">{config.description}</p>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Container List */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-3">
            {pendingContainers.map((container) => (
              <div
                key={container.id}
                onClick={() => setSelectedContainer(container.id)}
                className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedContainer === container.id
                    ? `border-${config.color}-500 bg-${config.color}-500/10`
                    : 'border-slate-700 bg-slate-800/30 hover:border-slate-600'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-700 rounded-lg">
                      <Package className="w-5 h-5 text-slate-300" />
                    </div>
                    <div>
                      <div className="text-lg font-mono mb-1">{container.id}</div>
                      <div className="text-sm text-slate-400">{container.shipper}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      container.risk === 'High' ? 'bg-red-500/20 text-red-400' :
                      container.risk === 'Medium' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {container.risk} Risk
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs ${
                      container.documents === 'Complete' ? 'bg-emerald-500/20 text-emerald-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {container.documents}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Cargo Type</div>
                    <div className="text-sm text-slate-300">{container.cargoType}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Weight</div>
                    <div className="text-sm text-slate-300">{container.weight}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Origin</div>
                    <div className="text-sm text-slate-300">{container.origin}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 mb-1">Vessel</div>
                    <div className="flex items-center gap-1 text-sm text-slate-300">
                      <Ship className="w-3 h-3" />
                      <span className="text-xs">{container.vessel}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes Section */}
        {selectedContainer && (
          <div className="border-t border-slate-700 p-6 bg-slate-800/30">
            <label className="block text-sm text-slate-400 mb-2">
              {actionType === 'approve' ? 'Approval Notes (Optional)' : 
               actionType === 'flag' ? 'Inspection Reason' : 
               'Hold Reason'}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={actionType === 'approve' ? 'Add any notes about this clearance...' :
                          actionType === 'flag' ? 'Specify reason for inspection...' :
                          'Specify reason for hold...'}
              className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:outline-none focus:border-slate-600 resize-none"
              rows={3}
            />
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-slate-700 p-6 bg-slate-800/50 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!selectedContainer}
            className={`px-6 py-3 bg-${config.color}-500 hover:bg-${config.color}-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors font-medium flex items-center gap-2`}
          >
            <Icon className="w-5 h-5" />
            {config.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
