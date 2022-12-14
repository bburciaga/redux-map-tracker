import {
  RECORDED_POSITION_CLEAR_DATA_FAIL,
  RECORDED_POSITION_CLEAR_DATA_SUCCESS,
  RECORDED_POSITION_UPDATE_FAIL,
  RECORDED_POSITION_UPDATE_SUCCESS,
} from "../actions";

class RecordedPositionState {
  error: any;

  data: any[];

  constructor() {
    this.error = null;

    this.data = [];
  }
}
const initialState = new RecordedPositionState();

function createRecordedPositionReducer(): (
  RecordedPositionState: any,
  AnyAction: any
) => RecordedPositionState {
  return (state = initialState, action) => {
    switch (action.type) {
      case RECORDED_POSITION_UPDATE_SUCCESS: {
        return {
          ...state,
          data: action.payload.position_arr,
        };
      }
      case RECORDED_POSITION_CLEAR_DATA_SUCCESS: {
        return {
          ...state,
          data: [],
        };
      }
      case RECORDED_POSITION_CLEAR_DATA_FAIL:
      case RECORDED_POSITION_UPDATE_FAIL: {
        return {
          ...state,
          error: action.payload.error,
        };
      }
      default:
        return state;
    }
  };
}

const selectRecordedPosition: (state: any) => RecordedPositionState = (state) =>
  state.recordedPosition;

export { createRecordedPositionReducer, selectRecordedPosition };
