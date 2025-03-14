export const mapFormField = (field) => ({
  name: `field_${field.id}`,
  label: field.label || "",
  type: field.type || "TEXT",
  required: field.required || false,
  placeholder: field.placeholder || "",
  options: field.options || [],
  employees: field.employees || [],
  hidden: field.hiddenForCustomer || false,
  merchantConstantId: field.merchantConstantId || null,
  hasMultiplier: field.hasMultiplier || false,
  order: field.order || 0,
  status: field.status || [],
});
