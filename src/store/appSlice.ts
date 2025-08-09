import { MapPosition, SupportedMapProvider } from "@/types/map";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface State {
  mapPosition: MapPosition;
  configs: {
    showGoogleStreetView: boolean;
    showRoads: boolean;
  };
  mapList: { provider: SupportedMapProvider; enabled: boolean }[];
}

const initialState: State = {
  mapPosition: {
    lat: 1.27475357,
    lng: -70.8720782,
    zoom: 13,
  },
  configs: {
    showGoogleStreetView: false,
    showRoads: false,
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
  ],
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setMapPosition(state, action: PayloadAction<Partial<MapPosition>>) {
      if (action.payload.lat) state.mapPosition.lat = action.payload.lat;
      if (action.payload.lng) state.mapPosition.lng = action.payload.lng;
      if (action.payload.zoom) state.mapPosition.zoom = action.payload.zoom;
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
