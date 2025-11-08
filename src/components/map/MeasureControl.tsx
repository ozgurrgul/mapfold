import { useMap } from "react-leaflet";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import L from "leaflet";
import "leaflet.polylinemeasure";
import "leaflet.polylinemeasure/Leaflet.PolylineMeasure.css";
import { appActions } from "@/store/appSlice";
import { selectMeasurements } from "@/store/appSelectors";
import { MeasurementData } from "@/types/types";

// Extend the L.Control interface to include polylineMeasure
declare module "leaflet" {
  namespace control {
    function polylineMeasure(options?: any): L.Control;
  }
}

export const MeasureControl: React.FC = () => {
  const map = useMap();
  const dispatch = useDispatch();
  const measurements = useSelector(selectMeasurements);
  const controlRef = useRef<L.Control | null>(null);
  const measurementLayersRef = useRef<L.LayerGroup | null>(null);

  // Initialize measurement layers
  useEffect(() => {
    if (!map) return;

    if (!measurementLayersRef.current) {
      measurementLayersRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (measurementLayersRef.current) {
        map.removeLayer(measurementLayersRef.current);
        measurementLayersRef.current = null;
      }
    };
  }, [map]);

  // Restore measurements from store
  useEffect(() => {
    if (!map || !measurementLayersRef.current) return;

    // Clear existing measurement layers
    measurementLayersRef.current.clearLayers();

    // Restore measurements
    measurements.forEach((measurement) => {
      if (measurement.points.length < 2) return;

      const polyline = L.polyline(
        measurement.points.map((p) => [p.lat, p.lng]),
        {
          color: "#006",
          weight: 2,
        }
      );

      // Add distance label at the end
      const lastPoint = measurement.points[measurement.points.length - 1];
      const marker = L.marker([lastPoint.lat, lastPoint.lng], {
        icon: L.divIcon({
          className: "measurement-label",
          html: `<div style="background: white; padding: 2px 6px; border-radius: 3px; font-size: 12px; border: 1px solid #ccc;">${(
            measurement.distance / 1000
          ).toFixed(2)} km</div>`,
          iconSize: [60, 20],
          iconAnchor: [30, 10],
        }),
      });

      measurementLayersRef.current?.addLayer(polyline);
      measurementLayersRef.current?.addLayer(marker);
    });
  }, [map, measurements]);

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

      // Listen for measurement events
      map.on("polylinemeasure:finish", (e: any) => {
        const circleCoords = e.circleCoords || [];
        if (circleCoords.length < 2) return;

        const measurementData: MeasurementData = {
          id: `measurement_${Date.now()}_${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          points: circleCoords.map((latlng: any) => ({
            lat: latlng.lat,
            lng: latlng.lng,
          })),
          distance: e.distance || 0,
          unit: "meters",
          created: Date.now(),
        };

        dispatch(appActions.addMeasurement(measurementData));
      });

      // Listen for clear all measurements
      map.on("polylinemeasure:clear", () => {
        dispatch(appActions.clearMeasurements());
      });

      measureControl.addTo(map);
      controlRef.current = measureControl;
    }

    return () => {
      if (controlRef.current) {
        map.off("polylinemeasure:finish");
        map.off("polylinemeasure:clear");
        map.removeControl(controlRef.current);
        controlRef.current = null;
      }
    };
  }, [map, dispatch]);

  return null;
};
