import { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { containerAPI } from '../api/client';
import ModuleInfoPanel, { MODULE_INFO } from './ModuleInfoPanel';
import { Package, Weight, AlertCircle, Move, Eye, Loader2 } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

const MAX_STACKS = 8;
const STACK_BLOCKS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
const OPERATIONAL_BAY = '01';
const OPERATIONAL_ROW = '01';
const MAX_STACK_HEIGHT = 6;

/** Target visible tiers per block — drives realistic yard variation */
const STACK_PROFILES: Record<string, {
  displayCount: number;
  maxWeight: number;
  label: string;
}> = {
  A: { displayCount: 6, maxWeight: 98, label: 'Congested' },
  B: { displayCount: 2, maxWeight: 100, label: 'Minimal' },
  C: { displayCount: 5, maxWeight: 100, label: 'High utilization' },
  D: { displayCount: 4, maxWeight: 100, label: 'Moderate' },
  E: { displayCount: 3, maxWeight: 100, label: 'Light load' },
  F: { displayCount: 1, maxWeight: 100, label: 'Minimal' },
  G: { displayCount: 6, maxWeight: 108, label: 'Overweight risk' },
  H: { displayCount: 4, maxWeight: 100, label: 'Optimal' },
};

function getBlockLetter(c: any): string {
  const block = c.raw?.location?.block || c.location || '';
  const match = String(block).match(/^([A-H])/i);
  return match ? match[1].toUpperCase() : 'A';
}

function getContainerPriority(c: any, index: number) {
  if (c.type === 'hazmat') return 1;
  if (c.raw?.customsStatus === 'Hold') return 1;
  if (c.type === 'reefer') return 2;
  if (c.status === 'ready') return 3;
  return 4 + (index % 3);
}

function sortStackContainers(containers: any[]) {
  return [...containers].sort((a, b) => {
    if (a.hazmat !== b.hazmat) return a.hazmat ? -1 : 1;
    if (Math.abs(a.weight - b.weight) > 5) return b.weight - a.weight;
    return a.priority - b.priority;
  });
}

function normalizeSlot(value: string | number | undefined, fallback = '01') {
  return String(value ?? fallback).padStart(2, '0');
}

function isOperationalColumn(c: any) {
  const bay = normalizeSlot(c.raw?.location?.bay);
  const row = normalizeSlot(c.raw?.location?.row);
  return bay === OPERATIONAL_BAY && row === OPERATIONAL_ROW;
}

function groupByColumn(containers: any[]) {
  const columns = new Map<string, any[]>();
  containers.forEach(c => {
    const bay = normalizeSlot(c.raw?.location?.bay);
    const row = normalizeSlot(c.raw?.location?.row);
    const key = `${bay}-${row}`;
    if (!columns.has(key)) columns.set(key, []);
    columns.get(key)!.push(c);
  });
  return [...columns.values()];
}

function sortByTier(containers: any[]) {
  return [...containers].sort((a, b) => {
    const tierA = parseInt(String(a.raw?.location?.tier || '99'), 10);
    const tierB = parseInt(String(b.raw?.location?.tier || '99'), 10);
    return tierA - tierB;
  });
}

function selectStackDisplayContainers(blockContainers: any[], maxHeight: number) {
  if (!blockContainers.length) return [];

  let columnContainers = blockContainers.filter(isOperationalColumn);

  if (!columnContainers.length) {
    const columns = groupByColumn(blockContainers);
    columnContainers = columns.sort((a, b) => b.length - a.length)[0] || blockContainers;
  }

  const byTier = sortByTier(columnContainers);
  const unique: any[] = [];
  const seen = new Set<string>();
  for (const c of byTier) {
    if (unique.length >= maxHeight) break;
    if (!seen.has(c.id)) {
      seen.add(c.id);
      unique.push(c);
    }
  }

  return sortStackContainers(unique);
}

function buildStacksFromContainers(containers: any[]) {
  const stacks = STACK_BLOCKS.map((block, idx) => {
    const profile = STACK_PROFILES[block];
    return {
      id: `Stack-${block}`,
      block,
      position: { row: Math.floor(idx / 4), col: idx % 4 },
      containers: [] as any[],
      maxWeight: profile.maxWeight,
      maxHeight: 6,
      overflowCount: 0,
      profileLabel: profile.label,
      targetDisplayCount: profile.displayCount,
    };
  });

  const blockBuckets = new Map<string, any[]>();
  STACK_BLOCKS.forEach(b => blockBuckets.set(b, []));

  containers.forEach((c, idx) => {
    const blockChar = getBlockLetter(c);
    const bucket = blockBuckets.get(blockChar) || blockBuckets.get('A')!;
    const weight = c.weight > 100 ? c.weight / 1000 : c.weight || 20;

    bucket.push({
      id: c.id,
      _id: c._id,
      weight,
      type: c.type || 'standard',
      priority: getContainerPriority(c, idx),
      hazmat: c.type === 'hazmat',
      raw: c.raw,
    });
  });

  return stacks.map(stack => {
    const blockContainers = blockBuckets.get(stack.block) || [];
    const totalInBlock = blockContainers.length;

    stack.containers = selectStackDisplayContainers(blockContainers, MAX_STACK_HEIGHT);
    stack.overflowCount = Math.max(0, totalInBlock - stack.containers.length);

    const currentWeight = stack.containers.reduce((s: number, c: any) => s + c.weight, 0);
    const fillRatio = stack.containers.length / stack.maxHeight;
    const hasPriorityIssue = stack.containers.some((c: any, i: number) =>
      c.priority <= 2 && i < stack.containers.length - 2
    );
    const hasHazmatOnTop = stack.containers.length > 1 &&
      stack.containers[stack.containers.length - 1].hazmat;
    const hasWeightInversion = stack.containers.some((c: any, i: number) =>
      i > 0 && c.weight > stack.containers[i - 1].weight + 10
    );

    let status = 'optimal';
    if (currentWeight > stack.maxWeight || fillRatio >= 1) status = 'critical';
    else if (hasPriorityIssue || hasWeightInversion || hasHazmatOnTop || fillRatio >= 0.85) status = 'warning';
    else if (fillRatio <= 0.35) status = 'underutilized';

    return {
      ...stack,
      totalContainers: totalInBlock,
      height: stack.containers.length,
      currentWeight,
      utilization: Math.round(fillRatio * 100),
      status,
      issues: {
        hasPriorityIssue,
        hasHazmatOnTop,
        hasWeightInversion,
        lowUtilization: fillRatio <= 0.35,
      },
    };
  });
}

function pad2(n: number) {
  return String(n).padStart(2, '0');
}

interface WeightAnalysis {
  score: number;
  issues: string[];
  inversions: number;
  isOptimal: boolean;
  heaviest: number;
  lightest: number;
}

function analyzeWeightStacking(containers: any[]): WeightAnalysis {
  if (!containers.length) {
    return { score: 100, issues: [], inversions: 0, isOptimal: true, heaviest: 0, lightest: 0 };
  }

  const ordered = [...containers];
  const issues: string[] = [];
  let inversions = 0;

  for (let i = 1; i < ordered.length; i++) {
    const below = ordered[i - 1];
    const above = ordered[i];
    if (above.weight > below.weight + 5) {
      inversions++;
      issues.push(
        `${above.id} (${above.weight.toFixed(1)}t) sits above ${below.id} (${below.weight.toFixed(1)}t) — lighter cargo should be on top`
      );
    }
  }

  const hazmatOnTop = ordered.length > 1 && ordered[ordered.length - 1].hazmat;
  if (hazmatOnTop) {
    issues.push('Hazmat container is above standard cargo — must be placed on lower tiers');
  }

  const weights = ordered.map(c => c.weight);
  const score = Math.max(0, 100 - inversions * 22 - (hazmatOnTop ? 25 : 0));

  return {
    score,
    issues,
    inversions,
    isOptimal: inversions === 0 && !hazmatOnTop,
    heaviest: Math.max(...weights),
    lightest: Math.min(...weights),
  };
}

function getTopContainer(stack: any) {
  if (!stack?.containers?.length) return null;
  return stack.containers[stack.containers.length - 1];
}

function validateContainerEligibility(container: any, sourceStack: any) {
  const errors: string[] = [];
  const top = getTopContainer(sourceStack);

  if (!container) {
    errors.push('Container not found in source stack');
  } else {
    if (!sourceStack.containers.some((c: any) => c.id === container.id)) {
      errors.push('Container does not exist in the selected source stack');
    }
    if (container.raw?.customsStatus === 'Hold') {
      errors.push('Container is locked (customs hold) and cannot be moved');
    }
    if (top && container.id !== top.id) {
      errors.push('Only the top container can be moved without restacking the source stack');
    }
  }

  return {
    eligible: errors.length === 0,
    errors,
    isTopContainer: !!top && container?.id === top.id,
    topContainer: top,
  };
}

function buildPlacements(block: string, orderedContainers: any[]) {
  return orderedContainers.map((c, i) => ({
    containerId: c.id,
    location: {
      block: `${block}-${pad2(i + 1)}`,
      bay: OPERATIONAL_BAY,
      row: OPERATIONAL_ROW,
      tier: pad2(i + 1),
    },
  }));
}

function detectWeightImbalance(destAfterTop: any[], movingContainer: any) {
  if (destAfterTop.length <= 1) {
    return { detected: false, message: '', issues: [] as string[] };
  }

  const below = destAfterTop.slice(0, -1);
  const lighterBelow = below.filter(c => movingContainer.weight > c.weight + 5);

  if (lighterBelow.length > 0) {
    return {
      detected: true,
      message:
        'Weight imbalance detected. A heavier container is being placed over lighter containers which may cause instability.',
      issues: lighterBelow.map(
        c => `${movingContainer.id} (${movingContainer.weight.toFixed(1)}t) over ${c.id} (${c.weight.toFixed(1)}t)`
      ),
    };
  }

  return { detected: false, message: '', issues: [] as string[] };
}

function generateOptimizationPlan(destStack: any, movingContainer: any) {
  const destAfterOptimized = sortStackContainers([...destStack.containers, movingContainer]);
  const steps: string[] = [];

  destAfterOptimized.forEach((c, i) => {
    const prevIdx = destStack.containers.findIndex((x: any) => x.id === c.id);
    const tierLabel =
      i === 0 ? 'bottom layer' : i === destAfterOptimized.length - 1 ? 'top layer' : `tier ${i + 1}`;

    if (c.id === movingContainer.id) {
      steps.push(`${c.id} placed at ${tierLabel} (tier ${i + 1})`);
    } else if (prevIdx >= 0 && prevIdx !== i) {
      steps.push(`${c.id} moved from tier ${prevIdx + 1} to tier ${i + 1}`);
    }
  });

  const heaviest = destAfterOptimized[0];
  if (heaviest && steps.length > 0) {
    steps.push(`Stack rebalanced for weight safety — heaviest unit ${heaviest.id} at bottom`);
  }

  if (!steps.length) {
    steps.push('Stack already follows heavy-bottom / light-top ordering');
  }

  return { destAfterOptimized, steps };
}

function simulateStackMove(
  sourceStack: any,
  destStackId: string,
  moveContainerId: string,
  allStacks: any[]
) {
  if (!sourceStack || !destStackId || !moveContainerId) return null;

  const movingContainer = sourceStack.containers.find((c: any) => c.id === moveContainerId);
  const destStack = allStacks.find(s => s.id === destStackId);
  if (!movingContainer || !destStack) return null;

  const eligibility = validateContainerEligibility(movingContainer, sourceStack);
  const sourceAfter = sourceStack.containers.filter((c: any) => c.id !== moveContainerId);
  const destAfterTop = [...destStack.containers, movingContainer];

  const destWeightAfterTop = destAfterTop.reduce((s: number, c: any) => s + c.weight, 0);
  const overCapacity = destAfterTop.length > destStack.maxHeight;
  const overweight = destWeightAfterTop > destStack.maxWeight;
  const canMove = !overCapacity && !overweight && eligibility.eligible;

  const weightImbalance = detectWeightImbalance(destAfterTop, movingContainer);
  const optimization = generateOptimizationPlan(destStack, movingContainer);
  const destAfterOptimized = optimization.destAfterOptimized;

  return {
    movingContainer,
    destStack,
    sourceAfter,
    destAfterTop,
    destAfterOptimized,
    eligibility,
    sourceBefore: analyzeWeightStacking(sourceStack.containers),
    destBefore: analyzeWeightStacking(destStack.containers),
    destAfterTopAnalysis: analyzeWeightStacking(destAfterTop),
    destAfterOptimizedAnalysis: analyzeWeightStacking(destAfterOptimized),
    destWeightAfterTop,
    overCapacity,
    overweight,
    canMove,
    weightImbalance,
    unstable: weightImbalance.detected || overweight,
    optimization,
    topTier: destAfterTop.length,
    optimizedTier: destAfterOptimized.findIndex((c: any) => c.id === movingContainer.id) + 1,
    situation: [
      `${sourceStack.id}: ${sourceStack.height}/${sourceStack.maxHeight} tiers, ${sourceStack.currentWeight.toFixed(1)}t`,
      `${destStack.id}: ${destStack.height}/${destStack.maxHeight} tiers, ${destStack.currentWeight.toFixed(1)}t before move`,
      `Simulation: ${movingContainer.id} (${movingContainer.weight.toFixed(1)}t) placed on TOP of ${destStack.id} → tier ${destAfterTop.length}`,
    ],
  };
}

function computeMoveAnalysis(
  sourceStack: any,
  destStackId: string,
  moveContainerId: string,
  allStacks: any[]
) {
  return simulateStackMove(sourceStack, destStackId, moveContainerId, allStacks);
}

function buildOptimizationSuggestions(stacks: any[]) {
  const suggestions: any[] = [];
  const problemStacks = stacks.filter(s => s.status !== 'optimal');

  if (problemStacks.some(s => s.issues?.hasPriorityIssue)) {
    const count = problemStacks.filter(s => s.issues?.hasPriorityIssue).length;
    suggestions.push({
      title: 'Restack by Priority',
      description: 'Move high-priority export containers to accessible top tiers',
      impact: 'High Impact',
      color: 'emerald',
      moves: count * 2,
      detail: `Reorder ${count} stack(s) — heavy/hazmat bottom, priority cargo on top`,
    });
  }

  if (problemStacks.some(s => s.issues?.hasWeightInversion || s.status === 'critical')) {
    suggestions.push({
      title: 'Balance Weight Distribution',
      description: 'Redistribute heavy containers to prevent stack overload',
      impact: 'High Impact',
      color: 'blue',
      moves: problemStacks.filter(s => s.status === 'critical').length * 3,
      detail: 'Reduce overweight stacks below 100t operational limit',
    });
  }

  if (problemStacks.some(s => s.issues?.hasHazmatOnTop)) {
    suggestions.push({
      title: 'Correct Hazmat Placement',
      description: 'Move hazmat containers to lower tiers per IMDG rules',
      impact: 'Critical',
      color: 'red',
      moves: problemStacks.filter(s => s.issues?.hasHazmatOnTop).length,
      detail: 'Hazmat must not be stacked above standard cargo',
    });
  }

  if (problemStacks.some(s => s.status === 'underutilized')) {
    suggestions.push({
      title: 'Consolidate Underutilized Stacks',
      description: 'Merge partially filled stacks to improve yard utilization',
      impact: 'Medium Impact',
      color: 'yellow',
      moves: problemStacks.filter(s => s.status === 'underutilized').length * 2,
      detail: 'Free crane paths by consolidating low-density stacks',
    });
  }

  if (!suggestions.length) {
    suggestions.push({
      title: 'All Stacks Optimal',
      description: 'Current yard configuration meets operational constraints',
      impact: 'No Action',
      color: 'emerald',
      moves: 0,
      detail: 'Continue monitoring for congestion during peak hours',
    });
  }

  return suggestions;
}

export default function ContainerStacking() {
  const { containers, refreshAllData, patchContainersFromStackMove, isLoading } = useApp();
  const [selectedStack, setSelectedStack] = useState<any>(null);
  const [view, setView] = useState<'top' | 'side'>('top');
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showOptimizeModal, setShowOptimizeModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [moveWizardStep, setMoveWizardStep] = useState(1);
  const [moveSourceStackId, setMoveSourceStackId] = useState('');
  const [moveContainerId, setMoveContainerId] = useState('');
  const [destStack, setDestStack] = useState('');
  const [wizardMode, setWizardMode] = useState<'preview' | 'warning' | 'optimize' | 'confirm-safe' | 'confirm-override'>('preview');
  const [moving, setMoving] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const [postMoveSelectStack, setPostMoveSelectStack] = useState<string | null>(null);

  const stacks = useMemo(() => buildStacksFromContainers(containers), [containers]);
  const optimizationSuggestions = useMemo(() => buildOptimizationSuggestions(stacks), [stacks]);

  const moveSourceStack = useMemo(
    () => stacks.find(s => s.id === moveSourceStackId) || selectedStack,
    [stacks, moveSourceStackId, selectedStack]
  );

  const moveSimulation = useMemo(() => {
    if (!showMoveModal || !moveSourceStack || !destStack || !moveContainerId || moveWizardStep < 2) return null;
    return simulateStackMove(moveSourceStack, destStack, moveContainerId, stacks);
  }, [showMoveModal, moveSourceStack, destStack, moveContainerId, moveWizardStep, stacks]);

  const sourceEligibility = useMemo(() => {
    if (!moveSourceStack || !moveContainerId) return null;
    const container = moveSourceStack.containers.find((c: any) => c.id === moveContainerId);
    return validateContainerEligibility(container, moveSourceStack);
  }, [moveSourceStack, moveContainerId]);

  useEffect(() => {
    if (!postMoveSelectStack || !stacks.length) return;
    const stack = stacks.find(s => s.id === postMoveSelectStack);
    if (stack) {
      setSelectedStack(stack);
      setPostMoveSelectStack(null);
    }
  }, [stacks, postMoveSelectStack]);

  const openMoveWizard = () => {
    if (!selectedStack) return;
    const top = getTopContainer(selectedStack);
    setMoveSourceStackId(selectedStack.id);
    setMoveContainerId(top?.id || selectedStack.containers[0]?.id || '');
    setDestStack('');
    setMoveWizardStep(1);
    setWizardMode('preview');
    setShowMoveModal(true);
  };

  const closeMoveWizard = () => {
    setShowMoveModal(false);
    setMoveWizardStep(1);
    setDestStack('');
    setMoveContainerId('');
    setWizardMode('preview');
  };

  const handleWizardNext = () => {
    if (moveWizardStep === 1) {
      if (!sourceEligibility?.eligible) {
        toast.error('Container not eligible', {
          description: sourceEligibility?.errors[0] || 'Select a valid container',
        });
        return;
      }
      setMoveWizardStep(2);
      return;
    }

    if (moveWizardStep === 2) {
      if (!destStack || !moveSimulation) {
        toast.error('Select a destination stack');
        return;
      }
      if (!moveSimulation.canMove) {
        toast.error('Move blocked', {
          description: moveSimulation.overCapacity
            ? `${destStack} is at tier capacity`
            : moveSimulation.overweight
            ? `Total weight would exceed ${moveSimulation.destStack.maxWeight}t`
            : sourceEligibility?.errors[0],
        });
        return;
      }
      setMoveWizardStep(3);
      if (moveSimulation.unstable) {
        setWizardMode('warning');
      } else {
        setWizardMode('confirm-safe');
      }
    }
  };

  const handleFinalMove = async (options: { optimized: boolean; override: boolean }) => {
    const simulation = moveSimulation || simulateStackMove(moveSourceStack, destStack, moveContainerId, stacks);
    if (!simulation) return;

    if (!simulation.canMove && !options.override) {
      toast.error('Move not allowed', { description: 'Destination stack cannot accept this container' });
      return;
    }

    const destOrder = options.optimized ? simulation.destAfterOptimized : simulation.destAfterTop;
    const destPlacements = buildPlacements(simulation.destStack.block, destOrder);
    const sourcePlacements = buildPlacements(moveSourceStack!.block, simulation.sourceAfter);

    const placementMap = new Map<string, ReturnType<typeof buildPlacements>[0]>();
    [...sourcePlacements, ...destPlacements].forEach(p => {
      placementMap.set(String(p.containerId).toUpperCase(), p);
    });
    const placements = [...placementMap.values()];

    try {
      setMoving(true);
      const response = await containerAPI.executeStackMove({
        containerId: moveContainerId,
        sourceStackId: moveSourceStack!.id,
        destStackId: destStack,
        placements,
        optimizationApplied: options.optimized,
        overrideWarning: options.override,
      });

      if (!response.data.success) {
        throw new Error(response.data.message || 'Stack move failed');
      }

      const updatedContainers = response.data.data?.updatedContainers;
      if (updatedContainers?.length) {
        patchContainersFromStackMove(updatedContainers);
      }

      const tier = options.optimized ? simulation.optimizedTier : simulation.topTier;
      toast.success('Stack move completed', {
        description: `${moveContainerId} → ${destStack} (tier ${tier})${
          options.optimized ? ' with optimization' : options.override ? ' (override)' : ''
        }. Audit log and yard notification sent.`,
      });
      closeMoveWizard();
      setPostMoveSelectStack(destStack);
      await refreshAllData();
    } catch (err: any) {
      toast.error('Failed to execute move', {
        description: err.response?.data?.message || err.message,
      });
    } finally {
      setMoving(false);
    }
  };

  const stats = useMemo(() => ({
    total: stacks.length,
    optimal: stacks.filter(s => s.status === 'optimal').length,
    overweight: stacks.filter(s => s.status === 'critical').length,
    warning: stacks.filter(s => s.status === 'warning').length,
    underutilized: stacks.filter(s => s.status === 'underutilized').length,
  }), [stacks]);

  const handleApplyOptimization = async () => {
    const problemStacks = stacks.filter(s => s.status !== 'optimal' && s.containers.length > 1);
    if (!problemStacks.length) {
      toast.info('All stacks are already optimized');
      setShowOptimizeModal(false);
      return;
    }
    try {
      setOptimizing(true);
      let moves = 0;
      for (const stack of problemStacks.slice(0, 3)) {
        const sorted = sortStackContainers(stack.containers);
        for (let i = 0; i < sorted.length; i++) {
          const c = sorted[i];
          await containerAPI.update(c._id || c.id, {
            location: { block: stack.block, bay: 1, row: 1, tier: i + 1 },
          });
          moves++;
        }
      }
      toast.success('Optimization plan applied!', {
        description: `${moves} container positions updated across ${Math.min(problemStacks.length, 3)} stacks`,
      });
      setShowOptimizeModal(false);
      await refreshAllData();
    } catch (err: any) {
      toast.error('Failed to apply optimization', {
        description: err.response?.data?.message || err.message,
      });
    } finally {
      setOptimizing(false);
    }
  };

  if (isLoading && !containers.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-emerald-400 animate-spin" />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal': return { bg: '#00ff88', text: 'text-emerald-400', border: 'border-emerald-500' };
      case 'warning': return { bg: '#ffd700', text: 'text-yellow-400', border: 'border-yellow-500' };
      case 'critical': return { bg: '#ef4444', text: 'text-red-400', border: 'border-red-500' };
      case 'underutilized': return { bg: '#a855f7', text: 'text-purple-400', border: 'border-purple-500' };
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Package className="w-5 h-5 text-blue-400 mb-2" />
          <div className="text-2xl text-blue-400 mb-1">{stats.total}</div>
          <div className="text-slate-400 text-sm">Total Stacks</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Weight className="w-5 h-5 text-emerald-400 mb-2" />
          <div className="text-2xl text-emerald-400 mb-1">{stats.optimal}</div>
          <div className="text-slate-400 text-sm">Optimal</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <Move className="w-5 h-5 text-yellow-400 mb-2" />
          <div className="text-2xl text-yellow-400 mb-1">{stats.warning}</div>
          <div className="text-slate-400 text-sm">Reshuffle Risk</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4">
          <AlertCircle className="w-5 h-5 text-red-400 mb-2" />
          <div className="text-2xl text-red-400 mb-1">{stats.overweight}</div>
          <div className="text-slate-400 text-sm">Critical</div>
        </div>
        <div className="bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-4 col-span-2 md:col-span-1">
          <Eye className="w-5 h-5 text-purple-400 mb-2" />
          <div className="text-2xl text-purple-400 mb-1">{stats.underutilized}</div>
          <div className="text-slate-400 text-sm">Underutilized</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stacking View */}
        <div className="lg:col-span-2 bg-slate-900/50 backdrop-blur border border-slate-800 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl">Yard Stacks - {view === 'top' ? 'Top View' : 'Side View'}</h3>
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
                          {stack.height}/{stack.maxHeight} tiers · {stack.currentWeight.toFixed(1)}t
                        </div>
                        {stack.overflowCount > 0 && (
                          <div className="text-xs text-orange-400">+{stack.overflowCount} in block</div>
                        )}
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
                  onClick={openMoveWizard}
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

      {/* Simulate Move Wizard */}
      {showMoveModal && moveSourceStack && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-blue-500/50 rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl text-blue-400">Simulate Container Move</h3>
              <span className="text-xs text-slate-500">Step {moveWizardStep} of 3</span>
            </div>

            {/* Step indicators */}
            <div className="flex gap-2 mb-6">
              {['Source', 'Destination', 'Confirm'].map((label, i) => (
                <div
                  key={label}
                  className={`flex-1 py-2 text-center text-xs rounded-lg border ${
                    moveWizardStep === i + 1
                      ? 'border-blue-500 bg-blue-500/20 text-blue-300'
                      : moveWizardStep > i + 1
                      ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                      : 'border-slate-700 text-slate-500'
                  }`}
                >
                  {i + 1}. {label}
                </div>
              ))}
            </div>

            {/* Step 1: Source + Container */}
            {moveWizardStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Source Stack</label>
                  <select
                    value={moveSourceStackId}
                    onChange={(e) => {
                      const stack = stacks.find(s => s.id === e.target.value);
                      const top = stack ? getTopContainer(stack) : null;
                      setMoveSourceStackId(e.target.value);
                      setMoveContainerId(top?.id || stack?.containers[0]?.id || '');
                    }}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100"
                  >
                    {stacks.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.id} — {s.height}/{s.maxHeight} tiers · {s.currentWeight.toFixed(1)}t
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Container to Move</label>
                  <select
                    value={moveContainerId}
                    onChange={(e) => setMoveContainerId(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100"
                  >
                    {moveSourceStack.containers.map((c: any, idx: number) => (
                      <option key={c.id} value={c.id}>
                        {c.id} — {c.weight.toFixed(1)}t — Priority {c.priority}
                        {idx === moveSourceStack.containers.length - 1 ? ' (TOP)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                {sourceEligibility && !sourceEligibility.eligible && (
                  <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg">
                    <div className="text-sm text-red-400 mb-2">Validation Failed</div>
                    <ul className="text-xs text-slate-400 space-y-1">
                      {sourceEligibility.errors.map((err, i) => (
                        <li key={i}>• {err}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {sourceEligibility?.eligible && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg text-xs text-emerald-400">
                    ✓ Container eligible for movement from {moveSourceStackId}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Destination + Simulation Preview */}
            {moveWizardStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Destination Stack</label>
                  <select
                    value={destStack}
                    onChange={(e) => setDestStack(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-100"
                  >
                    <option value="">Select destination</option>
                    {stacks.filter(s => s.id !== moveSourceStackId).map(s => (
                      <option key={s.id} value={s.id}>
                        {s.id} — {s.height}/{s.maxHeight} tiers · {s.status} · {s.currentWeight.toFixed(1)}t
                      </option>
                    ))}
                  </select>
                </div>

                {moveSimulation && (
                  <>
                    <div className="p-4 bg-slate-800/50 border border-slate-700 rounded-lg space-y-2">
                      <div className="text-sm text-slate-300 font-medium">Simulation Preview (not saved yet)</div>
                      {moveSimulation.situation.map((line, i) => (
                        <p key={i} className="text-xs text-slate-400">• {line}</p>
                      ))}
                      <p className="text-xs text-blue-400 pt-2">
                        Container removed from {moveSourceStackId} → placed on TOP of {destStack} (tier {moveSimulation.topTier})
                      </p>
                    </div>

                    <div className="p-4 bg-blue-500/10 border border-blue-500/50 rounded-lg">
                      <div className="text-sm text-slate-300 mb-2">{destStack} after simulated move</div>
                      <div className="flex flex-col-reverse gap-1">
                        {moveSimulation.destAfterTop.map((c: any, idx: number) => (
                          <div
                            key={c.id}
                            className={`flex justify-between px-3 py-1.5 rounded text-xs border ${
                              c.id === moveContainerId
                                ? 'border-blue-400 bg-blue-500/20 text-blue-300'
                                : 'border-slate-600 bg-slate-800/50 text-slate-400'
                            }`}
                          >
                            <span>
                              Tier {idx + 1}{idx === 0 ? ' (bottom)' : idx === moveSimulation.destAfterTop.length - 1 ? ' (TOP)' : ''}
                            </span>
                            <span>{c.id} · {c.weight.toFixed(1)}t</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {!moveSimulation.canMove && (
                      <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-xs text-red-400">
                        {moveSimulation.overCapacity && `Destination full (${moveSimulation.destStack.maxHeight} tiers max).`}
                        {moveSimulation.overweight && ` Weight limit exceeded (${moveSimulation.destWeightAfterTop.toFixed(1)}t / ${moveSimulation.destStack.maxWeight}t).`}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}

            {/* Step 3: Warning / Optimization / Confirm */}
            {moveWizardStep === 3 && moveSimulation && (
              <div className="space-y-4">
                {wizardMode === 'warning' && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/50 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-400 mb-2">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">Safety Warning</span>
                    </div>
                    <p className="text-sm text-slate-300 mb-3">{moveSimulation.weightImbalance.message}</p>
                    <ul className="text-xs text-slate-400 space-y-1 mb-4">
                      {moveSimulation.weightImbalance.issues.map((issue, i) => (
                        <li key={i}>• {issue}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-slate-500">
                      Heavy containers should sit at the bottom; lighter containers on top for stack stability.
                    </p>
                  </div>
                )}

                {wizardMode === 'optimize' && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg">
                    <div className="text-sm text-emerald-400 font-medium mb-3">🔧 Optimization Plan Generated</div>
                    <ul className="text-xs text-slate-300 space-y-2 mb-4">
                      {moveSimulation.optimization.steps.map((step, i) => (
                        <li key={i}>• {step}</li>
                      ))}
                    </ul>
                    <div className="text-sm text-slate-400 mb-2">Optimized stack order (bottom → top)</div>
                    <div className="flex flex-col-reverse gap-1">
                      {moveSimulation.destAfterOptimized.map((c: any, idx: number) => (
                        <div
                          key={c.id}
                          className={`flex justify-between px-3 py-1.5 rounded text-xs border ${
                            c.id === moveContainerId
                              ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300'
                              : 'border-slate-600 bg-slate-800/50 text-slate-400'
                          }`}
                        >
                          <span>Tier {idx + 1}</span>
                          <span>{c.id} · {c.weight.toFixed(1)}t</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-emerald-400/80 mt-3">
                      Score improves: {moveSimulation.destAfterTopAnalysis.score} → {moveSimulation.destAfterOptimizedAnalysis.score}/100
                    </p>
                  </div>
                )}

                {(wizardMode === 'confirm-safe' || wizardMode === 'confirm-override') && (
                  <div className="p-4 bg-emerald-500/10 border border-emerald-500/50 rounded-lg">
                    <div className="text-sm text-emerald-400 mb-2">Ready to Execute</div>
                    <p className="text-xs text-slate-400">
                      Move {moveContainerId} from {moveSourceStackId} to {destStack} on tier {moveSimulation.topTier} (TOP).
                      {wizardMode === 'confirm-override' && ' Safety override acknowledged.'}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      This will update the database, create an audit log, and notify yard operations.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Wizard footer actions */}
            <div className="flex justify-between gap-3 mt-6">
              <button
                onClick={closeMoveWizard}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg"
              >
                Cancel Move
              </button>

              <div className="flex gap-2 flex-wrap justify-end">
                {moveWizardStep > 1 && moveWizardStep < 3 && (
                  <button
                    onClick={() => setMoveWizardStep(moveWizardStep - 1)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                  >
                    Back
                  </button>
                )}

                {moveWizardStep === 3 && wizardMode !== 'warning' && wizardMode !== 'optimize' && (
                  <button
                    onClick={() => setMoveWizardStep(2)}
                    className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                  >
                    Back
                  </button>
                )}

                {moveWizardStep < 3 && (
                  <button
                    onClick={handleWizardNext}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
                  >
                    Next
                  </button>
                )}

                {moveWizardStep === 3 && wizardMode === 'warning' && (
                  <>
                    <button
                      onClick={() => setWizardMode('optimize')}
                      className="px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 rounded-lg"
                    >
                      🔧 Optimize Stack First
                    </button>
                    <button
                      onClick={() => setWizardMode('confirm-override')}
                      className="px-4 py-2 bg-yellow-500/20 border border-yellow-500/50 text-yellow-400 rounded-lg"
                    >
                      Proceed Anyway
                    </button>
                  </>
                )}

                {moveWizardStep === 3 && wizardMode === 'optimize' && (
                  <button
                    onClick={() => handleFinalMove({ optimized: true, override: false })}
                    disabled={moving}
                    className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                  >
                    {moving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Apply Optimization & Move Container
                  </button>
                )}

                {moveWizardStep === 3 && wizardMode === 'confirm-override' && (
                  <button
                    onClick={() => handleFinalMove({ optimized: false, override: true })}
                    disabled={moving}
                    className="px-6 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                  >
                    {moving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Confirm Override & Move
                  </button>
                )}

                {moveWizardStep === 3 && wizardMode === 'confirm-safe' && (
                  <button
                    onClick={() => handleFinalMove({ optimized: false, override: false })}
                    disabled={moving}
                    className="px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                  >
                    {moving && <Loader2 className="w-4 h-4 animate-spin" />}
                    Confirm & Execute Move
                  </button>
                )}
              </div>
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
              {optimizationSuggestions.map((suggestion, idx) => (
                <div
                  key={idx}
                  className={`p-4 bg-${suggestion.color}-500/10 border border-${suggestion.color}-500/50 rounded-lg`}
                  style={{
                    backgroundColor: suggestion.color === 'emerald' ? 'rgba(16,185,129,0.1)' :
                      suggestion.color === 'blue' ? 'rgba(59,130,246,0.1)' :
                      suggestion.color === 'red' ? 'rgba(239,68,68,0.1)' :
                      suggestion.color === 'yellow' ? 'rgba(234,179,8,0.1)' : 'rgba(16,185,129,0.1)',
                    borderColor: suggestion.color === 'emerald' ? 'rgba(16,185,129,0.5)' :
                      suggestion.color === 'blue' ? 'rgba(59,130,246,0.5)' :
                      suggestion.color === 'red' ? 'rgba(239,68,68,0.5)' :
                      suggestion.color === 'yellow' ? 'rgba(234,179,8,0.5)' : 'rgba(16,185,129,0.5)',
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className={`text-${suggestion.color}-400 mb-1`} style={{
                        color: suggestion.color === 'emerald' ? '#34d399' :
                          suggestion.color === 'blue' ? '#60a5fa' :
                          suggestion.color === 'red' ? '#f87171' :
                          suggestion.color === 'yellow' ? '#facc15' : '#34d399',
                      }}>
                        Suggestion #{idx + 1}: {suggestion.title}
                      </h4>
                      <p className="text-sm text-slate-400">{suggestion.description}</p>
                    </div>
                    <span className="text-xs px-3 py-1 rounded-full" style={{
                      backgroundColor: 'rgba(255,255,255,0.05)',
                      color: suggestion.color === 'emerald' ? '#34d399' :
                        suggestion.color === 'blue' ? '#60a5fa' :
                        suggestion.color === 'red' ? '#f87171' :
                        suggestion.color === 'yellow' ? '#facc15' : '#34d399',
                    }}>
                      {suggestion.impact}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 space-y-1">
                    <div>• Moves required: {suggestion.moves}</div>
                    <div>• {suggestion.detail}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowOptimizeModal(false)}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleApplyOptimization}
                disabled={optimizing || optimizationSuggestions.every(s => s.moves === 0)}
                className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {optimizing && <Loader2 className="w-4 h-4 animate-spin" />}
                Apply Optimization
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
            <div className="p-8 bg-slate-800/50 border border-slate-700 rounded-lg text-center text-slate-400">
              <p className="text-sm">Stack movement history is recorded in Audit Logs.</p>
              <p className="text-xs mt-2 text-slate-500">
                {selectedStack.totalContainers} containers · {selectedStack.utilization}% utilization · {selectedStack.status}
              </p>
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

      <ModuleInfoPanel content={MODULE_INFO.stacking} />
    </div>
  );
}