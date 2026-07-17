import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Custom hook to easily consume the AuthContext state and functions.
 * @returns {object} The authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;
