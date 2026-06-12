import { Info, ChevronDown } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

export interface ModuleInfoContent {
  title: string;
  purpose: string;
  importance: string;
  workflow: string[];
  benefits: string[];
  bestPractices: string[];
}

interface ModuleInfoPanelProps {
  content: ModuleInfoContent;
}

export default function ModuleInfoPanel({ content }: ModuleInfoPanelProps) {
  return (
    <div className="mt-8 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl overflow-hidden">
      <Accordion type="single" collapsible defaultValue="info">
        <AccordionItem value="info" className="border-none">
          <AccordionTrigger className="px-6 py-4 hover:no-underline hover:bg-slate-800/30">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-emerald-400" />
              <span className="text-lg font-medium">About This Module — {content.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-6 pb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div>
                <h4 className="text-emerald-400 font-medium mb-2">Purpose</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{content.purpose}</p>
                <h4 className="text-emerald-400 font-medium mb-2 mt-4">Why It Matters</h4>
                <p className="text-slate-300 text-sm leading-relaxed">{content.importance}</p>
              </div>
              <div>
                <h4 className="text-emerald-400 font-medium mb-2">Workflow</h4>
                <ol className="list-decimal list-inside text-slate-300 text-sm space-y-1">
                  {content.workflow.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
              <div>
                <h4 className="text-emerald-400 font-medium mb-2">Operational Benefits</h4>
                <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                  {content.benefits.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-emerald-400 font-medium mb-2">Best Practices</h4>
                <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
                  {content.bestPractices.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

export const MODULE_INFO: Record<string, ModuleInfoContent> = {
  truck: {
    title: 'Truck Slot Booking',
    purpose: 'The Truck Appointment System manages inbound and outbound truck traffic by assigning time slots for container pickup, delivery, and empty returns at the port gate.',
    importance: 'Controlled slot booking reduces gate congestion, prevents yard bottlenecks, and ensures predictable turnaround times for hauliers and terminal operators.',
    workflow: [
      'Select the appointment date and review available time slots.',
      'Enter truck number, container ID, driver details, and operation type.',
      'Confirm the booking — it is saved permanently to the database.',
      'View or cancel bookings from the booking list sorted by most recent first.',
      'Cancelled bookings update immediately and persist across restarts.'
    ],
    benefits: ['Reduced gate queue times', 'Predictable truck flow', 'Accurate capacity planning', 'Audit trail for all bookings'],
    bestPractices: ['Book slots at least 2 hours ahead', 'Verify container numbers before submission', 'Cancel unused slots promptly', 'Arrive within the assigned 30-minute window']
  },
  admin: {
    title: 'User & System Administration',
    purpose: 'Central administration for user accounts, role permissions, audit logs, and system configuration across the terminal operating system.',
    importance: 'Proper user and permission management ensures only authorized personnel access critical port operations, maintaining security and regulatory compliance.',
    workflow: [
      'Create users with assigned roles and active status.',
      'Configure module-level permissions per role.',
      'Monitor audit logs for all critical system changes.',
      'Activate or deactivate users as staffing changes.',
      'Review notification history for operational awareness.'
    ],
    benefits: ['Role-based access control', 'Complete audit trail', 'Centralized user lifecycle', 'Permission persistence'],
    bestPractices: ['Use least-privilege principle for roles', 'Review audit logs daily', 'Deactivate unused accounts promptly', 'Never share admin credentials']
  },
  berth: {
    title: 'Berth Planner',
    purpose: 'Schedule and manage vessel berthing assignments, coordinating ETA/ETD windows with available berth capacity.',
    importance: 'Efficient berth allocation maximizes vessel turnaround, optimizes crane utilization, and prevents scheduling conflicts at the quay.',
    workflow: [
      'Schedule incoming vessels with voyage details and ETA/ETD.',
      'Assign berths based on vessel size and cargo type.',
      'Monitor loading/unloading progress.',
      'Update or release berth assignments as vessels depart.',
      'All schedules persist in the database permanently.'
    ],
    benefits: ['Optimized berth utilization', 'Conflict-free scheduling', 'Real-time vessel tracking', 'Improved port throughput'],
    bestPractices: ['Confirm draft restrictions before assignment', 'Buffer time between vessel departures and arrivals', 'Coordinate with pilot and tug services', 'Update ETD when operations delay']
  },
  reefer: {
    title: 'Reefer Monitor',
    purpose: 'Monitor refrigerated container temperatures, manage cold chain integrity, and dispatch technicians when anomalies occur.',
    importance: 'Temperature excursions can destroy perishable cargo worth millions. Continuous monitoring protects cargo owners and terminal liability.',
    workflow: [
      'View all active reefer units and current temperatures.',
      'Adjust set points when cargo requirements change.',
      'Acknowledge alerts and dispatch technicians when needed.',
      'Review temperature history for compliance reporting.',
      'All adjustments are saved permanently to the database.'
    ],
    benefits: ['Cold chain protection', 'Early anomaly detection', 'Technician dispatch tracking', 'Compliance documentation'],
    bestPractices: ['Check critical alerts within 15 minutes', 'Verify power connections after moves', 'Document all set point changes', 'Schedule preventive maintenance proactively']
  },
  stowage: {
    title: 'Ship Stowage',
    purpose: 'Plan and manage container placement on vessels, ensuring proper weight distribution and stowage sequence.',
    importance: 'Correct stowage prevents vessel stability issues, optimizes discharge order, and ensures safe ocean transit.',
    workflow: [
      'Select the active vessel and view the bay/row/tier grid.',
      'Move containers to assigned stowage positions.',
      'Monitor weight balance across port and starboard.',
      'Remove containers when plans change.',
      'All moves create audit records and stakeholder notifications.'
    ],
    benefits: ['Vessel stability assurance', 'Optimized discharge planning', 'Visual stowage overview', 'Audit trail for all moves'],
    bestPractices: ['Verify weight limits per bay', 'Keep reefer slots powered', 'Heavy containers low in the stack', 'Group by destination port']
  },
  gate: {
    title: 'Gate Operations',
    purpose: 'Process vehicle entry and exit at port gates with OCR verification, weight validation, and manual entry support.',
    importance: 'Gate operations are the primary security checkpoint controlling all cargo movement in and out of the terminal.',
    workflow: [
      'Monitor gate status (Open, Closed, Busy, Maintenance).',
      'Process entries with license plate, container, and driver verification.',
      'Approve entries or hold vehicles for inspection.',
      'Enter manual verification notes when OCR fails.',
      'All transactions persist permanently in the database.'
    ],
    benefits: ['Automated verification', 'Weight mismatch detection', 'Complete transaction history', 'Flexible manual override'],
    bestPractices: ['Investigate weight mismatches over 3%', 'Hold suspicious cargo for customs', 'Keep gate status updated', 'Document all manual entries']
  },
  yard: {
    title: 'Yard Density',
    purpose: 'Monitor yard block capacity in real time and optimize container placement to prevent congestion.',
    importance: 'Yard density directly affects crane productivity, truck turnaround, and overall terminal throughput.',
    workflow: [
      'View heatmap of all yard blocks with density levels.',
      'Identify critical blocks approaching capacity.',
      'Run optimization to rebalance container placement.',
      'Review optimization results and audit history.',
      'Changes persist permanently after optimization.'
    ],
    benefits: ['Proactive congestion prevention', 'Balanced yard utilization', 'Data-driven placement', 'Reduced rehandle moves'],
    bestPractices: ['Act when blocks exceed 90% capacity', 'Separate import/export blocks', 'Run optimization during low-traffic periods', 'Review results before peak hours']
  },
  rail: {
    title: 'Rail Coordination',
    purpose: 'Schedule rail departures, assign containers to trains, and coordinate intermodal transfer between yard and rail network.',
    importance: 'Rail coordination extends the terminal\'s reach inland, reducing road congestion and providing cost-effective cargo transport.',
    workflow: [
      'Schedule trains with arrival and departure times.',
      'Assign containers to scheduled trains.',
      'Complete loading and update train status.',
      'Report delays and notify stakeholders.',
      'All schedules and assignments persist in the database.'
    ],
    benefits: ['Intermodal efficiency', 'Container-to-train tracking', 'Delay management', 'Capacity optimization'],
    bestPractices: ['Confirm rail slot availability before scheduling', 'Load heavy containers first', 'Report delays immediately', 'Verify seal integrity before departure']
  },
  billing: {
    title: 'Billing & Tariff',
    purpose: 'Generate invoices from terminal service records, calculate tariffs, and manage payment tracking.',
    importance: 'Accurate billing ensures revenue capture for all terminal services and maintains financial accountability with shipping lines.',
    workflow: [
      'Select customer and service records from the database.',
      'Generate invoice with line items, tax, and totals.',
      'Preview and download PDF invoice.',
      'Track payment status and revenue metrics.',
      'Duplicate invoice generation is prevented automatically.'
    ],
    benefits: ['Automated invoice generation', 'PDF download capability', 'Revenue tracking', 'Duplicate prevention'],
    bestPractices: ['Verify service records before invoicing', 'Apply correct tariff rates', 'Follow up on overdue invoices', 'Reconcile payments weekly']
  },
  stacking: {
    title: 'Container Stacking',
    purpose: 'Manage container stacking operations in the yard, including stack simulation and optimization for efficient space use.',
    importance: 'Proper stacking minimizes rehandle moves, protects container integrity, and maximizes yard capacity.',
    workflow: [
      'View current stack configurations by block.',
      'Simulate container moves before execution.',
      'Run stack optimization algorithms.',
      'Confirm and save resulting placement changes.',
      'Stakeholder notifications sent for optimization actions.'
    ],
    benefits: ['Reduced rehandle costs', 'Optimized yard space', 'Move simulation safety', 'Operational notifications'],
    bestPractices: ['Simulate before moving heavy containers', 'Maintain reefer access paths', 'Stack by discharge priority', 'Document all optimization runs']
  },
  customs: {
    title: 'Customs Clearance',
    purpose: 'Manage customs documentation, clearance status, and hold/release decisions for import and export containers.',
    importance: 'Customs compliance is legally mandatory; delays in clearance directly impact cargo delivery and demurrage costs.',
    workflow: [
      'Review pending clearance requests.',
      'Verify documentation completeness.',
      'Approve, reject, or hold containers for inspection.',
      'Update clearance status in the database.',
      'All decisions persist and reflect immediately in the UI.'
    ],
    benefits: ['Streamlined clearance workflow', 'Document tracking', 'Hold/release management', 'Compliance audit trail'],
    bestPractices: ['Verify bill of lading matches container', 'Process holds within SLA timeframes', 'Coordinate with customs officials', 'Maintain complete documentation']
  },
  dashboard: {
    title: 'Operations Dashboard',
    purpose: 'Provide a real-time overview of terminal operations KPIs, activity feeds, and role-specific operational metrics.',
    importance: 'The dashboard gives decision-makers immediate visibility into port performance, enabling rapid response to operational issues.',
    workflow: [
      'Log in with your assigned role.',
      'View role-specific KPIs and charts loaded from the database.',
      'Monitor recent activity and alerts.',
      'Navigate to specific modules for detailed actions.',
      'All metrics refresh from live database records.'
    ],
    benefits: ['Real-time operational visibility', 'Role-specific views', 'Quick navigation to modules', 'Data-driven decisions'],
    bestPractices: ['Check dashboard at shift start', 'Investigate critical alerts immediately', 'Use KPIs for shift handover', 'Report anomalies to supervisors']
  }
};
