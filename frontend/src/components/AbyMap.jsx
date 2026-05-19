import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

/* Fix Leaflet's broken default icon paths when bundled with Vite */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

/* Custom branded marker factory */
export function makeIcon(color = '#0b1f3a', letter = '') {
  return L.divIcon({
    className: '',
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
    html: `
      <div style="
        width:32px; height:40px; position:relative;
        filter: drop-shadow(0 3px 6px rgba(0,0,0,0.30));
      ">
        <svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="40">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24S32 26 32 16C32 7.163 24.837 0 16 0z" fill="${color}"/>
          <circle cx="16" cy="16" r="7" fill="white" opacity="0.9"/>
          ${letter
            ? `<text x="16" y="20.5" text-anchor="middle" font-family="Poppins,sans-serif" font-size="9" font-weight="700" fill="${color}">${letter}</text>`
            : `<circle cx="16" cy="16" r="3.5" fill="${color}"/>`
          }
        </svg>
      </div>
    `,
  });
}

const PICKUP_ICON  = makeIcon('#2546b8', 'A');
const DROPOFF_ICON = makeIcon('#0b1f3a', 'B');

/* Fly to new position whenever latlng changes */
function FlyTo({ latlng, zoom = 13 }) {
  const map = useMap();
  useEffect(() => {
    if (latlng) map.flyTo(latlng, zoom, { duration: 1.2 });
  }, [latlng, zoom, map]);
  return null;
}

/* Fit map bounds to show both markers */
function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    const valid = positions.filter(Boolean);
    if (valid.length === 2) {
      map.flyToBounds(L.latLngBounds(valid), { padding: [60, 60], duration: 1.2 });
    } else if (valid.length === 1) {
      map.flyTo(valid[0], 14, { duration: 1.2 });
    }
  }, [positions, map]);
  return null;
}

/* Detroit, MI — Abyride's home area */
const DETROIT = [42.3314, -83.0458];

/**
 * AbyMap
 *
 * Props:
 *   pickupLatLng   — [lat, lng] | null
 *   dropoffLatLng  — [lat, lng] | null
 *   pickupLabel    — string
 *   dropoffLabel   — string
 *   style          — React style object
 *   className      — string
 */
export default function AbyMap({
  pickupLatLng  = null,
  dropoffLatLng = null,
  pickupLabel   = 'Pickup',
  dropoffLabel  = 'Dropoff',
  style         = {},
  className     = '',
}) {
  const positions = [pickupLatLng, dropoffLatLng];
  const flyTarget = dropoffLatLng ?? pickupLatLng;
  const hasBoth   = pickupLatLng && dropoffLatLng;

  return (
    <MapContainer
      center={DETROIT}
      zoom={12}
      style={{ width: '100%', height: '100%', ...style }}
      className={className}
      zoomControl={false}
      attributionControl={false}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com">CARTO</a>'
      />

      {hasBoth ? (
        <FitBounds positions={positions} />
      ) : (
        flyTarget && <FlyTo latlng={flyTarget} zoom={14} />
      )}

      {pickupLatLng && (
        <Marker position={pickupLatLng} icon={PICKUP_ICON}>
          <Popup>{pickupLabel}</Popup>
        </Marker>
      )}

      {dropoffLatLng && (
        <Marker position={dropoffLatLng} icon={DROPOFF_ICON}>
          <Popup>{dropoffLabel}</Popup>
        </Marker>
      )}
    </MapContainer>
  );
}
