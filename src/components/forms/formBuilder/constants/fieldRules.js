/**
 * Validates if a field can be added to the form based on defined rules
 * @param {string} fieldType - The type of field being added
 * @param {Array} currentFields - The current fields in the form
 * @returns {Object} - Validation result with valid flag and message
 */
export const validateFieldAddition = (fieldType, currentFields) => {
  if (fieldType === "SPARE_PART") {
    const hasSparePartField = currentFields.some(
      (field) => field.type === "SPARE_PART",
    );

    if (hasSparePartField) {
      return {
        valid: false,
        message: "Bir formda sadece bir yedek parça alanı eklenebilir.",
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
