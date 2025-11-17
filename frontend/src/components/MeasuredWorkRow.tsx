// frontend/src/components/MeasuredWorkRow.tsx

import type { MeasuredWork } from '../types/models';
import { Currency } from './Currency';

interface MeasuredWorkRowProps {
  work: MeasuredWork;
}

/**
 * MeasuredWorkRow - Renders a single measured work as table row
 *
 * Demonstrates:
 * - Component composition (uses Currency component)
 * - Receiving complex object as prop
 * - Formatting data for display
 */
export function MeasuredWorkRow({ work }: MeasuredWorkRowProps) {
  return (
    <tr className="measured-work-row">
      <td className="code-cell">{work.elementCode}</td>
      <td className="name-cell">{work.elementName}</td>
      <td className="description-cell">{work.description}</td>
      <td className="number-cell">{work.quantity.toFixed(2)}</td>
      <td className="unit-cell">{work.unit}</td>
      <td className="currency-cell">
        <Currency amount={work.unitRate} />
      </td>
      <td className="currency-cell total-cell">
        <Currency amount={work.totalCost} />
      </td>
    </tr>
  );
}