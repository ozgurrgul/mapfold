import { MapPosition, SupportedMapProvider } from "@/types/map";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_MAP_POSITION } from "./appConstants";
import {
  Configs,
  WaybackDate,
  MeasurementData,
  NasaGibsConfig,
  Bookmark,
} from "@/types/types";
import { getYesterdayDate } from "@/lib/dateUtils";

interface State {
  mapPosition?: MapPosition;
  configs: Configs;
  mapList: {
    provider: SupportedMapProvider;
    enabled: boolean;
    providerName: string;
  }[];
  fullscreenProvider?: SupportedMapProvider;
  selectedEsriSatTimelineDate?: WaybackDate;
  measurements: MeasurementData[];
  nasaGibsConfig: NasaGibsConfig;
  bookmarks: Bookmark[];
}

// Load bookmarks from localStorage
const loadBookmarksFromStorage = (): Bookmark[] => {
  try {
    const stored = localStorage.getItem("mapfold_bookmarks");
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

// Save bookmarks to localStorage
const saveBookmarksToStorage = (bookmarks: Bookmark[]) => {
  try {
    localStorage.setItem("mapfold_bookmarks", JSON.stringify(bookmarks));
  } catch {
    // Silently fail if localStorage is not available
  }
};

const initialState: State = {
  configs: {
    showGoogleStreetView: false,
    showRoads: false,
    showIndigenousTerritories: false,
    showRailways: false,
    showMeasureControl: false,
    showWeatherInfo: false,
    showEarthquakes: false,
  },
  fullscreenProvider: undefined,
  selectedEsriSatTimelineDate: undefined,
  measurements: [],
  nasaGibsConfig: {
    layer: "MODIS_Terra_CorrectedReflectance_TrueColor",
    date: getYesterdayDate(),
  },
  bookmarks: loadBookmarksFromStorage(),
  mapList: [
    {
      provider: "googleSat",
      enabled: true,
      providerName: "Google Satellite",
    },
    {
      provider: "googleTerrain",
      enabled: false,
      providerName: "Google Terrain",
    },
    {
      provider: "bingSat",
      enabled: true,
      providerName: "Bing Satellite",
    },
    {
      provider: "esriSat",
      enabled: false,
      providerName: "ESRI Satellite",
    },
    {
      provider: "esriSatTimeline",
      enabled: false,
      providerName: "ESRI Timeline",
    },
    {
      provider: "yandexSat",
      enabled: false,
      providerName: "Yandex Satellite",
    },
    {
      provider: "topography",
      enabled: false,
      providerName: "Topography",
    },
    {
      provider: "airports",
      enabled: false,
      providerName: "Airports",
    },
    {
      provider: "nasaGibs",
      enabled: false,
      providerName: "NASA GIBS",
    },
    // {
    //   provider: "amazonMiningWatch",
    //   enabled: false,
    // },
  ],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    initializeFromURL() {},
    setMapPosition(state, action: PayloadAction<Partial<MapPosition>>) {
      state.mapPosition = {
        ...(state.mapPosition || DEFAULT_MAP_POSITION),
        ...action.payload,
      };
    },
    toggleMapEnabled(
      state,
      action: PayloadAction<{ provider: SupportedMapProvider; value?: boolean }>
    ) {
      const map = state.mapList.find(
        (m) => m.provider === action.payload.provider
      );
      if (map) {
        map.enabled =
          action.payload.value !== undefined
            ? action.payload.value
            : !map.enabled;
      }
    },
    toggleConfig(
      state,
      action: PayloadAction<{ key: keyof State["configs"]; value?: boolean }>
    ) {
      state.configs[action.payload.key] =
        action.payload.value !== undefined
          ? action.payload.value
          : !state.configs[action.payload.key];
    },
    setFullscreenProvider(
      state,
      action: PayloadAction<SupportedMapProvider | undefined>
    ) {
      state.fullscreenProvider = action.payload;
    },
    toggleFullscreen(state, action: PayloadAction<SupportedMapProvider>) {
      state.fullscreenProvider =
        state.fullscreenProvider === action.payload
          ? undefined
          : action.payload;
    },
    setEsriSatTimelineDate(
      state,
      action: PayloadAction<WaybackDate | undefined>
    ) {
      state.selectedEsriSatTimelineDate = action.payload;
    },
    addMeasurement(state, action: PayloadAction<MeasurementData>) {
      state.measurements.push(action.payload);
    },
    removeMeasurement(state, action: PayloadAction<string>) {
      state.measurements = state.measurements.filter(
        (m) => m.id !== action.payload
      );
    },
    clearMeasurements(state) {
      state.measurements = [];
    },
    setMeasurements(state, action: PayloadAction<MeasurementData[]>) {
      state.measurements = action.payload;
    },
    setNasaGibsLayer(state, action: PayloadAction<string>) {
      state.nasaGibsConfig.layer = action.payload;
    },
    setNasaGibsDate(state, action: PayloadAction<string>) {
      state.nasaGibsConfig.date = action.payload;
    },
    setNasaGibsConfig(state, action: PayloadAction<NasaGibsConfig>) {
      state.nasaGibsConfig = action.payload;
    },
    addBookmark(state, action: PayloadAction<Bookmark>) {
      state.bookmarks.push(action.payload);
      saveBookmarksToStorage(state.bookmarks);
    },
    removeBookmark(state, action: PayloadAction<string>) {
      state.bookmarks = state.bookmarks.filter((b) => b.id !== action.payload);
      saveBookmarksToStorage(state.bookmarks);
    },
    updateBookmark(state, action: PayloadAction<Bookmark>) {
      const index = state.bookmarks.findIndex((b) => b.id === action.payload.id);
      if (index !== -1) {
        state.bookmarks[index] = action.payload;
        saveBookmarksToStorage(state.bookmarks);
      }
    },
    clearBookmarks(state) {
      state.bookmarks = [];
      saveBookmarksToStorage(state.bookmarks);
    },
  },
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
