import {
  POSITION_TRACKING_UPDATE_FAIL,
  POSITION_TRACKING_UPDATE_SUCCESS,
} from "../actions";

class PositionTrackingState {
  initialized: boolean;
  error: any;

  watch_id: any;
  data: any[];
  current_position: any;

  constructor() {
    this.initialized = false;
    this.error = null;

    this.watch_id = null;
    this.data = [];
    this.current_position = null;
  }
}
const initialState = new PositionTrackingState();

function createPositionTrackingReducer(): (
  PositionTrackingState: any,
  AnyAction: any
) => PositionTrackingState {
  return (state = initialState, action) => {
    switch (action.type) {
      case POSITION_TRACKING_UPDATE_SUCCESS: {
        return {
          ...state,
          data: action.payload.position_arr,
          current_position: action.payload.current_position,
        };
      }
      case POSITION_TRACKING_UPDATE_FAIL: {
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

const selectPositionTracking: (state: any) => PositionTrackingState = (state) =>
  state.positionTracking;

export { createPositionTrackingReducer, selectPositionTracking };
