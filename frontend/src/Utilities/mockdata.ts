import type { CostModel, MeasuredWork } from '../types/models';

export const models: CostModel[] = [
  {
    id: 'model-1',
    projectName: 'Block A Residential Development',
    projectRef: 'PRJ-2024-001',
    client: 'Acme Estates Ltd',
    gifa: 2500.00,
    totalCost: 4500000.00,
    status: 'draft',
    preparedBy: 'John Smith',
    createdAt: '2024-11-01T10:00:00Z',
    updatedAt: '2024-11-06T10:00:00Z'
  },
  {
    id: 'model-2',
    projectName: 'Office Refurbishment - Central London',
    projectRef: 'PRJ-2024-002',
    client: 'City Properties Group',
    gifa: 1800.00,
    totalCost: 3200000.00,
    status: 'approved',
    preparedBy: 'Sarah Jones',
    createdAt: '2024-10-15T09:30:00Z',
    updatedAt: '2024-11-05T14:20:00Z'
  },
  {
    id: 'model-3',
    projectName: 'School Extension Project',
    projectRef: 'PRJ-2024-003',
    client: 'Local Education Authority',
    gifa: 950.00,
    totalCost: 1850000.00,
    status: 'archived',
    preparedBy: 'Mike Brown',
    createdAt: '2024-09-01T11:00:00Z',
    updatedAt: '2024-10-20T16:45:00Z'
  }
];

export const mockMeasuredWorks: MeasuredWork[] = [
  // Model 1 works
  {
    id: 'work-1',
    costModelId: 'model-1',
    elementCode: '2.1',
    elementName: 'Substructure',
    description: 'Concrete strip foundations',
    quantity: 150.00,
    unit: 'm3',
    unitRate: 450.00,
    totalCost: 67500.00,
    createdAt: '2024-11-01T10:30:00Z',
    updatedAt: '2024-11-01T10:30:00Z'
  },
  // ... more measured works
];