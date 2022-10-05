import { all, put, select, takeEvery, throttle } from "redux-saga/effects";
import {
  POSITION_TRACKING_INITIALIZE,
  POSITION_TRACKING_START_WATCHING,
  POSITION_TRACKING_STOP_WATCHING,
  POSITION_TRACKING_UPDATE_FAIL,
} from "../actions";
import { Geolocation } from "@capacitor/geolocation";
import { selectPositionTracking } from "../reducers/positionTracking";

function* handle_POSITION_TRACKING_START_WATCHING(action: any) {
  try {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };
    const id = yield Geolocation.watchPosition(options, () => {});
    // set watch_id to id
    yield put({
      type: POSITION_TRACKING_INITIALIZE,
      payload: {
        id: id,
      },
    });
  } catch (error: any) {
    yield put({
      type: POSITION_TRACKING_UPDATE_FAIL,
      error: error,
    });
  }
}

function* handle_POSITION_TRACKING_STOP_WATCHING(action: any) {
  const { watch_id } = yield select(selectPositionTracking);
  try {
    yield Geolocation.clearWatch({ id: watch_id });
  } catch (error: any) {
    yield put({
      type: POSITION_TRACKING_UPDATE_FAIL,
    });
  }
}

export default function* positionTrackingSaga() {
  yield all([
    takeEvery(
      POSITION_TRACKING_START_WATCHING,
      handle_POSITION_TRACKING_START_WATCHING
    ),
    takeEvery(
      POSITION_TRACKING_STOP_WATCHING,
      handle_POSITION_TRACKING_STOP_WATCHING
    ),
  ]);
}
