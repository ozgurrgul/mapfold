import { useEffect, useState } from "react";
import { CircleMarker, Popup, useMap } from "react-leaflet";
import { EarthquakeFeature } from "@/types/types";
import {
  fetchEarthquakes,
  getEarthquakeMagnitudeColor,
} from "@/lib/earthquakeUtils";

export const EarthquakeOverlay = () => {
  const [earthquakes, setEarthquakes] = useState<EarthquakeFeature[]>([]);
  const [loading, setLoading] = useState(true);
  const map = useMap();

  useEffect(() => {
    const loadEarthquakes = async () => {
      setLoading(true);
      const data = await fetchEarthquakes();
      setEarthquakes(data);
      setLoading(false);
    };

    loadEarthquakes();

    // Refresh earthquake data every 5 minutes
    const interval = setInterval(loadEarthquakes, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return null;
  }

  return (
    <>
      {earthquakes.map((earthquake) => {
        const [lng, lat] = earthquake.geometry.coordinates;
        const magnitude = earthquake.properties.mag;
        const color = getEarthquakeMagnitudeColor(magnitude);

        // Calculate radius in pixels based on zoom level
        const zoom = map.getZoom();
        const baseRadius = Math.max(5, Math.min(magnitude * 3, 20));
        const radius = baseRadius * Math.pow(1.1, zoom - 8);

        return (
          <CircleMarker
            key={earthquake.id}
            center={[lat, lng]}
            radius={radius}
            pathOptions={{
              fillColor: color,
              fillOpacity: 0.6,
              color: color,
              weight: 2,
              opacity: 0.8,
            }}
          >
            <Popup>
              <div className="text-sm space-y-1">
                <div className="font-bold text-base">
                  Magnitude {magnitude.toFixed(1)}
                </div>
                <div className="text-gray-700">
                  {earthquake.properties.place}
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(earthquake.properties.time).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">
                  Depth: {earthquake.geometry.coordinates[2].toFixed(1)} km
                </div>
                <a
                  href={earthquake.properties.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-xs block mt-1"
                >
                  View details on USGS →
                </a>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </>
  );
};
