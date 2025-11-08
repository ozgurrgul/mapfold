import { useEffect, useState } from "react";
import { useMap } from "react-leaflet";
import { useSelector, useDispatch } from "react-redux";
import L from "leaflet";
import { selectNasaGibsConfig } from "@/store/appSelectors";
import { appActions } from "@/store/appSlice";
import { NasaGibsLayerSelector } from "./NasaGibsLayerSelector";

export const NasaGibsMap = () => {
  const map = useMap();
  const dispatch = useDispatch();
  const nasaGibsConfig = useSelector(selectNasaGibsConfig);
  const [currentLayer, setCurrentLayer] = useState<L.TileLayer | null>(null);

  const layer = nasaGibsConfig.layer;
  const date = nasaGibsConfig.date;

  useEffect(() => {
    if (!map) return;

    // Remove existing layer if it exists
    if (currentLayer) {
      map.removeLayer(currentLayer);
    }

    // NASA GIBS WMTS GetTile request format
    // Using the standard WMTS GetTile operation with query parameters
    const gibsUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/wmts.cgi?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=${layer}&STYLE=default&TILEMATRIXSET=GoogleMapsCompatible_Level9&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&FORMAT=image%2Fjpeg&TIME=${date}`;

    const gibsTileLayer = L.tileLayer(gibsUrl, {
      attribution:
        'Imagery courtesy <a href="https://earthdata.nasa.gov/eosdis/science-system-description/eosdis-components/gibs" target="_blank">NASA GIBS</a>',
      tileSize: 256,
      minZoom: 1,
      maxZoom: 9,
      bounds: [
        [-85.0511287798, -180],
        [85.0511287798, 180],
      ],
      crossOrigin: true,
      errorTileUrl:
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==", // 1x1 transparent pixel for missing tiles
    });

    gibsTileLayer.addTo(map);
    setCurrentLayer(gibsTileLayer);

    // Cleanup function to remove the layer when component unmounts
    return () => {
      if (gibsTileLayer && map.hasLayer(gibsTileLayer)) {
        map.removeLayer(gibsTileLayer);
      }
    };
  }, [map, layer, date]);

  const handleLayerChange = (newLayer: string) => {
    dispatch(appActions.setNasaGibsLayer(newLayer));
  };

  const handleDateChange = (newDate: string) => {
    dispatch(appActions.setNasaGibsDate(newDate));
  };

  return (
    <NasaGibsLayerSelector
      onLayerChange={handleLayerChange}
      onDateChange={handleDateChange}
      className="absolute bottom-0 left-0 right-0 z-[1000]"
    />
  );
};
