import { MapContainer as LeafletMapContainer } from "react-leaflet";
import { useEffect, useRef, useState } from "react";
import { MapPosition } from "@/types/map";
import { MapRenderer } from "./MapRenderer";
import { useSelector } from "react-redux";
import { selectConfigs } from "@/store/appSelectors";
import { DEFAULT_MAP_POSITION } from "@/store/appConstants";

interface Props extends React.PropsWithChildren {
  position?: MapPosition;
  onPositionChange: (position: MapPosition) => void;
}

export const MapContainer: React.FC<Props> = ({
  position,
  onPositionChange,
  children,
}) => {
  const mapRef = useRef<L.Map | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const configs = useSelector(selectConfigs);

  useEffect(() => {
    if (!mapReady) return;
    if (!mapRef.current) return;
    const map = mapRef.current;
    const currentCenter = map.getCenter();
    const currentZoom = map.getZoom();

    if (
      currentCenter.lat !== position?.lat ||
      currentCenter.lng !== position?.lng ||
      currentZoom !== position?.zoom
    ) {
      if (position) {
        map.setView([position.lat, position.lng], position.zoom, {
          animate: true,
        });
      }
    }
  }, [mapReady, position]);

  useEffect(() => {
    if (!mapReady) return;
    if (!mapRef.current) return;
    const map = mapRef.current;

    const handleMoveEnd = () => {
      const center = map.getCenter();
      const zoom = map.getZoom();

      onPositionChange({
        lat: center.lat,
        lng: center.lng,
        zoom: zoom || position?.zoom || DEFAULT_MAP_POSITION.zoom,
      });
    };

    map.on("moveend", handleMoveEnd);

    return () => {
      map.off("moveend", handleMoveEnd);
    };
  }, [mapReady, onPositionChange, position]);

  if (!position) return null;

  return (
    <LeafletMapContainer
      ref={mapRef}
      center={[position.lat, position.lng]}
      zoom={position.zoom}
      style={{ width: "100%", height: "100%" }}
      scrollWheelZoom={true}
      zoomControl={true}
      zoomAnimation={true}
      markerZoomAnimation={true}
      whenReady={() => setMapReady(true)}
    >
      {children}
      {configs.showGoogleStreetView && <MapRenderer provider="googleStreet" />}
      {configs.showRoads && <MapRenderer provider="googleRoads" />}
    </LeafletMapContainer>
  );
};
