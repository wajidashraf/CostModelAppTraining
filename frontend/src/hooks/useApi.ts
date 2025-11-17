import { useEffect, useState } from 'react';
import { models, mockMeasuredWorks } from '../Utilities/mockdata';
import type { CostModel, MeasuredWork } from '../types/models';

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
        const found = models.find((m) => m.id === modelId);
        if (!found) {
          if (active) {
            setModel(null);
            setWorks([]);
            setError('Model not found');
          }
          return;
        }
        const relatedWorks = mockMeasuredWorks.filter(
          (work) => work.costModelId === modelId
        );
        if (active) {
          setModel(found);
          setWorks(relatedWorks);
          setError(null);
        }
      } catch (err) {
        if (active) {
          setModel(null);
          setWorks([]);
          setError((err as Error).message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchModel();
    return () => {
      active = false;
    };
  }, [modelId]);
  return { model, works, loading, error };
}