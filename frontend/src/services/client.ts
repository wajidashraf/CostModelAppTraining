import type { CostModel, MeasuredWork } from '../types/models';

const BASE = import.meta.env.VITE_API_BASE ?? '';

async function request<T>(path: string, opts?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json'
    },
    ...opts
  });

  if (!res.ok) {
    // Try to read error body for better message
    let bodyText = '';
    try { bodyText = await res.text(); } catch (_) {}
    throw new Error(`${res.status} ${res.statusText}: ${bodyText}`);
  }

  const json = await res.json();
  return json as T;
}

export async function getModels(): Promise<CostModel[]> {
  const resp = await request<{ success: boolean; count: number; data: CostModel[] }>(`/api/models`);
  return resp.data;
}

export async function getModelById(id: string): Promise<{ model: CostModel; works: MeasuredWork[] }>{
  const resp = await request<{ success: boolean; data: { model: CostModel; works: MeasuredWork[] } }>(`/api/models/${id}`);
  return resp.data;
}
