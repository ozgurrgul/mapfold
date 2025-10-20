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

export interface URLParams {
  mapPosition?: Partial<MapPosition>;
  configs?: Partial<Configs>;
  enabledProviders?: SupportedMapProvider[];
  esriSatTimelineDate?: WaybackDate;
}
