import { EarthquakeFeature } from "@/types/types";

/**
 * Fetches earthquake data from USGS API
 * Returns earthquakes from the last 24 hours with magnitude >= 4.0
 */
export const fetchEarthquakes = async (): Promise<EarthquakeFeature[]> => {
  try {
    // USGS Earthquake API - free and reliable
    // Fetch earthquakes from last 24 hours with magnitude >= 4.0
    const url =
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_day.geojson";

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to fetch earthquake data: ${response.statusText}`
      );
    }

    const data = await response.json();

    // Filter earthquakes from last 24 hours and magnitude >= 4.0
    const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
    const earthquakes: EarthquakeFeature[] = data.features
      .filter((feature: EarthquakeFeature) => {
        return (
          feature.properties.time >= oneDayAgo && feature.properties.mag >= 4.0
        );
      })
      .map((feature: EarthquakeFeature) => ({
        id: feature.id,
        properties: {
          mag: feature.properties.mag,
          place: feature.properties.place,
          time: feature.properties.time,
          updated: feature.properties.updated,
          url: feature.properties.url,
          detail: feature.properties.detail,
          title: feature.properties.title,
        },
        geometry: {
          coordinates: feature.geometry.coordinates,
        },
      }));

    return earthquakes;
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
    return [];
  }
};

/**
 * Get color based on earthquake magnitude
 */
export const getEarthquakeMagnitudeColor = (magnitude: number): string => {
  if (magnitude >= 7.0) return "#ff0000"; // Red - Major
  if (magnitude >= 6.0) return "#ff6600"; // Orange - Strong
  if (magnitude >= 5.0) return "#ffaa00"; // Yellow-Orange - Moderate
  if (magnitude >= 4.0) return "#ffff00"; // Yellow - Light
  return "#00ff00"; // Green - Minor
};
