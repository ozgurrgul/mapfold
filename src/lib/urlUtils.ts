import { MapPosition } from "@/types/map";

export const parseURLParams = (): Partial<MapPosition> => {
  const params = new URLSearchParams(window.location.search);
  const lat = params.get("lat");
  const lng = params.get("lng");
  const zoom = params.get("z");

  const result: Partial<MapPosition> = {};
  if (lat && !isNaN(Number(lat))) result.lat = Number(lat);
  if (lng && !isNaN(Number(lng))) result.lng = Number(lng);
  if (zoom && !isNaN(Number(zoom))) result.zoom = Number(zoom);

  return result;
};

export const updateURL = (position: MapPosition) => {
  const params = new URLSearchParams();
  params.set("lat", position.lat.toString());
  params.set("lng", position.lng.toString());
  params.set("z", position.zoom.toString());

  const newURL = `${window.location.pathname}?${params.toString()}`;
  window.history.replaceState({}, "", newURL);
};
