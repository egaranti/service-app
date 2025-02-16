import { Input } from "@egaranti/components";

const NumberFieldRenderer = ({ field, value, onChange, error, disabled }) => {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500">*</span>}
      </label>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        disabled={disabled}
        error={error}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default NumberFieldRenderer;
