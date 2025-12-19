/**
 * Request Validation Middleware
 *
 * Uses Zod for runtime type validation of API requests.
 * Ensures incoming data matches expected schema before processing.
 *
 * Phase 4 - Commit 5: Zod validation schemas
 */

import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

/**
 * Zod Schema for Creating a Cost Model
 *
 * Validates POST /api/models request body
 */
export const createModelSchema = z.object({
  projectName: z.string()
    .min(1, 'Project name is required')
    .max(200, 'Project name must be less than 200 characters'),

  projectRef: z.string()
    .max(50, 'Project reference must be less than 50 characters')
    .optional(),

  client: z.string()
    .max(200, 'Client name must be less than 200 characters')
    .optional(),

  gifa: z.number()
    .positive('GIFA must be a positive number')
    .optional(),

  status: z.enum(['draft', 'approved', 'archived'])
    .default('draft'),

  preparedBy: z.string()
    .max(100, 'Prepared by must be less than 100 characters')
    .optional()
});

/**
 * Type inference from Zod schema
 * This gives us a TypeScript type from the schema
 */
export type CreateModelInput = z.infer<typeof createModelSchema>;

/**
 * Zod Schema for Creating a Measured Work
 *
 * Validates POST /api/models/:id/works request body (future use)
 */
export const createMeasuredWorkSchema = z.object({
  elementCode: z.string()
    .min(1, 'Element code is required'),

  elementName: z.string()
    .min(1, 'Element name is required')
    .max(200, 'Element name must be less than 200 characters'),

  description: z.string()
    .min(1, 'Description is required')
    .max(500, 'Description must be less than 500 characters'),

  quantity: z.number()
    .nonnegative('Quantity must be non-negative'),

  unit: z.enum(['m2', 'm3', 'm', 'nr', 't', 'ls']),

  unitRate: z.number()
    .nonnegative('Unit rate must be non-negative'),

  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
});

export type CreateMeasuredWorkInput = z.infer<typeof createMeasuredWorkSchema>;

/**
 * Zod Schema for Updating a Measured Work
 *
 * Validates PATCH /api/measured-works/:id request body
 * All fields are optional (partial update)
 */
export const updateMeasuredWorkSchema = z.object({
  elementCode: z.string()
    .min(1, 'Element code cannot be empty')
    .optional(),

  elementName: z.string()
    .min(1, 'Element name cannot be empty')
    .max(200, 'Element name must be less than 200 characters')
    .optional(),

  description: z.string()
    .min(1, 'Description cannot be empty')
    .max(500, 'Description must be less than 500 characters')
    .optional(),

  quantity: z.number()
    .nonnegative('Quantity must be non-negative')
    .optional(),

  unit: z.enum(['m2', 'm3', 'm', 'nr', 't', 'ls'])
    .optional(),

  unitRate: z.number()
    .nonnegative('Unit rate must be non-negative')
    .optional(),

  notes: z.string()
    .max(500, 'Notes must be less than 500 characters')
    .optional()
}).strict(); // Reject any fields not in schema

export type UpdateMeasuredWorkInput = z.infer<typeof updateMeasuredWorkSchema>;

/**
 * Validation Middleware Factory
 *
 * Creates Express middleware that validates request body against a Zod schema.
 *
 * @param schema - Zod schema to validate against
 * @returns Express middleware function
 *
 * Usage:
 *   router.post('/models', validateRequest(createModelSchema), handler);
 */
export function validateRequest(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate and parse request body
      // This will throw ZodError if validation fails
      const validated = schema.parse(req.body);

      // Replace req.body with validated/transformed data
      req.body = validated;

      // Continue to next middleware/handler
      next();
    } catch (error) {
      // Handle Zod validation errors
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation Error',
          message: 'Invalid request data',
          details: error.issues.map((err: z.ZodIssue) => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }

      // Handle unexpected errors
      next(error);
    }
  };
}

/**
 * Example validation error response:
 *
 * {
 *   "success": false,
 *   "error": "Validation Error",
 *   "message": "Invalid request data",
 *   "details": [
 *     {
 *       "field": "projectName",
 *       "message": "Project name is required"
 *     },
 *     {
 *       "field": "gifa",
 *       "message": "GIFA must be a positive number"
 *     }
 *   ]
 * }
 */
 