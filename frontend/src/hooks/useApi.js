import { useState, useCallback } from 'react';
import { postsAPI } from '../services/api';

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const execute = useCallback(async (apiFunction, ...args) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiFunction(...args);
      
      if (response.data.success) {
        setData(response.data.data);
        return response.data.data;
      } else {
        setError(response.data.error || 'An error occurred');
        return null;
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || err.message || 'An error occurred';
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, data, execute };
};

export default useApi;