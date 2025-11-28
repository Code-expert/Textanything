import zones from "../models/zones.js";

// Haversine distance formula
function haversineDistanceMeters(lat1, lng1, lat2, lng2) {
  const R = 6371000;
  const toRad = deg => (deg * Math.PI) / 180;

  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function pointInCircle(lat, lng, zone) {
  const dist = haversineDistanceMeters(
    lat,
    lng,
    zone.center.lat,
    zone.center.lng
  );
  return dist <= zone.radiusMeters;
}

function pointInRectangle(lat, lng, zone) {
  const b = zone.bounds;
  return (
    lat >= b.minLat &&
    lat <= b.maxLat &&
    lng >= b.minLng &&
    lng <= b.maxLng
  );
}

export function getZonesForLocation(lat, lng) {
  const inside = [];

  for (const z of zones) {
    let isInside = false;

    if (z.type === "circle") {
      isInside = pointInCircle(lat, lng, z);
    } else if (z.type === "rectangle") {
      isInside = pointInRectangle(lat, lng, z);
    }

    if (isInside) inside.push(z.id);
  }

  return inside;
}

export function detectZoneChanges(previous = [], current = []) {
  const prevSet = new Set(previous);
  const currSet = new Set(current);

  const entered = [];
  const exited = [];

  for (const z of currSet) if (!prevSet.has(z)) entered.push(z);
  for (const z of prevSet) if (!currSet.has(z)) exited.push(z);

  return { entered, exited };
}
