import { MapPosition, SupportedMapProvider } from "./map";

export interface Configs {
  showGoogleStreetView: boolean;
  showRoads: boolean;
  showIndigenousTerritories: boolean;
  showRailways: boolean;
  showMeasureControl: boolean;
  showWeatherInfo: boolean;
}

export interface URLParams {
  mapPosition?: Partial<MapPosition>;
  configs?: Partial<Configs>;
  enabledProviders?: SupportedMapProvider[];
}
