import { all, put, select, takeEvery, throttle } from "redux-saga/effects";
import {
  RECORDED_POSITION_CLEAR_DATA_FAIL,
  RECORDED_POSITION_CLEAR_DATA_REQUEST,
  RECORDED_POSITION_CLEAR_DATA_SUCCESS,
  RECORDED_POSITION_UPDATE_FAIL,
  RECORDED_POSITION_UPDATE_REQUEST,
  RECORDED_POSITION_UPDATE_SUCCESS,
  USER_SETTINGS_SAVE_DATA_REQUEST,
} from "../actions";
import { selectRecordedPosition } from "../reducers/recordedPosition";

function* handle_RECORDED_POSITION_UPDATE_REQUEST(action: any) {
  const { position } = action.payload;
  const { data } = yield select(selectRecordedPosition);
  const pos = { lat: position.lat.toFixed(6), lng: position.lng.toFixed(6) };

  let flag = 0;

  data.forEach((coord) => {
    if (coord[0] === pos.lng && coord[1] === pos.lat) flag = 1;
  });

  const newData = [...data];

  if (!flag) newData.push([pos.lng, pos.lat]);

  try {
    yield put({
      type: RECORDED_POSITION_UPDATE_SUCCESS,
      payload: {
        position_arr: newData,
      },
    });
  } catch (error: any) {
    yield put({
      type: RECORDED_POSITION_UPDATE_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

function* handle_RECORDED_POSITION_CLEAR_DATA_REQUEST(action: any) {
  try {
    if (action.payload.save_data)
      yield put({
        type: USER_SETTINGS_SAVE_DATA_REQUEST,
      });
    else
      yield put({
        type: RECORDED_POSITION_CLEAR_DATA_SUCCESS,
      });
  } catch (error: any) {
    yield put({
      type: RECORDED_POSITION_CLEAR_DATA_FAIL,
      error: error,
    });
  }
}

export default function* recordedPositionSagas() {
  yield all([
    throttle(
      3000,
      RECORDED_POSITION_UPDATE_REQUEST,
      handle_RECORDED_POSITION_UPDATE_REQUEST
    ),
    takeEvery(
      RECORDED_POSITION_CLEAR_DATA_REQUEST,
      handle_RECORDED_POSITION_CLEAR_DATA_REQUEST
    ),
  ]);
}
