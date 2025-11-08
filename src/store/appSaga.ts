import { takeLatest, put, select } from "redux-saga/effects";
import { appActions } from "./appSlice";
import {
  selectMapPosition,
  selectConfigs,
  selectEnabledProviders,
  selectSelectedEsriSatTimelineDate,
  selectMeasurements,
} from "./appSelectors";
import { parseURLParams, updateURL } from "@/lib/urlUtils";
import { DEFAULT_MAP_POSITION } from "./appConstants";

function* handleInitializeFromURL() {
  try {
    const urlParams = parseURLParams();

    // Set map position
    if (
      urlParams.mapPosition &&
      Object.keys(urlParams.mapPosition).length > 0
    ) {
      yield put(appActions.setMapPosition(urlParams.mapPosition));
    } else {
      yield put(appActions.setMapPosition(DEFAULT_MAP_POSITION));
    }

    // Set configs using individual toggle actions
    if (urlParams.configs) {
      for (const [key, value] of Object.entries(urlParams.configs)) {
        if (typeof value === "boolean") {
          yield put(
            appActions.toggleConfig({
              key: key as keyof typeof urlParams.configs,
              value,
            })
          );
        }
      }
    }

    // Set enabled providers using individual toggle actions
    if (urlParams.enabledProviders) {
      // First, disable all providers by getting currently enabled ones and disabling them
      const currentEnabledProviders: ReturnType<typeof selectEnabledProviders> =
        yield select(selectEnabledProviders);

      // Disable currently enabled providers
      for (const provider of currentEnabledProviders) {
        yield put(appActions.toggleMapEnabled({ provider, value: false }));
      }

      // Enable the providers from URL
      for (const provider of urlParams.enabledProviders) {
        yield put(appActions.toggleMapEnabled({ provider, value: true }));
      }
    }

    // Set historical date if provided
    if (urlParams.esriSatTimelineDate) {
      yield put(
        appActions.setEsriSatTimelineDate(urlParams.esriSatTimelineDate)
      );
    }

    // Set measurements if provided
    if (urlParams.measurements) {
      yield put(appActions.setMeasurements(urlParams.measurements));
    }
  } catch (error) {
    console.error("Error parsing URL parameters:", error);
  }
}

function* handleUpdateURL() {
  try {
    const currentPosition: ReturnType<typeof selectMapPosition> = yield select(
      selectMapPosition
    );
    const currentConfigs: ReturnType<typeof selectConfigs> = yield select(
      selectConfigs
    );
    const enabledProviders: ReturnType<typeof selectEnabledProviders> =
      yield select(selectEnabledProviders);
    const selectedEsriSatTimelineDate: ReturnType<
      typeof selectSelectedEsriSatTimelineDate
    > = yield select(selectSelectedEsriSatTimelineDate);
    const measurements: ReturnType<typeof selectMeasurements> = yield select(
      selectMeasurements
    );

    if (currentPosition) {
      updateURL(
        currentPosition,
        currentConfigs,
        enabledProviders,
        selectedEsriSatTimelineDate,
        measurements
      );
    }
  } catch (error) {
    console.error("Error updating URL:", error);
  }
}

export function* appSaga() {
  yield takeLatest(appActions.initializeFromURL, handleInitializeFromURL);
  yield takeLatest(appActions.setMapPosition, handleUpdateURL);
  yield takeLatest(appActions.toggleConfig, handleUpdateURL);
  yield takeLatest(appActions.toggleMapEnabled, handleUpdateURL);
  yield takeLatest(appActions.setEsriSatTimelineDate, handleUpdateURL);
  yield takeLatest(appActions.addMeasurement, handleUpdateURL);
  yield takeLatest(appActions.removeMeasurement, handleUpdateURL);
  yield takeLatest(appActions.clearMeasurements, handleUpdateURL);
  yield takeLatest(appActions.setMeasurements, handleUpdateURL);
}
