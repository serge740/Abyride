import { useState, useEffect } from 'react';

const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

/**
 * Calls the same public OSRM server the backend uses, so the rider sees an
 * instant preview of distance/duration/route line. This is preview-only —
 * the backend independently recomputes the authoritative distance/fare from
 * the submitted coordinates, so this client-side number is never trusted for billing.
 */
async function fetchRoute(pickupLatLng, dropoffLatLng) {
  const [pLat, pLng] = pickupLatLng;
  const [dLat, dLng] = dropoffLatLng;
  const url = `${OSRM_BASE_URL}/${pLng},${pLat};${dLng},${dLat}?overview=full&geometries=geojson`;

  const res = await fetch(url);
  const data = await res.json();
  const route = data?.routes?.[0];
  if (!route) throw new Error('No route found');

  return {
    distanceKm: route.distance / 1000,
    durationMin: route.duration / 60,
    // GeoJSON coords are [lng, lat] — flip to Leaflet's [lat, lng] for <Polyline>.
    positions: route.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
  };
}

/**
 * useRoute(pickupLatLng, dropoffLatLng)
 * Returns { distanceKm, durationMin, positions, loading, error }.
 */
export function useRoute(pickupLatLng, dropoffLatLng) {
  const [route, setRoute] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const hasCoords = Boolean(pickupLatLng && dropoffLatLng);

  useEffect(() => {
    if (!hasCoords) return;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchRoute(pickupLatLng, dropoffLatLng)
      .then((result) => { if (!cancelled) setRoute(result); })
      .catch((err) => { if (!cancelled) { setRoute(null); setError(err.message || 'Could not calculate a route'); } })
      .finally(() => { if (!cancelled) setLoading(false); });

    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasCoords, pickupLatLng?.[0], pickupLatLng?.[1], dropoffLatLng?.[0], dropoffLatLng?.[1]]);

  // When coords disappear, derive the "cleared" state at read-time rather than
  // resetting state synchronously from inside the effect above.
  return {
    distanceKm: hasCoords ? route?.distanceKm ?? null : null,
    durationMin: hasCoords ? route?.durationMin ?? null : null,
    positions: hasCoords ? route?.positions ?? null : null,
    loading: hasCoords ? loading : false,
    error: hasCoords ? error : null,
  };
}
