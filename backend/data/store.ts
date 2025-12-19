/**
 * In-Memory Data Store
 *
 * This module provides in-memory storage for cost models and measured works.
 * Data is stored in JavaScript arrays and will be lost when the server restarts.
 *
 * Phase 4 - Commit 2: In-memory storage with helper functions
 *
 * Trade-offs of In-Memory Storage:
 * ✅ Pros:
 *   - Simple to implement (no database setup required)
 *   - Fast (data is in RAM)
 *   - Great for learning and prototyping
 *   - No external dependencies
 *
 * ❌ Cons:
 *   - Data lost on server restart
 *   - Not suitable for production
 *   - Cannot scale across multiple servers
 *   - No data persistence or backup
 *
 * For production, you would use a database (PostgreSQL, MongoDB, etc.)
 */

import type { CostModel, MeasuredWork } from '../types/models.js';

/**
 * In-memory storage arrays
 * These act as our "database tables"
 */
let costModels: CostModel[] = [];
let measuredWorks: MeasuredWork[] = [];

/**
 * Simple ID Generator
 *
 * Generates unique IDs using timestamp + random number.
 * Format: "cm_1699876543210_8d4f2" or "mw_1699876543210_3a7b9"
 *
 * @param prefix - Prefix for the ID ('cm' for cost model, 'mw' for measured work)
 * @returns Unique ID string
 */
export function generateId(prefix: string = 'id'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 7);
  return `${prefix}_${timestamp}_${random}`;
}

/**
 * Get current timestamp in ISO 8601 format
 * Example: "2024-11-06T12:00:00.000Z"
 */
export function getCurrentTimestamp(): string {
  return new Date().toISOString();
}

// ============================================================================
// Cost Model Operations
// ============================================================================

/**
 * Get all cost models
 * @returns Array of all cost models
 */
export function getAllModels(): CostModel[] {
  return costModels;
}

/**
 * Find a cost model by ID
 * @param id - The model ID to search for
 * @returns The found model or undefined
 */
export function findModelById(id: string): CostModel | undefined {
  return costModels.find(model => model.id === id);
}

/**
 * Create a new cost model
 * @param data - Partial cost model data (without id, timestamps)
 * @returns The newly created cost model
 */
export function createModel(
  data: Omit<CostModel, 'id' | 'createdAt' | 'updatedAt'>
): CostModel {
  const now = getCurrentTimestamp();
  const newModel: CostModel = {
    id: generateId('cm'),
    ...data,
    createdAt: now,
    updatedAt: now
  };

  costModels.push(newModel);
  console.log(`✓ Created cost model: ${newModel.id} - ${newModel.projectName}`);
  return newModel;
}

/**
 * Update a cost model's total cost
 * @param id - Model ID
 * @param totalCost - New total cost
 * @returns Updated model or undefined if not found
 */
export function updateModelTotalCost(id: string, totalCost: number): CostModel | undefined {
  const model = findModelById(id);
  if (!model) return undefined;

  model.totalCost = totalCost;
  model.updatedAt = getCurrentTimestamp();
  return model;
}

/**
 * Calculate and update total cost for a cost model
 * Sums up all measured works totalCost and updates the model
 * @param id - Model ID
 * @returns Updated model with recalculated totalCost, or undefined if not found
 */
export function recalculateModelTotalCost(id: string): CostModel | undefined {
  const model = findModelById(id);
  if (!model) return undefined;

  // Get all works for this model
  const works = getWorksByModelId(id);

  // Sum up all work totalCosts
  const totalCost = works.reduce((sum, work) => sum + work.totalCost, 0);

  // Update the model
  model.totalCost = totalCost;
  model.updatedAt = getCurrentTimestamp();

  console.log(`✓ Recalculated total cost for model ${id}: ${totalCost}`);
  return model;
}

/**
 * Delete a cost model
 * @param id - Model ID to delete
 * @returns true if deleted, false if not found
 */
export function deleteModel(id: string): boolean {
  const initialLength = costModels.length;
  costModels = costModels.filter(model => model.id !== id);

  const deleted = costModels.length < initialLength;
  if (deleted) {
    console.log(`✓ Deleted cost model: ${id}`);
  }
  return deleted;
}

// ============================================================================
// Measured Work Operations
// ============================================================================

/**
 * Get all measured works
 * @returns Array of all measured works
 */
export function getAllWorks(): MeasuredWork[] {
  return measuredWorks;
}

/**
 * Get measured works for a specific cost model
 * @param costModelId - The cost model ID
 * @returns Array of measured works for the model
 */
export function getWorksByModelId(costModelId: string): MeasuredWork[] {
  return measuredWorks.filter(work => work.costModelId === costModelId);
}

/**
 * Find a measured work by ID
 * @param id - The work ID to search for
 * @returns The found work or undefined
 */
export function findWorkById(id: string): MeasuredWork | undefined {
  return measuredWorks.find(work => work.id === id);
}

/**
 * Create a new measured work
 * @param data - Partial measured work data (without id, timestamps)
 * @returns The newly created measured work
 */
