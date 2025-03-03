import { Select } from "@egaranti/components";

const EmployeeFieldRenderer = ({ field, value, onChange, error, disabled }) => {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-gray-700">
        {field.label}
        {field.required && <span className="text-red-500">*</span>}
      </label>
      <Select
        value={value}
        onChange={(value) => onChange(value)}
        placeholder={field.placeholder || "Çalışan seçiniz"}
        disabled={disabled}
        error={error}
        options={
          field.employees?.map((employee) => ({
            label: employee.name,
            value: employee.id,
          })) || []
        }
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
};

export default EmployeeFieldRenderer;
