import { MapPosition, SupportedMapProvider } from "@/types/map";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DEFAULT_MAP_POSITION } from "./appConstants";

interface State {
  mapPosition?: MapPosition;
  configs: {
    showGoogleStreetView: boolean;
    showRoads: boolean;
    showIndigenousTerritories: boolean;
  };
  mapList: { provider: SupportedMapProvider; enabled: boolean }[];
}

const initialState: State = {
  configs: {
    showGoogleStreetView: false,
    showRoads: false,
    showIndigenousTerritories: false,
  },
  mapList: [
    {
      provider: "googleSat",
      enabled: true,
    },
    {
      provider: "googleTerrain",
      enabled: false,
    },
    {
      provider: "bingSat",
      enabled: true,
    },
    {
      provider: "esriSat",
      enabled: false,
    },
    {
      provider: "yandexSat",
      enabled: false,
    },
    {
      provider: "amazonMiningWatch",
      enabled: false,
    },
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
      action: PayloadAction<{ provider: SupportedMapProvider }>
    ) {
      const map = state.mapList.find(
        (m) => m.provider === action.payload.provider
      );
      if (map) {
        map.enabled = !map.enabled;
      }
    },
    toggleConfig(
      state,
      action: PayloadAction<{ key: keyof State["configs"] }>
    ) {
      state.configs[action.payload.key] = !state.configs[action.payload.key];
    },
  },
});

export const appReducer = appSlice.reducer;
export const appActions = appSlice.actions;
