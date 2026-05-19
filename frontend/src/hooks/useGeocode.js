import { useState, useEffect, useRef } from 'react';

/* Nominatim geocoder — free, no API key, rate-limit friendly */
async function geocode(address) {
  if (!address || address.trim().length < 4) return null;
  const q = encodeURIComponent(address + ', Michigan, USA');
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`,
    { headers: { 'Accept-Language': 'en' } }
  );
  const data = await res.json();
  if (!data.length) return null;
  return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
}

/**
 * useGeocode(address, delay = 800)
 * Debounces geocoding so we don't hammer Nominatim on every keystroke.
 * Returns [latlng | null, loading].
 */
export function useGeocode(address, delay = 800) {
  const [latlng,  setLatlng]  = useState(null);
  const [loading, setLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    if (!address || address.trim().length < 4) {
      setLatlng(null);
      return;
    }
    setLoading(true);
    timerRef.current = setTimeout(async () => {
      try {
        const result = await geocode(address);
        setLatlng(result);
      } catch {
        setLatlng(null);
      } finally {
        setLoading(false);
      }
    }, delay);

    return () => clearTimeout(timerRef.current);
  }, [address, delay]);

  return [latlng, loading];
}
