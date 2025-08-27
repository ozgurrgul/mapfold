import L from "leaflet";

export interface DistancePoint {
  lat: number;
  lng: number;
}

/**
 * Calculate distance between two points using Leaflet's built-in distanceTo method
 * Returns distance in meters
 */
export const calculateDistance = (point1: DistancePoint, point2: DistancePoint): number => {
  const latLng1 = L.latLng(point1.lat, point1.lng);
  const latLng2 = L.latLng(point2.lat, point2.lng);
  return latLng1.distanceTo(latLng2);
};

/**
 * Calculate total distance for an array of points
 * Returns distance in meters
 */
export const calculateTotalDistance = (points: DistancePoint[]): number => {
  if (points.length < 2) return 0;
  
  let totalDistance = 0;
  for (let i = 0; i < points.length - 1; i++) {
    totalDistance += calculateDistance(points[i], points[i + 1]);
  }
  
  return totalDistance;
};

/**
 * Format distance for display
 */
export const formatDistance = (distanceInMeters: number): string => {
  if (distanceInMeters < 1000) {
    return `${Math.round(distanceInMeters)} m`;
  } else {
    return `${(distanceInMeters / 1000).toFixed(2)} km`;
  }
};

/**
 * Calculate bearing between two points
 * Returns bearing in degrees (0-360)
 */
export const calculateBearing = (point1: DistancePoint, point2: DistancePoint): number => {
  const lat1 = point1.lat * Math.PI / 180;
  const lat2 = point2.lat * Math.PI / 180;
  const deltaLng = (point2.lng - point1.lng) * Math.PI / 180;

  const y = Math.sin(deltaLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLng);

  let bearing = Math.atan2(y, x) * 180 / Math.PI;
  return (bearing + 360) % 360;
};

/**
 * Format bearing for display
 */
export const formatBearing = (bearing: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(bearing / 22.5) % 16;
  return `${Math.round(bearing)}° ${directions[index]}`;
};
