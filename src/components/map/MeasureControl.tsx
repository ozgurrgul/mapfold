import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.polylinemeasure";
import "leaflet.polylinemeasure/Leaflet.PolylineMeasure.css";

// Extend the L.Control interface to include polylineMeasure
declare module "leaflet" {
  namespace control {
    function polylineMeasure(options?: any): L.Control;
  }
}

export const MeasureControl: React.FC = () => {
  const map = useMap();
  const controlRef = useRef<L.Control | null>(null);

  useEffect(() => {
    if (!map) return;

    if (!controlRef.current) {
      // Create and add the measure control
      const measureControl = L.control.polylineMeasure({
        position: "topleft",
        unit: "kilometres",
        showBearings: false,
        clearMeasurementsOnStop: false,
        showClearControl: true,
        showUnitControl: false,
        tempLine: {
          color: "#00f",
          weight: 2,
        },
        fixedLine: {
          color: "#006",
          weight: 2,
        },
        startCircle: {
          color: "#000",
          weight: 1,
          fillColor: "#0f0",
          fillOpacity: 1,
          radius: 3,
        },
        interCircle: {
          color: "#000",
          weight: 1,
          fillColor: "#ff0",
          fillOpacity: 1,
          radius: 3,
        },
        currentCircle: {
          color: "#000",
          weight: 1,
          fillColor: "#f0f",
          fillOpacity: 1,
          radius: 3,
        },
        endCircle: {
          color: "#000",
          weight: 1,
          fillColor: "#f00",
          fillOpacity: 1,
          radius: 3,
        },
      });

      measureControl.addTo(map);
      controlRef.current = measureControl;
    } else if (controlRef.current) {
      // Remove the control
      map.removeControl(controlRef.current);
      controlRef.current = null;
    }

    return () => {
      if (controlRef.current) {
        map.removeControl(controlRef.current);
        controlRef.current = null;
      }
    };
  }, [map]);

  return null;
};
