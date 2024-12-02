import { configureStore } from "@reduxjs/toolkit";
import createSagaMiddleware from "redux-saga";
import { appSaga } from "./appSaga";
import { all } from "redux-saga/effects";
import { appReducer } from "./appSlice";

function* rootSaga() {
  yield all([appSaga()]);
}

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: {
    app: appReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ thunk: false }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

export default store;

export type RootState = ReturnType<typeof store.getState>;
