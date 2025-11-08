import { MapPosition, SupportedMapProvider } from "./map";

export interface Configs {
  showGoogleStreetView: boolean;
  showRoads: boolean;
  showIndigenousTerritories: boolean;
  showRailways: boolean;
  showMeasureControl: boolean;
  showWeatherInfo: boolean;
}

export interface WaybackDate {
  releaseNum: number;
  releaseDateLabel: string;
  releaseDate: number; // Unix timestamp
  tileUrl: string; // Actual tile URL from ESRI config
}

export interface MeasurementPoint {
  lat: number;
  lng: number;
}

export interface MeasurementData {
  id: string;
  points: MeasurementPoint[];
  distance: number; // in meters
  unit: string;
  created: number; // timestamp
}

export interface URLParams {
  mapPosition?: Partial<MapPosition>;
  configs?: Partial<Configs>;
  enabledProviders?: SupportedMapProvider[];
  esriSatTimelineDate?: WaybackDate;
  measurements?: MeasurementData[];
}
