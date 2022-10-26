import {
  applyMiddleware,
  combineReducers,
  legacy_createStore as createStore,
} from "@reduxjs/toolkit";
import logger from "redux-logger";
import { createBufferedExtentsReducer } from "./state/reducers/bufferedExtents";
import createSagaMiddleware from "@redux-saga/core";
import bufferedExtentsSaga from "./state/sagas/bufferedExtents";
import { createCachedDataReducer } from "./state/reducers/cachedData";
import cachedDataSaga from "./state/sagas/cachedData";
import { composeWithDevTools } from "redux-devtools-extension";
import {
  watch_CACHED_DATA_REMOVE_FURTHEST_REQUEST,
  watch_CACHED_DATA_UPDATE_REQUEST,
} from "./state/channels/cachedData";
import { createUserSettingsReducer } from "./state/reducers/userSettings";
import userSettingsSaga from "./state/sagas/userSettings";
import { createRecordedPositionReducer } from "./state/reducers/recordedPosition";
import recordedPositionSagas from "./state/sagas/recordedPosition";

const sagaMiddlewares = createSagaMiddleware();

export const setupStore = () => {
  const middlewares = applyMiddleware(sagaMiddlewares, logger);

  const store = createStore(
    combineReducers({
      bufferedExtents: createBufferedExtentsReducer(),
      cachedData: createCachedDataReducer(),
      recordedPosition: createRecordedPositionReducer(),
      userSettings: createUserSettingsReducer(),
    }),
    composeWithDevTools(middlewares)
  );

  sagaMiddlewares.run(bufferedExtentsSaga);
  sagaMiddlewares.run(cachedDataSaga);
  sagaMiddlewares.run(recordedPositionSagas);
  sagaMiddlewares.run(userSettingsSaga);
  sagaMiddlewares.run(watch_CACHED_DATA_UPDATE_REQUEST);
  sagaMiddlewares.run(watch_CACHED_DATA_REMOVE_FURTHEST_REQUEST);

  return store;
};
