import { all, put, select, takeEvery, throttle } from "redux-saga/effects";
import {
  POSITION_TRACKING_INITIALIZE,
  POSITION_TRACKING_START_WATCHING,
  POSITION_TRACKING_STOP_WATCHING,
  POSITION_TRACKING_UPDATE_FAIL,
  POSITION_TRACKING_UPDATE_REQUEST,
  POSITION_TRACKING_UPDATE_SUCCESS,
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

    yield put({
      type: POSITION_TRACKING_INITIALIZE,
      payload: {
        id: id,
      },
    });
  } catch (error: any) {
    yield put({
      type: POSITION_TRACKING_UPDATE_FAIL,
      payload: {
        error: error,
      }
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

function* handle_POSITION_TRACKING_UPDATE_REQUEST(action: any) {
  const { position } = action.payload;
  const { data } = yield select(selectPositionTracking);
  const pos = { lat: position.lat.toFixed(5), lng: position.lng.toFixed(5) };
  
  let flag = 0;

  data.forEach(coord => {
    if (coord[0] === pos.lng && coord[1] === pos.lat) flag = 1;
  });

  const newData = [...data];

  if (!flag) newData.push([pos.lng, pos.lat]);

  try {
    yield put({
      type: POSITION_TRACKING_UPDATE_SUCCESS,
      payload: {
        position_arr: newData,
        current_position: pos
      }
    });
  } catch(error: any) {
    yield put({
      type: POSITION_TRACKING_UPDATE_FAIL,
      payload: {
        error: error
      }
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
    takeEvery(
      POSITION_TRACKING_UPDATE_REQUEST,
      handle_POSITION_TRACKING_UPDATE_REQUEST
    )
  ]);
}
