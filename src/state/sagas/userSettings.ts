import { all, put, takeEvery } from "redux-saga/effects";
import {
  POSITION_TRACKING_START_WATCHING,
  POSITION_TRACKING_STOP_WATCHING,
  USER_SETTINGS_DISABLE_POSITION_TRACKING,
  USER_SETTINGS_ENABLE_POSITION_TRACKING,
} from "../actions";

function* handle_USER_SETTINGS_ENABLE_POSITION_TRACKING(action: any) {
  yield put({
    type: POSITION_TRACKING_START_WATCHING,
  });
}

function* handle_USER_SETTINGS_DISABLE_POSITION_TRACKING(action: any) {
  yield put({
    type: POSITION_TRACKING_STOP_WATCHING,
  });
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
  ]);
}
