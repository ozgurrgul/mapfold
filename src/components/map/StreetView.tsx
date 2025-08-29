import { useEffect } from "react";
import L from "leaflet";
import { TileLayer } from "react-leaflet";

const URL =
  "https://maps.googleapis.com/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m8!1e2!2ssvv!4m2!1scb_client!2sapiv3!4m2!1scc!2s*211m3*211e3*212b1*213e2*211m3*211e2*212b1*213e2!3m5!3sUS!12m1!1e40!12m1!1e18!4e0";

export const GoogleStreetView = () => {
  useEffect(() => {
    const layer = L.tileLayer(URL, {});

    return () => {
      layer.remove();
    };
  }, []);

  return <TileLayer url={URL} attribution="Google Street View" maxZoom={50} />;
};
