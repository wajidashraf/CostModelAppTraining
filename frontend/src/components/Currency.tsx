// frontend/src/components/Currency.tsx
import type { ReactNode } from 'react';

interface CurrencyProps {
  amount: number;
  showSymbol?: boolean;
}

export function Currency({ amount, showSymbol = true }: CurrencyProps): ReactNode {
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