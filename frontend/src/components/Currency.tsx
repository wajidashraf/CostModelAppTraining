// frontend/src/components/Currency.tsx:20-66
interface CurrencyProps {
  amount: number;
  showSymbol?: boolean;
}

export function Currency({ amount, showSymbol = true }: CurrencyProps){
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