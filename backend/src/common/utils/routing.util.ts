import axios from 'axios';

export interface RouteResult {
  distanceKm: number;
  durationMin: number;
  geometry: { type: 'LineString'; coordinates: [number, number][] };
}

const OSRM_BASE_URL = 'https://router.project-osrm.org/route/v1/driving';

/** Straight-line distance in km between two [lat, lng] points. */
export function haversineKm([lat1, lng1]: [number, number], [lat2, lng2]: [number, number]): number {
  const R = 6371;
  const toRad = (x: number) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Calls the public OSRM demo server for a driving route between two points.
 * OSRM expects coordinates as lng,lat (the opposite of Leaflet/Nominatim's lat,lng) —
 * that conversion is isolated here so no caller has to think about it.
 */
export async function getRoute(
  pickup: [number, number],
  dropoff: [number, number],
): Promise<RouteResult> {
  const [pickupLat, pickupLng] = pickup;
  const [dropoffLat, dropoffLng] = dropoff;

  const url = `${OSRM_BASE_URL}/${pickupLng},${pickupLat};${dropoffLng},${dropoffLat}`;

  const { data } = await axios.get(url, {
    params: { overview: 'full', geometries: 'geojson' },
    timeout: 10000,
  });

  const route = data?.routes?.[0];
  if (!route) {
    throw new Error('No route found between the given pickup and dropoff points');
  }

  return {
    distanceKm: route.distance / 1000,
    durationMin: route.duration / 60,
    geometry: route.geometry,
  };
}
