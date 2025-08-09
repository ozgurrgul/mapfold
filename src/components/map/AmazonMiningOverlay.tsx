import React, { useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";
import { FeatureCollection } from "geojson";

const MINING_GEOJSON_URL =
  "https://raw.githubusercontent.com/earthrise-media/mining-detector/main/data/outputs/48px_v3.2-3.7ensemble/cumulative/amazon_basin_48px_v3.2-3.7ensemble_dissolved-0.6_2018-2024cumulative.geojson";

export const AmazonMiningOverlay: React.FC = () => {
  const [geoJsonData, setGeoJsonData] = useState<FeatureCollection | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!geoJsonData && !isLoading) {
      setIsLoading(true);
      setError(null);

      fetch(MINING_GEOJSON_URL)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then((data: FeatureCollection) => {
          setGeoJsonData(data);
          console.log(`Loaded ${data.features.length} mining polygons`);
        })
        .catch((err) => {
          console.error("Failed to load mining overlay data:", err);
          setError(err.message);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [geoJsonData, isLoading]);

  if (!geoJsonData || isLoading) {
    return null;
  }

  const geoJsonStyle = {
    fillColor: "#ff4444",
    weight: 1,
    opacity: 0.8,
    color: "#cc0000",
    fillOpacity: 0.4,
  };

  const onEachFeature = (feature: any, layer: any) => {
    // Add popup with basic info
    layer.bindPopup(
      `<div>
        <strong>Detected Mining Area</strong><br/>
        <small>https://amazonminingwatch.org/</small><br/>
      </div>`
    );

    // Add hover effects
    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 2,
          fillOpacity: 0.6,
        });
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle(geoJsonStyle);
      },
    });
  };

  if (error) {
    console.warn("Mining overlay error:", error);
    return null;
  }

  return (
    <GeoJSON
      key="mining-overlay"
      data={geoJsonData}
      style={geoJsonStyle}
      onEachFeature={onEachFeature}
    />
  );
};
