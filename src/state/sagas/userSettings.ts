import { all, put, select, takeEvery, throttle } from "redux-saga/effects";
import {
  RECORDED_POSITION_CLEAR_DATA_FAIL,
  RECORDED_POSITION_CLEAR_DATA_REQUEST,
  RECORDED_POSITION_CLEAR_DATA_SUCCESS,
  RECORDED_POSITION_UPDATE_FAIL,
  RECORDED_POSITION_UPDATE_REQUEST,
  USER_SETTINGS_DISABLE_POSITION_TRACKING,
  USER_SETTINGS_DISABLE_SHOW_POSITION,
  USER_SETTINGS_ENABLE_POSITION_TRACKING,
  USER_SETTINGS_REMOVE_WATCH_ID,
  USER_SETTINGS_SAVE_DATA_FAIL,
  USER_SETTINGS_SAVE_DATA_REQUEST,
  USER_SETTINGS_SAVE_DATA_SUCCESS,
  USER_SETTINGS_UPDATE_CURRENT_POSITION_DENY,
  USER_SETTINGS_UPDATE_CURRENT_POSITION_FAIL,
  USER_SETTINGS_UPDATE_CURRENT_POSITION_REQUEST,
  USER_SETTINGS_UPDATE_CURRENT_POSITION_SUCCESS,
  USER_SETTINGS_UPDATE_WATCH_ID,
  USER_SETTINGS_UPDATE_WATCH_ID_FAIL,
} from "../actions";
import { Geolocation } from "@capacitor/geolocation";
import { selectUserSettings } from "../reducers/userSettings";
import { selectRecordedPosition } from "../reducers/recordedPosition";
import { distance, lineString } from "@turf/turf";

function* handle_USER_SETTINGS_ENABLE_POSITION_TRACKING(action: any) {
  const { show_position } = yield select(selectUserSettings);

  try {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
      radius: 50,
    };
    const id = yield Geolocation.watchPosition(options, () => {});

    if (show_position)
      yield put({
        type: USER_SETTINGS_DISABLE_SHOW_POSITION,
      });

    yield put({
      type: USER_SETTINGS_UPDATE_WATCH_ID,
      payload: {
        id: id,
      },
    });
  } catch (error: any) {
    yield put({
      type: USER_SETTINGS_UPDATE_WATCH_ID_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

function* handle_USER_SETTINGS_DISABLE_POSITION_TRACKING(action: any) {
  const { watch_id } = yield select(selectUserSettings);
  try {
    yield Geolocation.clearWatch({ id: watch_id });
    yield put({
      type: USER_SETTINGS_REMOVE_WATCH_ID,
    });
  } catch (error: any) {
    yield put({
      type: USER_SETTINGS_UPDATE_WATCH_ID_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

function* handle_USER_SETTINGS_UPDATE_CURRENT_POSITION_REQUEST(action: any) {
  const { current_position } = yield select(selectUserSettings);
  const { position } = action.payload;
  try {
    if (current_position === null)
      yield put({
        type: USER_SETTINGS_UPDATE_CURRENT_POSITION_SUCCESS,
        payload: {
          position: action.payload.position,
        },
      });
    else {
      let d: number = distance(
          [parseFloat(current_position.lng), parseFloat(current_position.lat)],
          [position.lng, position.lat],
          {units: 'meters'}
        );


      if (d > 1.0)
        yield put({
          type: USER_SETTINGS_UPDATE_CURRENT_POSITION_SUCCESS,
          payload: {
            position: action.payload.position,
          },
        });
      else 
        yield put({
          type: USER_SETTINGS_UPDATE_CURRENT_POSITION_DENY
        });
    }
  } catch (error: any) {
    yield put({
      type: USER_SETTINGS_UPDATE_CURRENT_POSITION_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

function* handle_USER_SETTINGS_UPDATE_CURRENT_POSITION_SUCCESS(action: any) {
  const { is_tracking, watch_id } = yield select(selectUserSettings);

  try {
    if (is_tracking && watch_id !== null) {

      yield put({
        type: RECORDED_POSITION_UPDATE_REQUEST,
        payload: action.payload,
      });
    }
  } catch (error: any) {
    yield put({
      type: RECORDED_POSITION_UPDATE_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

function* handle_USER_SETTINGS_SAVE_DATA_REQUEST(action: any) {
  const { data } = yield select(selectRecordedPosition);
  try {
    const new_feature = lineString(data);

    yield put({
      type: USER_SETTINGS_SAVE_DATA_SUCCESS,
      payload: {
        feature: new_feature,
      },
    });
  } catch (error: any) {
    yield put({
      type: USER_SETTINGS_SAVE_DATA_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

function* handle_USER_SETTINGS_SAVE_DATA_SUCCESS(action: any) {
  try {
    yield put({
      type: RECORDED_POSITION_CLEAR_DATA_SUCCESS,
    });
  } catch (error: any) {
    yield put({
      type: RECORDED_POSITION_CLEAR_DATA_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

export default function* userSettingsSaga() {
  yield all([
    takeEvery(
      USER_SETTINGS_ENABLE_POSITION_TRACKING,
      handle_USER_SETTINGS_ENABLE_POSITION_TRACKING
    ),
    takeEvery(
      USER_SETTINGS_DISABLE_POSITION_TRACKING,
      handle_USER_SETTINGS_DISABLE_POSITION_TRACKING
    ),
    throttle(
      3000,
      USER_SETTINGS_UPDATE_CURRENT_POSITION_REQUEST,
      handle_USER_SETTINGS_UPDATE_CURRENT_POSITION_REQUEST
    ),
    takeEvery(
      USER_SETTINGS_UPDATE_CURRENT_POSITION_SUCCESS,
      handle_USER_SETTINGS_UPDATE_CURRENT_POSITION_SUCCESS
    ),
    takeEvery(
      USER_SETTINGS_SAVE_DATA_REQUEST,
      handle_USER_SETTINGS_SAVE_DATA_REQUEST
    ),
    takeEvery(
      USER_SETTINGS_SAVE_DATA_SUCCESS,
      handle_USER_SETTINGS_SAVE_DATA_SUCCESS
    ),
  ]);
}
