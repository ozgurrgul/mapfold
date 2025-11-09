import { MapPosition, SupportedMapProvider } from "./map";

export interface Configs {
  showGoogleStreetView: boolean;
  showRoads: boolean;
  showIndigenousTerritories: boolean;
  showRailways: boolean;
  showMeasureControl: boolean;
  showWeatherInfo: boolean;
  showEarthquakes: boolean;
}

export interface NasaGibsConfig {
  layer: string;
  date: string;
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

export interface EarthquakeFeature {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    updated: number;
    url: string;
    detail: string;
    title: string;
  };
  geometry: {
    coordinates: [number, number, number]; // [longitude, latitude, depth]
  };
}

export interface URLParams {
  mapPosition?: Partial<MapPosition>;
  configs?: Partial<Configs>;
  enabledProviders?: SupportedMapProvider[];
  esriSatTimelineDate?: WaybackDate;
  measurements?: MeasurementData[];
}
