import { actionChannel, call, take } from "redux-saga/effects";
import {
  CACHED_DATA_REMOVE_FURTHEST_REQUEST,
  CACHED_DATA_UPDATE_REQUEST,
} from "../actions";
import {
  handle_CACHED_DATA_REMOVE_FURTHEST_REQUEST,
  handle_CACHED_DATA_UPDATE_REQUEST,
} from "../handlers/cachedData";

/**
 * To be exported
 * Action Channel for UPDATE REQUESTS
 * @param custom_handler custom function outside default handler
 */
function* watch_CACHED_DATA_UPDATE_REQUEST(custom_handler?: any) {
  const requestChan = yield actionChannel(CACHED_DATA_UPDATE_REQUEST);

  while (true) {
    const action = yield take(requestChan);

    yield call(
      custom_handler ? custom_handler : handle_CACHED_DATA_UPDATE_REQUEST,
      action
    );
  }
}

/**
 * To be exported
 * Action Channel for REMOVE REQUESTS
 */
function* watch_CACHED_DATA_REMOVE_FURTHEST_REQUEST() {
  const requestChan = yield actionChannel(CACHED_DATA_REMOVE_FURTHEST_REQUEST);

  while (true) {
    const action = yield take(requestChan);

    yield call(handle_CACHED_DATA_REMOVE_FURTHEST_REQUEST, action);
  }
}

export {
  watch_CACHED_DATA_UPDATE_REQUEST,
  watch_CACHED_DATA_REMOVE_FURTHEST_REQUEST,
};
