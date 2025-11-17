
import type{ CostModel } from '../types/models'

interface ModelListProps {
  models: CostModel[];
  handleViewDetails: (id: string) => void;
}

export function ModelList({ models, handleViewDetails }: ModelListProps) {
  return (
    <div className="model-list">
{models.map((model) => (
    <tr key={model.id} className="model-row">
      <td className="name-cell">{model.projectName}</td>
      <td>{model.projectRef || '-'}</td>
      <td>{model.client || '-'}</td>
      <td className="number-cell">
        {model.gifa ? model.gifa.toLocaleString() : '-'}
      </td>
      <td>
        <span className={`status-badge status-${model.status}`}>
          {model.status.toUpperCase()}
        </span>
      </td>
      <td>
        <button
          onClick={() => handleViewDetails(model.id)}
          className="action-button"
        >
          View Details
        </button>
      </td>
    </tr>
  ))}
        
      </div>
    );
  }