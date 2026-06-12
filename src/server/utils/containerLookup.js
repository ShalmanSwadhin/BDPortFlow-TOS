const mongoose = require('mongoose');
const Container = require('../models/Container');

function isValidObjectId(value) {
  if (!value || !mongoose.Types.ObjectId.isValid(value)) return false;
  return String(new mongoose.Types.ObjectId(value)) === String(value);
}

/**
 * Find container by business containerId (e.g. MAEU000195).
 * Uses Mongo _id only when the identifier is a valid ObjectId string.
 */
async function findContainerByIdentifier(identifier) {
  if (!identifier) return null;

  const containerNumber = String(identifier).toUpperCase().trim();
  const byBusinessId = await Container.findOne({ containerId: containerNumber });
  if (byBusinessId) return byBusinessId;

  if (isValidObjectId(identifier)) {
    return Container.findById(identifier);
  }

  return null;
}

module.exports = { findContainerByIdentifier, isValidObjectId };
