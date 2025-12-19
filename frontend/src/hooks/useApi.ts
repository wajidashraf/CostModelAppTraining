import { useEffect, useState } from 'react';
import type { CostModel, MeasuredWork } from '../types/models';
import * as api from '../services/client';

export function useFetchModels() {
  const [models, setModels] = useState<CostModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const data = await api.getModels();
        if (active) {
          setModels(data);
          setError(null);
        }
      } catch (err) {
        if (active) setError((err as Error).message);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, []);

  return { models, loading, error };
}

export function useFetchModelById(modelId: string) {
  const [model, setModel] = useState<CostModel | null>(null);
  const [works, setWorks] = useState<MeasuredWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const fetchModel = async () => {
      setLoading(true);
      try {
        const resp = await api.getModelById(modelId);
        if (active) {
          setModel(resp.model);
          setWorks(resp.works || []);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setModel(null);
          setWorks([]);
          setError((err as Error).message);
        }
      } finally {
        if (active) setLoading(false);
      }
    };
    fetchModel();
    return () => {
      active = false;
    };
  }, [modelId]);

  return { model, works, loading, error };
}