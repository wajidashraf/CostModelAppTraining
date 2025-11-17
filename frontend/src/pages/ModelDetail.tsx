

import { Currency } from '../components/Currency';
import { MeasuredWorkRow } from '../components/MeasuredWorkRow';
import type { MeasuredWork } from '../types/models';

import { useFetchModelById } from '../hooks/useApi';

/**
 * Props for ModelDetail component
 */
interface ModelDetailProps {
  /**
   * The ID of the cost model to display
   */
  modelId: string;

  /**
   * Callback function to navigate back to list
   */
  onBack: () => void;
}

/**
 *
 * @param props - ModelDetailProps
 * @returns JSX page with model details and measured works
 *
 * Demonstrates:
 */
export function ModelDetail({ modelId, onBack }: ModelDetailProps) {
  // Fetch model and works from backend API
  const { model, works, loading, error } = useFetchModelById(modelId);


  if (loading) {
    return (
      <div className="model-detail-page">
        Loading..
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="model-detail-page">
        <div className="error-state">
          <p>❌ Error loading model</p>
          <p className="error-message">{error}</p>
          <button onClick={onBack} className="action-button">
            Back to List
          </button>
        </div>
      </div>
    );
  }

  // Show "not found" if no model
  if (!model) {
    return (
      <div className="model-detail-page">
        <div className="error-state">
          <p>⚠️ Model not found</p>
          <button onClick={onBack} className="action-button">
            Back to List
          </button>
        </div>
      </div>
    );
  }

  // Show model details
  return (
    <div className="model-detail-page">
      <div className="page-header">
        <button onClick={onBack} className="back-button">
          ← Back to Models
        </button>
        <h2>{model.projectName}</h2>
        <span className={`status-badge status-${model.status}`}>
          {model.status.toUpperCase()}
        </span>
      </div>

      <div className="model-info">
        <div className="info-grid">
          <div className="info-item">
            <label>Project Reference:</label>
            <span>{model.projectRef || 'N/A'}</span>
          </div>
          <div className="info-item">
            <label>Client:</label>
            <span>{model.client || 'N/A'}</span>
          </div>
          <div className="info-item">
            <label>GIFA:</label>
            <span>{model.gifa ? `${model.gifa.toLocaleString()} m²` : 'N/A'}</span>
          </div>
          <div className="info-item">
            <label>Prepared By:</label>
            <span>{model.preparedBy || 'N/A'}</span>
          </div>
          <div className="info-item total-cost-item">
            <label>Total Cost:</label>
            <span className="total-cost-value">
              <Currency amount={model.totalCost} />
            </span>
          </div>
        </div>
      </div>

      <div className="measured-works-section">
        <h3>Measured Works ({works.length} items)</h3>

        {works.length === 0 ? (
          <div className="empty-state">
            <p>📋 No measured works for this cost model</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="measured-works-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Element</th>
                  <th>Description</th>
                  <th>Quantity</th>
                  <th>Unit</th>
                  <th>Unit Rate</th>
                  <th>Total Cost</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {works.map((work: MeasuredWork) => (
                  <MeasuredWorkRow
                    key={work.id}
                    work={work}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="event-info type-info">
        <strong>Navigation Event Handler:</strong>

        The "Back to Models" button calls onBack() callback.

        Parent component (App) receives this and changes the current page state.

        This demonstrates how child components trigger parent state changes.
      </div>
    </div>
  );
}