import {
  POSITION_TRACKING_INITIALIZE,
  POSITION_TRACKING_START_WATCHING,
  POSITION_TRACKING_STOP_WATCHING,
  POSITION_TRACKING_UPDATE_FAIL,
  POSITION_TRACKING_UPDATE_SUCCESS,
} from "../actions";

class PositionTrackingState {
  initialized: boolean;
  error: any;

  watch_id: any;
  is_watching: boolean;
  data: any[];
  current_position: any;
  latitude: number;
  longitude: number;

  constructor() {
    this.initialized = false;
    this.error = null;

    this.watch_id = null;
    this.is_watching = false;
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
      case POSITION_TRACKING_START_WATCHING: {
        return {
          ...state,
          is_watching: true,
        };
      }
      case POSITION_TRACKING_STOP_WATCHING: {
        return {
          ...state,
          is_watching: false,
          watch_id: null,
        };
      }
      case POSITION_TRACKING_INITIALIZE: {
        return {
          ...state,
          initialized: true,
          watch_id: action.payload.id,
        };
      }
      case POSITION_TRACKING_UPDATE_SUCCESS: {
        return {
          ...state,
          data: action.payload.position_arr,
          current_position: action.payload.current_position
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
