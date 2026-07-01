import { useEffect, useRef, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

export function makeIcon(color = '#0b1f3a', letter = '') {
  return L.divIcon({
    className: '',
    iconAnchor: [16, 40],
    popupAnchor: [0, -40],
    html: `
      <div style="width:32px;height:40px;position:relative;filter:drop-shadow(0 3px 6px rgba(0,0,0,0.30));">
        <svg viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg" width="32" height="40">
          <path d="M16 0C7.163 0 0 7.163 0 16c0 10 16 24 16 24S32 26 32 16C32 7.163 24.837 0 16 0z" fill="${color}"/>
          <circle cx="16" cy="16" r="7" fill="white" opacity="0.9"/>
          ${letter
            ? `<text x="16" y="20.5" text-anchor="middle" font-family="Poppins,sans-serif" font-size="9" font-weight="700" fill="${color}">${letter}</text>`
            : `<circle cx="16" cy="16" r="3.5" fill="${color}"/>`}
        </svg>
      </div>`,
  });
}

// The car SVG faces up (north) by default; adjust if it ever looks rotated 90/180deg off.
const DRIVER_ICON_ROTATION_OFFSET = 0;

const DRIVER_ICON = L.divIcon({
  className: '',
  iconAnchor: [20, 20],
  popupAnchor: [0, -22],
  html: `
    <div data-rotor style="
      width:40px; height:40px; border-radius:50%;
      background:#059669; border:3px solid #fff;
      box-shadow:0 3px 14px rgba(5,150,105,0.55);
      display:flex; align-items:center; justify-content:center;
      animation: driverPulse 2s ease-in-out infinite;
      transition: transform 0.3s linear;
    ">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.08 3.11H5.77L6.85 7zM19 17H5v-5h14v5z"/>
        <circle cx="7.5" cy="14.5" r="1.5" fill="white"/>
        <circle cx="16.5" cy="14.5" r="1.5" fill="white"/>
      </svg>
    </div>
    <style>@keyframes driverPulse{0%,100%{box-shadow:0 3px 14px rgba(5,150,105,0.55)}50%{box-shadow:0 3px 20px rgba(5,150,105,0.9),0 0 0 6px rgba(5,150,105,0.15)}}</style>
  `,
});

// Distance/time gaps beyond these snap the marker instead of gliding (reconnects, stale catch-up).
const SNAP_DISTANCE_M = 300;
const SNAP_GAP_MS = 20000;
const MIN_GLIDE_MS = 1000;
const MAX_GLIDE_MS = 12000;

function haversineMeters([lat1, lng1], [lat2, lng2]) {
  const R = 6371000, toRad = (x) => (x * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1), dLng = toRad(lng2 - lng1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function bearingDeg([lat1, lng1], [lat2, lng2]) {
  const toRad = (x) => (x * Math.PI) / 180;
  const toDeg = (x) => (x * 180) / Math.PI;
  const dLng = toRad(lng2 - lng1);
  const y = Math.sin(dLng) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(dLng);
  return (toDeg(Math.atan2(y, x)) + 360) % 360;
}

// Eases the last part of the glide so the car settles into the new point instead of stopping abruptly.
function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t);
}

function applyRotation(marker, deg) {
  const el = marker?.getElement?.();
  const rotor = el?.querySelector('[data-rotor]');
  if (rotor) rotor.style.transform = `rotate(${deg + DRIVER_ICON_ROTATION_OFFSET}deg)`;
}

/**
 * Glides the driver marker smoothly between GPS updates instead of teleporting,
 * and rotates the car icon to face the direction of travel. Snaps instead of
 * gliding on the very first fix, or after a large distance/time gap (reconnects,
 * stale catch-up) where animating would just show a fake, unrealistic path.
 */
function AnimatedDriverMarker({ latlng, onStaleness }) {
  const markerRef = useRef(null);
  const [initialPosition] = useState(latlng);
  const stateRef = useRef({ rendered: latlng, lastUpdateAt: null, rafId: null, bearing: 0 });

  // Stale-signal ticker — lets consumers show "last updated Xs ago" instead of freezing silently.
  useEffect(() => {
    if (!onStaleness) return undefined;
    const id = setInterval(() => {
      const { lastUpdateAt } = stateRef.current;
      onStaleness(lastUpdateAt === null ? 0 : (Date.now() - lastUpdateAt) / 1000);
    }, 1000);
    return () => clearInterval(id);
  }, [onStaleness]);

  useEffect(() => {
    const s = stateRef.current;
    const marker = markerRef.current;
    if (!marker) return undefined;

    const prev = s.rendered;
    const now = Date.now();
    const elapsedMs = s.lastUpdateAt === null ? Infinity : now - s.lastUpdateAt;
    s.lastUpdateAt = now;

    if (s.rafId !== null) { cancelAnimationFrame(s.rafId); s.rafId = null; }

    // Duplicate of what's already rendered (e.g. the initial mount) — nothing to do.
    if (prev[0] === latlng[0] && prev[1] === latlng[1]) return undefined;

    const distM = haversineMeters(prev, latlng);
    if (distM > 1) {
      s.bearing = bearingDeg(prev, latlng);
      applyRotation(marker, s.bearing);
    }

    if (distM > SNAP_DISTANCE_M || elapsedMs > SNAP_GAP_MS) {
      s.rendered = latlng;
      marker.setLatLng(latlng);
      return undefined;
    }

    const duration = Math.min(MAX_GLIDE_MS, Math.max(MIN_GLIDE_MS, elapsedMs));
    const start = performance.now();
    const [fromLat, fromLng] = prev;
    const [toLat, toLng] = latlng;

    const step = (t) => {
      const raw = Math.min(1, (t - start) / duration);
      const eased = easeOutQuad(raw);
      marker.setLatLng([fromLat + (toLat - fromLat) * eased, fromLng + (toLng - fromLng) * eased]);
      if (raw < 1) {
        s.rafId = requestAnimationFrame(step);
      } else {
        s.rafId = null;
      }
    };
    s.rendered = latlng;
    s.rafId = requestAnimationFrame(step);

    return () => {
      if (s.rafId !== null) { cancelAnimationFrame(s.rafId); s.rafId = null; }
    };
    // Deliberately keyed on the individual lat/lng numbers, not the `latlng` array
    // reference, since a new array is passed on every parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latlng[0], latlng[1]]);

  // Cancel any in-flight animation on unmount (trip ends, page navigated away, etc).
  useEffect(() => () => {
    if (stateRef.current.rafId !== null) cancelAnimationFrame(stateRef.current.rafId);
  }, []);

  return (
    <Marker ref={markerRef} position={initialPosition} icon={DRIVER_ICON}>
      <Popup>Driver location</Popup>
    </Marker>
  );
}

const PICKUP_ICON  = makeIcon('#2546b8', 'A');
const DROPOFF_ICON = makeIcon('#0b1f3a', 'B');

function FlyTo({ latlng, zoom = 13 }) {
  const map = useMap();
  useEffect(() => {
    if (latlng) map.flyTo(latlng, zoom, { duration: 1.2 });
  }, [latlng, zoom, map]);
  return null;
}

function FitBounds({ positions }) {
  const map = useMap();
  useEffect(() => {
    const valid = positions.filter(Boolean);
    if (valid.length >= 2) {
      map.flyToBounds(L.latLngBounds(valid), { padding: [60, 60], duration: 1.2 });
    } else if (valid.length === 1) {
      map.flyTo(valid[0], 14, { duration: 1.2 });
    }
  }, [positions, map]);
  return null;
}

function SmoothDriverMarker({ latlng }) {
  const map = useMap();
  useEffect(() => {
    if (latlng) map.panTo(latlng, { animate: true, duration: 0.8 });
  }, [latlng, map]);
  return null;
}

const DETROIT = [42.3314, -83.0458];

/**
 * AbyMap
 * Props:
 *   pickupLatLng, dropoffLatLng, pickupLabel, dropoffLabel
 *   routePositions    — blue polyline (trip route)
 *   driverLatLng      — [lat, lng] of driver (green pulsing car, glides + rotates between updates)
 *   approachPositions — dashed green line (driver → next waypoint)
 *   followDriver      — pan map to driver as they move
 *   onDriverStaleness — optional callback(secondsSinceLastUpdate), fired every second while a driver marker is shown
 *   style, className
 */
export default function AbyMap({
  pickupLatLng      = null,
  dropoffLatLng     = null,
  pickupLabel       = 'Pickup',
  dropoffLabel      = 'Dropoff',
  routePositions    = null,
  driverLatLng      = null,
  approachPositions = null,
  followDriver      = false,
  onDriverStaleness = null,
  style             = {},
  className         = '',
}) {
  const allPoints  = [pickupLatLng, dropoffLatLng, driverLatLng].filter(Boolean);
  const hasBoth    = pickupLatLng && dropoffLatLng;
  const flyTarget  = dropoffLatLng ?? pickupLatLng ?? driverLatLng;

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

      {/* Bounds / pan logic */}
      {hasBoth && !followDriver ? (
        <FitBounds positions={allPoints} />
      ) : followDriver && driverLatLng ? (
        <SmoothDriverMarker latlng={driverLatLng} />
      ) : (
        flyTarget && <FlyTo latlng={flyTarget} zoom={14} />
      )}

      {/* Trip route — blue solid */}
      {routePositions && routePositions.length > 1 && (
        <Polyline positions={routePositions} pathOptions={{ color: '#2546b8', weight: 4, opacity: 0.8 }} />
      )}

      {/* Approach route — green dashed (driver → next waypoint) */}
      {approachPositions && approachPositions.length > 1 && (
        <Polyline positions={approachPositions} pathOptions={{ color: '#059669', weight: 3, opacity: 0.85, dashArray: '10 8' }} />
      )}

      {/* Driver marker — glides + rotates between updates instead of teleporting */}
      {driverLatLng && (
        <AnimatedDriverMarker latlng={driverLatLng} onStaleness={onDriverStaleness} />
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