export function createWork(
  data: Omit<MeasuredWork, 'id' | 'createdAt' | 'updatedAt' | 'totalCost'>
): MeasuredWork {
  const now = getCurrentTimestamp();
  const totalCost = data.quantity * data.unitRate;

  const newWork: MeasuredWork = {
    id: generateId('mw'),
    ...data,
    totalCost,
    createdAt: now,
    updatedAt: now
  };

  measuredWorks.push(newWork);
  console.log(`✓ Created measured work: ${newWork.id} - ${newWork.elementName}`);
  return newWork;
}

/**
 * Delete all measured works for a specific cost model
 * Used for cascade deletion when a model is deleted
 * @param costModelId - The cost model ID
 * @returns Number of works deleted
 */
export function deleteMeasuredWorksByModelId(costModelId: string): number {
  const initialLength = measuredWorks.length;
  measuredWorks = measuredWorks.filter(work => work.costModelId !== costModelId);

  const deletedCount = initialLength - measuredWorks.length;
  if (deletedCount > 0) {
    console.log(`✓ Deleted ${deletedCount} measured works for model: ${costModelId}`);
  }
  return deletedCount;
}

/**
 * Update a measured work
 * @param id - Work ID to update
 * @param updates - Partial data to update
 * @returns Updated work or undefined if not found
 */
export function updateWork(
  id: string,
  updates: Partial<Omit<MeasuredWork, 'id' | 'costModelId' | 'createdAt' | 'updatedAt' | 'totalCost'>>
): MeasuredWork | undefined {
  const work = findWorkById(id);
  if (!work) return undefined;

  // Apply updates
  Object.assign(work, updates);

  // Recalculate totalCost if quantity or unitRate changed
  if (updates.quantity !== undefined || updates.unitRate !== undefined) {
    work.totalCost = work.quantity * work.unitRate;
  }

  // Update timestamp
  work.updatedAt = getCurrentTimestamp();

  console.log(`✓ Updated measured work: ${id}`);
  return work;
}

/**
 * Delete a measured work by ID
 * @param id - Work ID to delete
 * @returns true if deleted, false if not found
 */
export function deleteWork(id: string): boolean {
  const initialLength = measuredWorks.length;
  measuredWorks = measuredWorks.filter(work => work.id !== id);

  const deleted = measuredWorks.length < initialLength;
  if (deleted) {
    console.log(`✓ Deleted measured work: ${id}`);
  }
  return deleted;
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get store statistics (useful for debugging)
 */
export function getStoreStats() {
  return {
    totalModels: costModels.length,
    totalWorks: measuredWorks.length,
    timestamp: getCurrentTimestamp()
  };
}

/**
 * Clear all data (useful for testing)
 * WARNING: This deletes everything!
 */
export function clearAllData(): void {
  costModels = [];
  measuredWorks = [];
  console.log('⚠️  All data cleared from in-memory store');
}

/**
 * Initialize with seed data (optional)
 * Can be called at server startup to populate with sample data
 */
export function seedData(): void {
  // Clear existing data
  clearAllData();

  // Create sample cost models with measured works
  const model1 = createModel({
    projectName: 'Block A Residential Development',
    projectRef: 'PRJ-2024-001',
    client: 'Acme Estates Ltd',
    gifa: 2500.00,
    totalCost: 0,
    status: 'draft',
    preparedBy: 'John Smith'
  });

  const model2 = createModel({
    projectName: 'Office Refurbishment - Central London',
    projectRef: 'PRJ-2024-002',
    client: 'City Properties Group',
    gifa: 1800.00,
    totalCost: 0,
    status: 'approved',
    preparedBy: 'Sarah Jones'
  });

  const model3 = createModel({
    projectName: 'School Extension Project',
    projectRef: 'PRJ-2024-003',
    client: 'Local Education Authority',
    gifa: 950.00,
    totalCost: 0,
    status: 'archived',
    preparedBy: 'Mike Brown'
  });

  // Add sample measured works for model1
  const work1 = createWork({
    costModelId: model1.id,
    elementCode: '2.1',
    elementName: 'Substructure',
    description: 'Concrete strip foundations',
    quantity: 150.00,
    unit: 'm3',
    unitRate: 450.00,
    notes: 'Foundation works'
  });

  const work2 = createWork({
    costModelId: model1.id,
    elementCode: '3',
    elementName: 'Frame',
    description: 'Structural frame works',
    quantity: 50.00,
    unit: 'm2',
    unitRate: 850.00,
    notes: 'Steel frame installation'
  });

  // Add sample measured works for model2
  const work3 = createWork({
    costModelId: model2.id,
    elementCode: '4',
    elementName: 'External Walls',
    description: 'Facade works',
    quantity: 280.00,
    unit: 'm2',
    unitRate: 220.00,
    notes: 'Curtain wall system'
  });

  // Recalculate totals
  recalculateModelTotalCost(model1.id);
  recalculateModelTotalCost(model2.id);
  recalculateModelTotalCost(model3.id);

  console.log('✓ In-memory store initialized with seed data');
  console.log(`  - ${costModels.length} models created`);
  console.log(`  - ${measuredWorks.length} measured works created`);
}
 