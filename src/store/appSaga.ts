import { takeLatest } from "redux-saga/effects";
import { appActions } from "./appSlice";

function* handleSetMapPosition() {
  // TODO later we might handle the map positioning here for some side effects
  // Keeping the scaffold for now
}

export function* appSaga() {
  yield takeLatest(appActions.setMapPosition, handleSetMapPosition);
}
