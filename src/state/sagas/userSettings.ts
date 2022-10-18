import { all, put, select, takeEvery } from "redux-saga/effects";
import {
  // POSITION_TRACKING_REMOVE_WATCH_ID,
  // POSITION_TRACKING_UPDATE_FAIL,
  // POSITION_TRACKING_UPDATE_WATCH_ID,
  USER_SETTINGS_DISABLE_POSITION_TRACKING,
  USER_SETTINGS_DISABLE_SHOW_POSITION,
  USER_SETTINGS_ENABLE_POSITION_TRACKING,
  USER_SETTINGS_REMOVE_WATCH_ID,
  USER_SETTINGS_UPDATE_CURRENT_POSITION_FAIL,
  USER_SETTINGS_UPDATE_CURRENT_POSITION_REQUEST,
  USER_SETTINGS_UPDATE_CURRENT_POSITION_SUCCESS,
  USER_SETTINGS_UPDATE_WATCH_ID,
  USER_SETTINGS_UPDATE_WATCH_ID_FAIL,
} from "../actions";
import { Geolocation } from "@capacitor/geolocation";
import { selectUserSettings } from "../reducers/userSettings";

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
  const { watch_id } = yield select(selectUserSettings);

  try {
    // if (watch_id) {
    //   yield put({
    //     type:
    //   })
    // }

    yield put({
      type: USER_SETTINGS_UPDATE_CURRENT_POSITION_SUCCESS,
      payload: {
        ...action,
      },
    });
  } catch (error: any) {
    yield put({
      type: USER_SETTINGS_UPDATE_CURRENT_POSITION_FAIL,
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
    takeEvery(
      USER_SETTINGS_UPDATE_CURRENT_POSITION_REQUEST,
      handle_USER_SETTINGS_UPDATE_CURRENT_POSITION_REQUEST
    ),
  ]);
}
