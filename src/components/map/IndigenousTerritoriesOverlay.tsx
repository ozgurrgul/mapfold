import React, { useEffect, useState } from "react";
import { GeoJSON } from "react-leaflet";
import { FeatureCollection, Feature } from "geojson";

const NATIVE_LAND_API =
  "https://native-land.ca/api/index.php?key=TKKHyMfNTRngqPn0jfQyX";

interface TerritoryProperties {
  Name: string;
  description?: string;
  color: string;
  Slug: string;
}

let globalTerritoriesCache: FeatureCollection | null = null;
let isGlobalFetching = false;

export const IndigenousTerritoriesOverlay: React.FC = () => {
  const [territoriesData, setTerritoriesData] =
    useState<FeatureCollection | null>(globalTerritoriesCache);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (globalTerritoriesCache) {
      setTerritoriesData(globalTerritoriesCache);
      return;
    }

    if (isGlobalFetching) {
      return;
    }

    isGlobalFetching = true;
    setIsLoading(true);
    setError(null);

    const fetchAllTerritories = async () => {
      try {
        const response = await fetch(`${NATIVE_LAND_API}&maps=territories`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data) {
          const featureCollection: FeatureCollection = {
            type: "FeatureCollection",
            features: data.features,
          };

          globalTerritoriesCache = featureCollection;
          setTerritoriesData(featureCollection);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
        isGlobalFetching = false;
      }
    };

    fetchAllTerritories();
  }, []);

  if (isLoading || isGlobalFetching || error || !territoriesData) {
    return null;
  }

  const getFeatureStyle = (feature?: Feature) => {
    if (!feature)
      return {
        fillColor: "#8B4513",
        weight: 2,
        opacity: 0.8,
        color: "#654321",
        fillOpacity: 0.4,
      };

    const props = feature.properties as TerritoryProperties;
    return {
      fillColor: props?.color || "#8B4513", // Use the color from Native Land or brown fallback
      weight: 2,
      opacity: 0.8,
      color: "#654321", // Darker brown border
      fillOpacity: 0.4,
    };
  };

  const onEachFeature = (feature: any, layer: any) => {
    const props = feature.properties as TerritoryProperties;

    const popupContent = `
      <div style="max-width: 250px;">
        <h3 style="margin: 0 0 8px 0; color: #654321; font-size: 16px;">
          ${props.Name}
        </h3>
        ${
          props.description
            ? `<p style="margin: 0 0 8px 0; font-size: 14px;">${props.description}</p>`
            : ""
        }
        <div style="font-size: 12px; color: #666;">
          <strong>Traditional Territory</strong><br/>
          <em>Data: Native Land Digital</em><br/>
          <a href="https://native-land.ca/maps/territories/${
            props.Slug
          }" target="_blank" rel="noopener">
            Learn More →
          </a>
        </div>
      </div>
    `;

    layer.bindPopup(popupContent);

    layer.bindTooltip(props.Name, {
      permanent: false,
      direction: "top",
      offset: [0, -10],
      className: "indigenous-territory-tooltip",
      sticky: true,
    });

    layer.on({
      mouseover: (e: any) => {
        const layer = e.target;
        layer.setStyle({
          weight: 3,
          fillOpacity: 0.6,
        });
      },
      mouseout: (e: any) => {
        const layer = e.target;
        layer.setStyle(getFeatureStyle(feature));
      },
    });
  };

  return (
    <GeoJSON
      key="global-indigenous-territories"
      data={territoriesData}
      style={getFeatureStyle}
      onEachFeature={onEachFeature}
    />
  );
};
