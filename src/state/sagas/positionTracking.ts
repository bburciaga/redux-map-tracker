import { debounce, put, select } from "redux-saga/effects";
import {
  POSITION_TRACKING_UPDATE_FAIL,
  POSITION_TRACKING_UPDATE_REQUEST,
  POSITION_TRACKING_UPDATE_SUCCESS,
} from "../actions";
import { selectPositionTracking } from "../reducers/positionTracking";

function* handle_POSITION_TRACKING_UPDATE_REQUEST(action: any) {
  const { position } = action.payload;
  const { data } = yield select(selectPositionTracking);
  const pos = { lat: position.lat.toFixed(5), lng: position.lng.toFixed(5) };

  let flag = 0;

  data.forEach((coord) => {
    if (coord[0] === pos.lng && coord[1] === pos.lat) flag = 1;
  });

  const newData = [...data];

  if (!flag) newData.push([pos.lng, pos.lat]);

  try {
    yield put({
      type: POSITION_TRACKING_UPDATE_SUCCESS,
      payload: {
        position_arr: newData,
      },
    });
  } catch (error: any) {
    yield put({
      type: POSITION_TRACKING_UPDATE_FAIL,
      payload: {
        error: error,
      },
    });
  }
}

export default function* positionTrackingSaga() {
  yield debounce(
    3000,
    POSITION_TRACKING_UPDATE_REQUEST,
    handle_POSITION_TRACKING_UPDATE_REQUEST
  );
}
