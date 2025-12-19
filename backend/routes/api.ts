/**
 * API Routes
 *
 * RESTful API endpoints for managing cost models and measured works.
 *
 * Phase 4 - Commit 4: GET endpoints
 * Phase 6 - Commit 1: PATCH endpoint for updating measured works
 * Phase 6 - Commit 2: DELETE endpoint for individual measured works
 * Phase 6 - Commit 3: POST endpoint for totalCost recalculation
 */

import { Router, Request, Response } from 'express';
import * as store from '../data/store.js';
import { getNRM2Defaults } from '../config/loader';
import {
  validateRequest,
  createModelSchema,
  updateMeasuredWorkSchema,
  type CreateModelInput,
  type UpdateMeasuredWorkInput
} from '../middleware/validation';

const router = Router();

// ============================================================================
// GET Endpoints
// ============================================================================

/**
 * GET /api/models
 *
 * List all cost models
 *
 * Response: 200 OK
 * Body: Array of cost models
 */
router.get('/models', (req: Request, res: Response) => {
  const models = store.getAllModels();

  res.json({
    success: true,
    count: models.length,
    data: models
  });
});

/**
 * GET /api/models/:id
 *
 * Get a single cost model with its measured works
 *
 * Response: 200 OK (found) or 404 Not Found
 * Body: Cost model with measured works array
 */
router.get('/models/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  // Find the cost model
  const model = store.findModelById(id);

  if (!model) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Cost model with ID '${id}' not found`
    });
  }

  // Get all measured works for this model
  const works = store.getWorksByModelId(id);

  res.json({
    success: true,
    data: {
      model,
      works,
      worksCount: works.length
    }
  });
});

// ============================================================================
// POST Endpoints
// ============================================================================

/**
 * POST /api/models
 *
 * Create a new cost model and pre-populate with NRM2 default elements
 *
 * Request body: CreateModelInput (validated by Zod)
 * Response: 201 Created with new model and its measured works
 */
router.post('/models', validateRequest(createModelSchema), (req: Request, res: Response) => {
  try {
    const input = req.body as CreateModelInput;

    // Create the cost model with initial totalCost of 0
    const newModel = store.createModel({
      projectName: input.projectName,
      projectRef: input.projectRef,
      client: input.client,
      gifa: input.gifa,
      totalCost: 0,
      status: input.status || 'draft',
      preparedBy: input.preparedBy
    });

    // Load NRM2 default elements
    const nrm2Elements = getNRM2Defaults();

    // Pre-populate measured works from NRM2 defaults
    // Each element starts with quantity=0 and unitRate=0
    const measuredWorks = nrm2Elements.map(element => {
      return store.createWork({
        costModelId: newModel.id,
        elementCode: element.code,
        elementName: element.name,
        description: element.description || element.name,
        quantity: 0,
        unit: element.suggestedUnit as 'm2' | 'm3' | 'm' | 'nr' | 't' | 'ls',
        unitRate: 0,
        notes: 'Auto-generated from NRM2 defaults'
      });
    });

    console.log(`✓ Created model ${newModel.id} with ${measuredWorks.length} pre-populated works`);

    // Return 201 Created with the new model and works
    res.status(201).json({
      success: true,
      message: 'Cost model created successfully',
      data: {
        model: newModel,
        works: measuredWorks,
        worksCount: measuredWorks.length
      }
    });
  } catch (error) {
    console.error('Error creating cost model:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to create cost model'
    });
  }
});

/**
 * POST /api/models/:id/calculate
 *
 * Recalculate and update the model's totalCost
 * Sums all measured works for the model and updates the totalCost field
 *
 * Response: 200 OK with updated model, or 404 Not Found
 *
 * Use this after creating, updating, or deleting measured works
 * to ensure the model totalCost stays in sync
 */
router.post('/models/:id/calculate', (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Recalculate total cost
    const updatedModel = store.recalculateModelTotalCost(id);

    if (!updatedModel) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Cost model with ID '${id}' not found`
      });
    }

    // Return updated model
    res.json({
      success: true,
      message: 'Total cost recalculated successfully',
      data: {
        model: updatedModel,
        totalCost: updatedModel.totalCost
      }
    });
  } catch (error) {
    console.error('Error recalculating total cost:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to recalculate total cost'
    });
  }
});

// ============================================================================
// PATCH Endpoints
// ============================================================================

/**
 * PATCH /api/measured-works/:id
 *
 * Update a measured work (partial update)
 *
 * Request body: UpdateMeasuredWorkInput (validated by Zod)
 * Response: 200 OK with updated work, or 404 Not Found
 *
 * Automatically recalculates totalCost if quantity or unitRate changes
 */
router.patch('/measured-works/:id', validateRequest(updateMeasuredWorkSchema), (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body as UpdateMeasuredWorkInput;

    // Check if at least one field is provided
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'No update fields provided'
      });
    }

    // Update the work
    const updatedWork = store.updateWork(id, updates);

    if (!updatedWork) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Measured work with ID '${id}' not found`
      });
    }

    console.log(`✓ Updated measured work ${id}`);

    // Return 200 OK with updated work
    res.json({
      success: true,
      message: 'Measured work updated successfully',
      data: updatedWork
    });
  } catch (error) {
    console.error('Error updating measured work:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to update measured work'
    });
  }
});

// ============================================================================
// DELETE Endpoints
// ============================================================================

/**
 * DELETE /api/models/:id
 *
 * Delete a cost model and cascade delete all related measured works
 *
 * Response: 204 No Content (success) or 404 Not Found
 */
router.delete('/models/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if model exists
  const model = store.findModelById(id);
  if (!model) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Cost model with ID '${id}' not found`
    });
  }

  // Cascade delete: remove all measured works first
  const deletedWorksCount = store.deleteMeasuredWorksByModelId(id);

  // Delete the model
  store.deleteModel(id);

  console.log(`✓ Deleted model ${id} and ${deletedWorksCount} related works`);

  // Return 204 No Content (successful deletion, no body)
  res.status(204).send();
});

/**
 * DELETE /api/measured-works/:id
 *
 * Delete a single measured work
 *
 * Response: 204 No Content (success) or 404 Not Found
 *
 * Note: This does NOT automatically update the parent model's totalCost.
 * Client should call POST /api/models/:modelId/calculate after deletion.
 */
router.delete('/measured-works/:id', (req: Request, res: Response) => {
  const { id } = req.params;

  // Check if work exists
  const work = store.findWorkById(id);
  if (!work) {
    return res.status(404).json({
      success: false,
      error: 'Not Found',
      message: `Measured work with ID '${id}' not found`
    });
  }

  // Delete the work
  const deleted = store.deleteWork(id);

  if (!deleted) {
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to delete measured work'
    });
  }

  console.log(`✓ Deleted measured work ${id}`);

  // Return 204 No Content (successful deletion, no body)
  res.status(204).send();
});

export default router;
 