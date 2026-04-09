import { Ship as ShipIcon } from 'lucide-react';
import svgPaths from '../imports/svg-1rcp9lhow4';

interface Vessel {
  id: number;
  name: string;
  eta: string;
  etd: string;
  progress: number;
  color: string;
}

interface Berth {
  id: number;
  length: number;
  depth: number;
  status: 'occupied' | 'available' | 'maintenance';
  vessel: Vessel | null;
}

interface BerthTimelineProps {
  berths: Berth[];
}

export default function BerthTimeline({ berths }: BerthTimelineProps) {
  const timeSlots = [
    '00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00',
    '14:00', '16:00', '18:00', '20:00', '22:00'
  ];

  // Calculate position and width based on time
  const getTimePosition = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const totalMinutes = hours * 60 + minutes;
    return (totalMinutes / (24 * 60)) * 100;
  };

  const getVesselPosition = (vessel: Vessel | null) => {
    if (!vessel) return { left: 0, width: 0 };
    
    const startPos = getTimePosition(vessel.eta);
    const endPos = getTimePosition(vessel.etd);
    
    return {
      left: `${startPos}%`,
      width: `${endPos - startPos}%`
    };
  };

  const StatusBadge = ({ status }: { status: string }) => {
    const styles = {
      occupied: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50',
      available: 'bg-slate-700 text-slate-400 border-slate-600',
      maintenance: 'bg-orange-500/20 text-orange-400 border-orange-500/50'
    };

    return (
      <span className={`px-2 py-1 rounded text-xs border ${styles[status as keyof typeof styles]}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="bg-[rgba(15,23,43,0.5)] border border-slate-800 rounded-xl p-6">
      {/* Header */}
      <h3 className="text-xl mb-4">Berth Schedule Timeline</h3>

      {/* Timeline Container */}
      <div className="relative w-full overflow-x-auto">
        <div className="min-w-[1200px]">
          {/* Time Header Row */}
          <div className="flex items-center h-5 mb-2">
            {/* Berth label spacer */}
            <div className="w-40 flex-shrink-0" />
            
            {/* Time slots */}
            <div className="flex-1 flex">
              {timeSlots.map((time, idx) => (
                <div
                  key={idx}
                  className="flex-1 text-center text-sm text-slate-400 relative"
                  style={{ borderLeft: idx > 0 ? '1px solid #1d293d' : 'none' }}
                >
                  {time}
                </div>
              ))}
            </div>
          </div>

          {/* Berth Rows */}
          <div className="space-y-3">
            {berths.map((berth) => {
              const vesselPos = getVesselPosition(berth.vessel);
              
              return (
                <div key={berth.id} className="flex items-center h-17">
                  {/* Berth Info Column */}
                  <div className="w-40 flex-shrink-0 pr-4">
                    <div className="text-slate-100 text-sm mb-1">Berth {berth.id}</div>
                    <div className="text-slate-500 text-xs mb-2">
                      {berth.length}m × {berth.depth}m
                    </div>
                    <StatusBadge status={berth.status} />
                  </div>

                  {/* Timeline Track */}
                  <div className="flex-1 relative h-16 bg-[rgba(29,41,61,0.3)] border border-slate-800 rounded-lg">
                    {/* Time Grid Lines */}
                    <div className="absolute inset-0 flex">
                      {timeSlots.slice(1).map((_, idx) => (
                        <div
                          key={idx}
                          className="flex-1 border-l border-slate-800"
                        />
                      ))}
                    </div>

                    {/* Vessel Block */}
                    {berth.vessel && (
                      <div
                        className="absolute top-0 h-full rounded flex items-center px-4 border-l-4"
                        style={{
                          left: vesselPos.left,
                          width: vesselPos.width,
                          backgroundColor: `${berth.vessel.color}40`,
                          borderLeftColor: berth.vessel.color,
                        }}
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center gap-2">
                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 16 16">
                              <g clipPath="url(#clip0)">
                                <path d="M8 6.79266V9.33333" stroke={berth.vessel.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                                <path d="M8 1.33333V3.33333" stroke={berth.vessel.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                                <path d={svgPaths.p183c7940} stroke={berth.vessel.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                                <path d={svgPaths.p31f45900} stroke={berth.vessel.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                                <path d={svgPaths.p3f202e00} stroke={berth.vessel.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.33333" />
                              </g>
                              <defs>
                                <clipPath id="clip0">
                                  <rect fill="white" height="16" width="16" />
                                </clipPath>
                              </defs>
                            </svg>
                            <div>
                              <div className="text-slate-100 text-sm font-medium">{berth.vessel.name}</div>
                              <div className="text-slate-400 text-xs">{berth.vessel.eta} - {berth.vessel.etd}</div>
                            </div>
                          </div>
                          <div className="text-xs font-medium ml-3" style={{ color: berth.vessel.color }}>
                            {berth.vessel.progress}%
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Maintenance Block */}
                    {berth.status === 'maintenance' && !berth.vessel && (
                      <div
                        className="absolute top-0 h-full rounded flex items-center px-4 border-l-2"
                        style={{
                          left: '50%',
                          width: '30%',
                          backgroundColor: 'rgba(255,105,0,0.2)',
                          borderLeftColor: '#ff6900',
                        }}
                      >
                        <div className="text-orange-400 text-sm">Maintenance</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
