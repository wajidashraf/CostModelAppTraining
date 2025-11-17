// frontend/src/components/DecimalInput.tsx:16-114
interface DecimalInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  min?: number;
  max?: number;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function DecimalInput({
  label,
  value,
  onChange,
  placeholder,
  min,
  max,
  disabled = false,
  error,
  required = false,
  className = '',
  ariaLabel,
}: DecimalInputProps) {
  // Implementation includes validation logic
  return (
    <div className={`decimal-input ${className}`}>
      {label && <label>{label}</label>}
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step="0.01"
        disabled={disabled}
        aria-label={ariaLabel || label}
        required={required}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}
 