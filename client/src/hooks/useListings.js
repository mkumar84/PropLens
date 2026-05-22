import { useState, useCallback } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export function useListings() {
  const [listings, setListings]   = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const searchListings = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams(params).toString();
      const res = await fetch(`${API_URL}/api/listings?${qs}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setListings(data.listings || []);
      setLastUpdated(data.lastUpdated || new Date().toISOString());
      return data;
    } catch (err) {
      setError('Failed to load listings.');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchByBounds = useCallback(async (bounds, zoom) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/api/listings/geo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bounds, zoom }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      setListings(data.listings || []);
      setLastUpdated(data.lastUpdated || new Date().toISOString());
      return data;
    } catch (err) {
      setError('Failed to load map listings.');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getListing = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_URL}/api/listings/${id}`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.error(err);
      return null;
    }
  }, []);

  const autocomplete = useCallback(async (query) => {
    if (!query || query.length < 3) return [];
    try {
      const res = await fetch(`${API_URL}/api/listings/autocomplete?q=${encodeURIComponent(query)}`);
      if (!res.ok) return [];
      const data = await res.json();
      return data.results || [];
    } catch {
      return [];
    }
  }, []);

  return { listings, loading, error, lastUpdated, searchListings, searchByBounds, getListing, autocomplete };
}
