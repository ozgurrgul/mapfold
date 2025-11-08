export interface MapPosition {
  lat: number;
  lng: number;
  zoom: number;
}

export type SupportedMapProvider =
  | "googleSat"
  | "googleRoads"
  | "googleTerrain"
  | "googleStreet"
  | "yandexSat"
  | "bingSat"
  | "esriSat"
  | "esriSatTimeline"
  | "amazonMiningWatch"
  | "topography"
  | "airports"
  | "railways"
  | "nasaGibs";
