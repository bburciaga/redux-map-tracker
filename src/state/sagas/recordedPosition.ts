import { put, select, throttle } from "redux-saga/effects";
import {
  RECORDED_POSITION_UPDATE_FAIL,
  RECORDED_POSITION_UPDATE_REQUEST,
  RECORDED_POSITION_UPDATE_SUCCESS,
} from "../actions";
import { selectRecordedPosition } from "../reducers/recordedPosition";

function* handle_RECORDED_POSITION_UPDATE_REQUEST(action: any) {
  const { position } = action.payload;
  const { data } = yield select(selectRecordedPosition);
  const pos = { lat: position.lat.toFixed(5), lng: position.lng.toFixed(5) };
  console.log(data);
  console.log(position);

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

export default function* recordedPositionSagas() {
  yield throttle(
    3000,
    RECORDED_POSITION_UPDATE_REQUEST,
    handle_RECORDED_POSITION_UPDATE_REQUEST
  );
}
