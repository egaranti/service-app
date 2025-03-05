import { Input } from "@egaranti/components";

import BaseFieldRenderer from "./BaseFieldRenderer";

const NumberFieldRenderer = ({ field, value, onChange, error, disabled }) => {
  return (
    <BaseFieldRenderer field={field} error={error} touched={false}>
      <Input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={field.placeholder}
        disabled={disabled}
      />
    </BaseFieldRenderer>
  );
};

export default NumberFieldRenderer;
