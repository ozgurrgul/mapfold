import { createSelector } from "@reduxjs/toolkit";
import { RootState } from "./store";

const selectAppState = (state: RootState) => state.app;

export const selectMapPosition = createSelector(
  selectAppState,
  (state) => state.mapPosition
);

export const selectMapList = createSelector(
  selectAppState,
  (state) => state.mapList
);

export const selectEnabledMapList = createSelector(selectMapList, (mapList) =>
  mapList.filter((map) => map.enabled)
);

export const selectConfigs = createSelector(
  selectAppState,
  (state) => state.configs
);

export const selectEnabledProviders = createSelector(
  selectEnabledMapList,
  (enabledMaps) => enabledMaps.map(map => map.provider)
);
