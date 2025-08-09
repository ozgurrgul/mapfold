import { MapPosition, SupportedMapProvider } from "./map";

export interface Configs {
  showGoogleStreetView: boolean;
  showRoads: boolean;
  showIndigenousTerritories: boolean;
}

export interface URLParams {
  mapPosition?: Partial<MapPosition>;
  configs?: Partial<Configs>;
  enabledProviders?: SupportedMapProvider[];
}
