import { useState, useEffect } from 'react';
import api from '@services/api';

const useFetch = (url, options = {}) => {
  const { params = {}, autoFetch = true } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async (customParams) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(url, { params: customParams || params });
      setData(res.data);
      return res.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [url]);

  return { data, loading, error, refetch: fetchData };
};

export default useFetch;
