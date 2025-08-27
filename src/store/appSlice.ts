import { MapPosition, SupportedMapProvider } from "@/types/map";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_MAP_POSITION } from "./appConstants";
import { Configs } from "@/types/types";

interface State {
  mapPosition?: MapPosition;
  configs: Configs;
  mapList: { provider: SupportedMapProvider; enabled: boolean; providerName: string; }[];
}

const initialState: State = {
  configs: {
    showGoogleStreetView: false,
    showRoads: false,
    showIndigenousTerritories: false,
    showRailways: false,
    showMeasureControl: false,
  },
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
  },
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
