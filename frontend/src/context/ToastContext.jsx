import React, { createContext, useState, useCallback } from 'react';
import Toast from '../components/Toast';

export const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const [toast, setToast] = useState(null);

  /**
   * Triggers a global toast alert
   * @param {string} message - Message to display
   * @param {'success'|'error'} type - Alert status type
   */
  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
  }, []);

  const hideToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onDismiss={hideToast}
        />
      )}
    </ToastContext.Provider>
  );
};
export default ToastContext;
