import type { MeasuredWork } from '../types/models';

export function calculateCost(quantity: number, unitPrice: number): number {
    const q = Number(quantity) || 0;
    const p = Number(unitPrice) || 0;
    const total = q * p;
    // Round to 2 decimal places to avoid floating point precision issues
    return Math.round((total + Number.EPSILON) * 100) / 100;
}

export function sumMeasuredWorks(works : MeasuredWork[]): number {

    return works.reduce((acc, work) => acc + work.totalCost, 0);

}
export function groupByElementCode(works: MeasuredWork[]): Map<string, MeasuredWork[]> {
  const groups = new Map<string, MeasuredWork[]>();

  works.forEach(work => {
    const code = work.elementCode;

    if (!groups.has(code)) {
      groups.set(code, []);
    }

    groups.get(code)!.push(work);
  });

  return groups;
}

// frontend/src/components/Currency.tsx:20-66
interface CurrencyProps {
  amount: number;
  showSymbol?: boolean;
}

export function Currency({ amount, showSymbol = true }: CurrencyProps):{
  const formatted = amount.toLocaleString('en-GB', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  return (
    <span>
      {showSymbol && '£'}
      {formatted}
    </span>
  );
}