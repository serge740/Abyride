import { useState, useEffect, useRef } from 'react';

async function nominatimSearch(query) {
  const q = encodeURIComponent(query);
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=5&addressdetails=1`,
    { headers: { 'Accept-Language': 'en' } }
  );
  const data = await res.json();
  return data.map((item) => {
    const parts = item.display_name.split(', ');
    return {
      id: item.place_id,
      label: parts.slice(0, 2).join(', '),
      sublabel: parts.slice(2, 5).join(', '),
      latlng: [parseFloat(item.lat), parseFloat(item.lon)],
    };
  });
}

export function useAddressSearch(query, delay = 350) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    clearTimeout(timer.current);
    if (!query || query.trim().length < 3) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    timer.current = setTimeout(async () => {
      try {
        const res = await nominatimSearch(query);
        setResults(res);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, delay);
    return () => clearTimeout(timer.current);
  }, [query, delay]);

  return { results, loading };
}
