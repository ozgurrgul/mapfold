import { takeLatest, put, select } from "redux-saga/effects";
import { appActions } from "./appSlice";
import { selectMapPosition } from "./appSelectors";
import { parseURLParams, updateURL } from "@/lib/urlUtils";
import { DEFAULT_MAP_POSITION } from "./appConstants";

function* handleInitializeFromURL() {
  try {
    const urlParams = parseURLParams();
    if (Object.keys(urlParams).length > 0) {
      yield put(appActions.setMapPosition(urlParams));
    } else {
      yield put(appActions.setMapPosition(DEFAULT_MAP_POSITION));
    }
  } catch (error) {
    console.error("Error parsing URL parameters:", error);
  }
}

function* handleSetMapPosition() {
  try {
    const currentPosition: ReturnType<typeof selectMapPosition> = yield select(
      selectMapPosition
    );
    if (currentPosition) {
      updateURL(currentPosition);
    }
  } catch (error) {
    console.error("Error updating URL:", error);
  }
}

export function* appSaga() {
  yield takeLatest(appActions.initializeFromURL, handleInitializeFromURL);
  yield takeLatest(appActions.setMapPosition, handleSetMapPosition);
}
