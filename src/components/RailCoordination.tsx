import { useState } from 'react';
import { Train, Package, AlertTriangle, Clock, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export default function RailCoordination() {
  const [selectedTrain, setSelectedTrain] = useState<any>(null);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [newTrain, setNewTrain] = useState({
    trainId: '',
    arrival: '',
    departure: '',
    route: '',
    capacity: '20',
    notes: ''
  });

  const trains = [
    {
      id: 'RT-001',
      arrival: '14:30',
      departure: '16:00',
      status: 'loading',
      progress: 65,
      containers: [
        { id: 'TCLU3456789', status: 'loaded', destination: 'Dhaka', weight: 22.5 },
        { id: 'YMMU8901234', status: 'loaded', destination: 'Dhaka', weight: 24.8 },
        { id: 'MAEU5678901', status: 'loading', destination: 'Dhaka', weight: 20.2 },
        { id: 'CSQU2345678', status: 'pending', destination: 'Dhaka', weight: 23.1 },
        { id: 'HLBU7890123', status: 'pending', destination: 'Dhaka', weight: 25.3 },
      ],
      capacity: 20,
      assigned: 5,
    },
    {
      id: 'RT-002',
      arrival: '16:30',
      departure: '18:00',
      status: 'incoming',
      progress: 0,
      containers: [
        { id: 'TCKU4567890', status: 'assigned', destination: 'Sylhet', weight: 21.7 },
        { id: 'OOLU1234567', status: 'assigned', destination: 'Sylhet', weight: 19.8 },
        { id: 'MSCU8901234', status: 'assigned', destination: 'Sylhet', weight: 24.2 },
      ],
      capacity: 20,
      assigned: 3,
    },
    {
      id: 'RT-003',
      arrival: '18:00',
      departure: '19:30',
      status: 'scheduled',
      progress: 0,
      containers: [],
      capacity: 20,
      assigned: 0,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'loading': return { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/50' };
      case 'incoming': return { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/50' };
      case 'scheduled': return { bg: 'bg-slate-700', text: 'text-slate-400', border: 'border-slate-600' };
      case 'departed': return { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/50' };
      default: return { bg: 'bg-slate-700', text: 'text-slate-400', border: 'border-slate-600' };
    }
  };

  const getContainerStatusColor = (status: string) => {
    switch (status) {
      case 'loaded': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'loading': return 'bg-blue-500/20 text-blue-400 border-blue-500/50';
      case 'pending': return 'bg-slate-700 text-slate-400 border-slate-600';
      case 'assigned': return 'bg-purple-500/20 text-purple-400 border-purple-500/50';
      default: return 'bg-slate-700 text-slate-400 border-slate-600';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl mb-2">Rail Coordination</h2>
          <p className="text-slate-400 text-sm sm:text-base">Train scheduling and container loading management</p>
        </div>
        <button 
          onClick={() => setShowScheduleModal(true)}
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors flex items-center gap-2"
        >
          <Train className="w-4 h-4" />
          Schedule Train
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Train className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl text-blue-400 mb-1">3</div>
          <div className="text-slate-400 text-sm">Active Trains</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Package className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl text-emerald-400 mb-1">8</div>
          <div className="text-slate-400 text-sm">Containers Assigned</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Clock className="w-5 h-5 text-yellow-400 mb-2" />
          <div className="text-2xl text-yellow-400 mb-1">1</div>
          <div className="text-slate-400 text-sm">In Progress</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <AlertTriangle className="w-5 h-5 text-orange-400 mb-2" />
          <div className="text-2xl text-orange-400 mb-1">0</div>
          <div className="text-slate-400 text-sm">Delays</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Train Timeline */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl mb-4">Train Schedule</h3>

          <div className="space-y-4">
            {trains.map((train) => {
              const statusColors = getStatusColor(train.status);
              const isSelected = selectedTrain?.id === train.id;

              return (
                <div
                  key={train.id}
                  onClick={() => setSelectedTrain(train)}
                  className={`p-6 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                    isSelected
                      ? `${statusColors.bg} ${statusColors.border}`
                      : 'bg-slate-800/30 border-slate-700 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-lg ${statusColors.bg}`}>
                        <Train className={`w-6 h-6 ${statusColors.text}`} />
                      </div>
                      <div>
                        <h4 className="text-lg text-slate-200 mb-1">{train.id}</h4>
                        <span className={`text-sm ${statusColors.text} uppercase`}>
                          {train.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-slate-400">Arrival: {train.arrival}</div>
                      <div className="text-sm text-slate-400">Departure: {train.departure}</div>
                    </div>
                  </div>

                  {/* Capacity */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-slate-400">Capacity</span>
                      <span className="text-slate-300">
                        {train.assigned} / {train.capacity} containers
                      </span>
                    </div>
                    <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all"
                        style={{ width: `${(train.assigned / train.capacity) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Loading Progress */}
                  {train.status === 'loading' && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-400">Loading Progress</span>
                        <span className="text-blue-400">{train.progress}%</span>
                      </div>
                      <div className="h-3 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all"
                          style={{ width: `${train.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Container Count by Status */}
                  {train.containers.length > 0 && (
                    <div className="mt-4 flex gap-3 text-xs">
                      <div className="flex items-center gap-1">
                        <CheckCircle className="w-3 h-3 text-emerald-400" />
                        <span className="text-slate-400">
                          {train.containers.filter(c => c.status === 'loaded').length} Loaded
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-blue-400" />
                        <span className="text-slate-400">
                          {train.containers.filter(c => c.status === 'loading').length} Loading
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Package className="w-3 h-3 text-slate-400" />
                        <span className="text-slate-400">
                          {train.containers.filter(c => c.status === 'pending' || c.status === 'assigned').length} Pending
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Train Details */}
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <h3 className="text-xl mb-4">
            {selectedTrain ? `${selectedTrain.id} Details` : 'Select Train'}
          </h3>

          {selectedTrain ? (
            <div className="space-y-4">
              {/* Status Card */}
              <div className={`p-4 rounded-lg border-2 ${getStatusColor(selectedTrain.status).border} ${getStatusColor(selectedTrain.status).bg}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Status</span>
                  <span className={`uppercase text-sm ${getStatusColor(selectedTrain.status).text}`}>
                    {selectedTrain.status}
                  </span>
                </div>
                <div className="text-sm text-slate-400">
                  {selectedTrain.status === 'loading' ? 'Currently loading containers' :
                   selectedTrain.status === 'incoming' ? 'Arriving soon' :
                   selectedTrain.status === 'scheduled' ? 'Awaiting arrival' : 'Status unknown'}
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">Arrival Time</span>
                  <span className="text-slate-200">{selectedTrain.arrival}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-lg">
                  <span className="text-slate-400">Departure Time</span>
                  <span className="text-slate-200">{selectedTrain.departure}</span>
                </div>
              </div>

              {/* Container List */}
              <div>
                <div className="text-sm text-slate-400 mb-3">
                  Assigned Containers ({selectedTrain.containers.length})
                </div>
                {selectedTrain.containers.length > 0 ? (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {selectedTrain.containers.map((container: any, idx: number) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg border ${getContainerStatusColor(container.status)}`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-slate-200">{container.id}</span>
                          {container.status === 'loaded' && (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          )}
                          {container.status === 'loading' && (
                            <Clock className="w-4 h-4 text-blue-400 animate-spin" />
                          )}
                          {container.status === 'pending' && (
                            <Clock className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                        <div className="flex items-center justify-between text-xs text-slate-400">
                          <span>{container.destination}</span>
                          <span>{container.weight}t</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="h-32 flex items-center justify-center text-slate-500 text-sm">
                    No containers assigned yet
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="space-y-2 pt-4">
                {selectedTrain.status === 'scheduled' && (
                  <button 
                    onClick={() => {
                      toast.success('Container assignment started', {
                        description: `Assigning containers to ${selectedTrain.id}`,
                      });
                    }}
                    className="w-full px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 rounded-lg transition-colors"
                  >
                    Assign Containers
                  </button>
                )}
                {selectedTrain.status === 'loading' && (
                  <>
                    <button 
                      onClick={() => {
                        toast.success('Loading completed', {
                          description: `${selectedTrain.id} ready for departure - ${selectedTrain.loaded}/${selectedTrain.capacity} containers loaded`,
                        });
                      }}
                      className="w-full px-4 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 rounded-lg transition-colors"
                    >
                      Complete Loading
                    </button>
                    <button 
                      onClick={() => {
                        toast.warning('Delay reported', {
                          description: `${selectedTrain.id} departure time updated`,
                        });
                      }}
                      className="w-full px-4 py-2 bg-orange-500/20 hover:bg-orange-500/30 text-orange-400 border border-orange-500/50 rounded-lg transition-colors"
                    >
                      Report Delay
                    </button>
                  </>
                )}
                <button
                  onClick={() => setShowFullDetails(true)}
                  className="w-full px-4 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors"
                >
                  View Full Details
                </button>
              </div>
            </div>
          ) : (
            <div className="h-96 flex flex-col items-center justify-center text-slate-500">
              <Train className="w-16 h-16 mb-4 opacity-20" />
              <p>Select a train to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Yard & Ship Sync */}
      <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
        <h3 className="text-xl mb-4">Yard & Ship Synchronization</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <Package className="w-5 h-5 text-blue-400" />
              <span className="text-slate-300">From Yard</span>
            </div>
            <div className="text-2xl text-blue-400 mb-1">142</div>
            <div className="text-sm text-slate-400">Containers ready for rail</div>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <Train className="w-5 h-5 text-emerald-400" />
              <span className="text-slate-300">Rail Transit</span>
            </div>
            <div className="text-2xl text-emerald-400 mb-1">8</div>
            <div className="text-sm text-slate-400">Currently in transit</div>
          </div>

          <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="w-5 h-5 text-purple-400" />
              <span className="text-slate-300">Completed Today</span>
            </div>
            <div className="text-2xl text-purple-400 mb-1">47</div>
            <div className="text-sm text-slate-400">Successful transfers</div>
          </div>
        </div>
      </div>

      {/* Full Details Modal */}
      {showFullDetails && selectedTrain && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/50 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl text-purple-400 mb-1">Rail Service: {selectedTrain.id}</h3>
                <p className="text-sm text-slate-400">Complete Service Details</p>
              </div>
              <button
                onClick={() => setShowFullDetails(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <span className="text-slate-400 text-2xl">×</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Service Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="text-slate-400 text-sm mb-1">Service ID</div>
                  <div className="text-lg text-slate-100">{selectedTrain.id}</div>
                </div>
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="text-slate-400 text-sm mb-1">Route</div>
                  <div className="text-lg text-slate-100">{selectedTrain.route}</div>
                </div>
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="text-slate-400 text-sm mb-1">Operator</div>
                  <div className="text-lg text-slate-100">Bangladesh Railway</div>
                </div>
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="text-slate-400 text-sm mb-1">Status</div>
                  <div className={`text-lg capitalize ${
                    selectedTrain.status === 'loading' ? 'text-yellow-400' :
                    selectedTrain.status === 'departed' ? 'text-emerald-400' : 'text-blue-400'
                  }`}>
                    {selectedTrain.status}
                  </div>
                </div>
              </div>

              {/* Schedule Details */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h4 className="text-lg mb-4 text-slate-200">Schedule Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-slate-500 text-sm mb-1">Arrival Time</div>
                    <div className="text-slate-200 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      {selectedTrain.arrival}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-sm mb-1">Departure Time</div>
                    <div className="text-slate-200 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      {selectedTrain.departure}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 text-sm mb-1">Turnaround Time</div>
                    <div className="text-slate-200">1h 30m</div>
                  </div>
                </div>
              </div>

              {/* Container Manifest */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h4 className="text-lg mb-4 text-slate-200">Container Manifest</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-400 text-sm">Container ID</th>
                        <th className="text-left py-3 px-4 text-slate-400 text-sm">Destination</th>
                        <th className="text-left py-3 px-4 text-slate-400 text-sm">Weight (T)</th>
                        <th className="text-left py-3 px-4 text-slate-400 text-sm">Type</th>
                        <th className="text-left py-3 px-4 text-slate-400 text-sm">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTrain.containers.map((container: any, idx: number) => (
                        <tr key={idx} className="border-b border-slate-800 hover:bg-slate-800/30">
                          <td className="py-3 px-4 text-slate-200 font-mono text-sm">{container.id}</td>
                          <td className="py-3 px-4 text-slate-300">{container.destination}</td>
                          <td className="py-3 px-4 text-slate-300">{container.weight}</td>
                          <td className="py-3 px-4 text-slate-300">40' HC</td>
                          <td className="py-3 px-4">
                            <span className={`px-3 py-1 rounded-full text-xs ${
                              container.status === 'loaded'
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : container.status === 'loading'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-slate-700 text-slate-400'
                            }`}>
                              {container.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Loading Progress */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg text-slate-200">Loading Progress</h4>
                  <span className="text-2xl text-purple-400">{selectedTrain.progress}%</span>
                </div>
                <div className="w-full bg-slate-700 rounded-full h-4 mb-4">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-blue-500 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${selectedTrain.progress}%` }}
                  ></div>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <div className="text-slate-500 mb-1">Total Containers</div>
                    <div className="text-slate-200">{selectedTrain.containers.length}</div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Loaded</div>
                    <div className="text-emerald-400">
                      {selectedTrain.containers.filter((c: any) => c.status === 'loaded').length}
                    </div>
                  </div>
                  <div>
                    <div className="text-slate-500 mb-1">Pending</div>
                    <div className="text-yellow-400">
                      {selectedTrain.containers.filter((c: any) => c.status === 'pending').length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Operations Team */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h4 className="text-lg mb-4 text-slate-200">Operations Team</h4>
                <div className="space-y-3">
                  {[
                    { name: 'Kamal Hossain', role: 'Loading Supervisor', contact: '+880 1712-345678', status: 'On duty' },
                    { name: 'Rafiq Ahmed', role: 'Crane Operator', contact: '+880 1812-345679', status: 'On duty' },
                    { name: 'Jamal Uddin', role: 'Safety Officer', contact: '+880 1912-345680', status: 'On duty' },
                  ].map((member, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                      <div>
                        <div className="text-slate-200">{member.name}</div>
                        <div className="text-sm text-slate-500">{member.role}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-400">{member.contact}</div>
                        <div className="text-xs text-emerald-400">{member.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Safety Checks */}
              <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-6">
                <h4 className="text-lg mb-4 text-slate-200">Safety Checks</h4>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { item: 'Weight Distribution', status: 'passed' },
                    { item: 'Container Security', status: 'passed' },
                    { item: 'Track Clearance', status: 'passed' },
                    { item: 'Brake System', status: 'passed' },
                  ].map((check, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                      <span className="text-slate-300">{check.item}</span>
                      <div className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-400 text-sm capitalize">{check.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-between">
              <button className="px-6 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/50 rounded-lg transition-colors">
                Export Report
              </button>
              <button
                onClick={() => setShowFullDetails(false)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Schedule Train Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-purple-500/50 rounded-xl max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-800 flex items-center justify-between">
              <div>
                <h3 className="text-xl text-purple-400 mb-1">Schedule New Train</h3>
                <p className="text-sm text-slate-400">Enter Train Details</p>
              </div>
              <button
                onClick={() => setShowScheduleModal(false)}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <span className="text-slate-400 text-2xl">×</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Train Details Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="text-slate-400 text-sm mb-1">Train ID</div>
                  <input
                    type="text"
                    value={newTrain.trainId}
                    onChange={(e) => setNewTrain({ ...newTrain, trainId: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="text-slate-400 text-sm mb-1">Route</div>
                  <input
                    type="text"
                    value={newTrain.route}
                    onChange={(e) => setNewTrain({ ...newTrain, route: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="text-slate-400 text-sm mb-1">Arrival Time</div>
                  <input
                    type="time"
                    value={newTrain.arrival}
                    onChange={(e) => setNewTrain({ ...newTrain, arrival: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="text-slate-400 text-sm mb-1">Departure Time</div>
                  <input
                    type="time"
                    value={newTrain.departure}
                    onChange={(e) => setNewTrain({ ...newTrain, departure: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="text-slate-400 text-sm mb-1">Capacity</div>
                  <input
                    type="number"
                    value={newTrain.capacity}
                    onChange={(e) => setNewTrain({ ...newTrain, capacity: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg">
                  <div className="text-slate-400 text-sm mb-1">Notes</div>
                  <textarea
                    value={newTrain.notes}
                    onChange={(e) => setNewTrain({ ...newTrain, notes: e.target.value })}
                    className="w-full px-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-slate-800 flex justify-between">
              <button
                onClick={() => {
                  toast.success('Train scheduled', {
                    description: 'New train added to schedule - Ready for container assignment',
                  });
                  setShowScheduleModal(false);
                }}
                className="px-6 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/50 rounded-lg transition-colors"
              >
                Schedule Train
              </button>
              <button
                onClick={() => setShowScheduleModal(false)}
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