const YardBlock = require('../models/YardBlock');
const Container = require('../models/Container');
const { createAuditLog } = require('../utils/auditLogger');
const { sendNotification } = require('../utils/notificationService');

const DEFAULT_BLOCKS = [
  { blockId: 'A', capacity: 120, type: 'mixed' },
  { blockId: 'B', capacity: 100, type: 'export' },
  { blockId: 'C', capacity: 80, type: 'reefer' },
  { blockId: 'D', capacity: 150, type: 'import' },
  { blockId: 'E', capacity: 100, type: 'mixed' },
  { blockId: 'F', capacity: 120, type: 'export' },
  { blockId: 'G', capacity: 90, type: 'import' },
  { blockId: 'H', capacity: 110, type: 'mixed' }
];

async function ensureDefaultBlocks() {
  for (const block of DEFAULT_BLOCKS) {
    const exists = await YardBlock.findOne({ blockId: block.blockId });
    if (!exists) await YardBlock.create(block);
  }
}

async function computeBlockStats(blockId, capacity, type) {
  const containers = await Container.find({
    'location.block': new RegExp(`^${blockId}`, 'i'),
    status: { $nin: ['Gate Out'] }
  });
  const occupied = containers.length;
  const density = capacity > 0 ? Math.round((occupied / capacity) * 100) : 0;
  return { occupied, density, containers: containers.length };
}

exports.getBlocks = async (req, res) => {
  try {
    await ensureDefaultBlocks();
    const blocks = await YardBlock.find().sort('blockId');

    const data = await Promise.all(blocks.map(async (block) => {
      const stats = await computeBlockStats(block.blockId, block.capacity, block.type);
      const result = {
        id: block.blockId,
        blockId: block.blockId,
        capacity: block.capacity,
        occupied: stats.occupied,
        density: stats.density,
        type: block.type,
        lastOptimizedAt: block.lastOptimizedAt,
        optimizationNotes: block.optimizationNotes
      };

      if (stats.density >= 90) {
        await sendNotification({
          module: 'Yard Density',
          action: 'Critical Density Alert',
          message: `Block ${block.blockId} at critical density: ${stats.density}%`,
          recordId: block.blockId,
          dedupeKey: `yard:critical:${block.blockId}:${new Date().toISOString().slice(0, 10)}`
        });
      }

      return result;
    }));

    res.json({ success: true, count: data.length, data });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.optimizePlacement = async (req, res) => {
  try {
    await ensureDefaultBlocks();
    const blocks = await YardBlock.find().sort('blockId');
    const allContainers = await Container.find({ status: { $nin: ['Gate Out', 'On Vessel'] } }).sort('arrivalDate');

    const sortedBlocks = blocks
      .map(b => ({ ...b.toObject(), occupied: 0 }))
      .sort((a, b) => a.capacity - b.capacity);

    const moves = [];
    let blockIndex = 0;

    for (const container of allContainers) {
      let placed = false;
      for (let i = 0; i < sortedBlocks.length; i++) {
        const idx = (blockIndex + i) % sortedBlocks.length;
        const block = sortedBlocks[idx];
        if (block.occupied < block.capacity) {
          const previousLocation = container.location;
          container.location = {
            block: `${block.blockId}-${String(block.occupied + 1).padStart(2, '0')}`,
            bay: container.location?.bay,
            row: container.location?.row,
            tier: container.location?.tier
          };
          await container.save();
          block.occupied += 1;
          moves.push({ containerId: container.containerId, from: previousLocation, to: container.location });
          blockIndex = (idx + 1) % sortedBlocks.length;
          placed = true;
          break;
        }
      }
      if (!placed) break;
    }

    const now = new Date();
    const notes = `Optimized ${moves.length} container placements at ${now.toISOString()}`;
    await YardBlock.updateMany({}, { lastOptimizedAt: now, optimizationNotes: notes, updatedBy: req.user._id });

    await createAuditLog({
      user: req.user,
      moduleName: 'Yard Density',
      actionType: 'optimize',
      recordId: 'yard-optimization',
      previousValues: null,
      updatedValues: { moves: moves.length, timestamp: now },
      description: notes
    });

    await sendNotification({
      module: 'Yard Density',
      action: 'Optimize Placement',
      message: `Yard optimization completed: ${moves.length} containers repositioned`,
      recordId: 'yard-optimization',
      createdBy: req.user._id,
      dedupeKey: `yard:optimize:${now.toISOString().slice(0, 16)}`
    });

    const updatedBlocks = await exports.getBlocksData();

    res.json({
      success: true,
      message: `Optimization complete: ${moves.length} containers repositioned`,
      data: { moves, blocks: updatedBlocks }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getBlocksData = async () => {
  await ensureDefaultBlocks();
  const blocks = await YardBlock.find().sort('blockId');
  return Promise.all(blocks.map(async (block) => {
    const stats = await computeBlockStats(block.blockId, block.capacity, block.type);
    return {
      id: block.blockId,
      blockId: block.blockId,
      capacity: block.capacity,
      occupied: stats.occupied,
      density: stats.density,
      type: block.type,
      lastOptimizedAt: block.lastOptimizedAt,
      optimizationNotes: block.optimizationNotes
    };
  }));
};

exports.updateBlock = async (req, res) => {
  try {
    const block = await YardBlock.findOneAndUpdate(
      { blockId: req.params.id.toUpperCase() },
      req.body,
      { new: true, runValidators: true }
    );
    if (!block) {
      return res.status(404).json({ success: false, message: 'Block not found' });
    }
    res.json({ success: true, message: 'Block updated', data: block });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
