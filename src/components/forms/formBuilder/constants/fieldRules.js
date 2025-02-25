/**
 * Validates if a field can be added to the form based on defined rules
 * @param {string} fieldType - The type of field being added
 * @param {Array} currentFields - The current fields in the form
 * @returns {Object} - Validation result with valid flag and message
 */
export const validateFieldAddition = (fieldType, currentFields) => {
  // Rule: Only one STATUS field is allowed per form
  if (fieldType === "STATUS") {
    const hasStatusField = currentFields.some(
      (field) => field.type === "STATUS",
    );

    if (hasStatusField) {
      return {
        valid: false,
        message: "Bir formda sadece bir durum alanı eklenebilir.",
      };
    }
  }

  // Add more field validation rules here as needed

  // If no rules are violated, the field addition is valid
  return {
    valid: true,
    message: null,
  };
};
