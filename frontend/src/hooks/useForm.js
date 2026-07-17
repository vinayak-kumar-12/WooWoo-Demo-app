import { useState, useCallback } from 'react';

/**
 * Reusable form state and validation hook.
 * @param {object} initialState - Initial fields and values
 * @param {function} validateFn - Validation logic function that returns an errors object
 * @returns {object} Form state properties and handlers
 */
export const useForm = (initialState, validateFn) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((name, value) => {
    setValues((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error on text change
    setErrors((prev) => ({ ...prev, [name]: '' }));
  }, []);

  const runValidation = useCallback(() => {
    if (!validateFn) return true;
    const validationErrors = validateFn(values);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  }, [values, validateFn]);

  const resetForm = useCallback(() => {
    setValues(initialState);
    setErrors({});
  }, [initialState]);

  return {
    values,
    errors,
    setErrors,
    handleChange,
    runValidation,
    resetForm,
    setValues,
  };
};
export default useForm;
