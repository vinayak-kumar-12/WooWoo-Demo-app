import { useContext } from 'react';
import { ToastContext } from '../context/ToastContext';

/**
 * Custom hook to trigger premium global Toast notifications.
 * @returns {object} The toast control function { showToast }
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export default useToast;
