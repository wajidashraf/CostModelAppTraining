/**
 * Shared TypeScript Type Definitions for Backend
 *
 * These types match the frontend types to ensure consistency
 * across the full stack application.
 */

export interface CostModel {
    id: string;
    projectName: string;
    projectRef?: string;
    client?: string;
    gifa?: number;
    totalCost: number;
    status: 'draft' | 'approved' | 'archived';
    preparedBy?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface MeasuredWork {
    id: string;
    costModelId: string;
    elementCode: string;
    elementName: string;
    description: string;
    quantity: number;
    unit: 'm2' | 'm3' | 'm' | 'nr' | 't' | 'ls';
    unitRate: number;
    totalCost: number;
    notes?: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface NRM2Element {
    code: string;
    name: string;
    suggestedUnit: string;
    description?: string;
  }  