export interface MeasuredWork {
  id: string;
  costModelId: string;
  elementCode: string;
  elementName: string;
  description: string;
  quantity: number;
  unit: 'm2' | 'm3' | 'm' | 'nr' | 't' | 'ls';  // Type union (Commit 2)
  unitRate: number;
  totalCost: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

// frontend/src/types/models.ts:28-46
export interface CostModel {
  id: string;              // Required field
  projectName: string;     // Required field
  projectRef?: string;     // Optional field (? marker)
  client?: string;         // Optional field
  gifa?: number;           // Optional field
  totalCost: number;       // Required field
  status: 'draft' | 'approved' | 'archived';
  preparedBy?: string;     // Optional field
  createdAt: string;       // Required field
  updatedAt: string;       // Required field
}

export interface NRM2Element {
  code: string;
  name: string;
  suggestedUnit: string;
  description?: string;
}

