import {
  BUFFERED_EXTENTS_INITIALIZE_FAIL,
  BUFFERED_EXTENTS_INITIALIZE_SUCCESS,
  BUFFERED_EXTENTS_REMOVE_FURTHEST_FAIL,
  BUFFERED_EXTENTS_REMOVE_FURTHEST_SUCCESS,
  BUFFERED_EXTENTS_UPDATE_FAIL,
  BUFFERED_EXTENTS_UPDATE_SUCCESS,
} from "../actions";

class BufferedExtentsState {
  initialized: boolean;
  error: any;
  data: any;
  count: number;

  constructor() {
    this.initialized = false;
    this.error = null;
    this.data = {
      type: "FeatureCollection",
      features: [],
    };
    this.count = 0;
  }
}
const initialState = new BufferedExtentsState();

/**
 * To be exported
 * Creates reducer for BUFFERED EXTENTS
 * @returns state of reducer
 */
function createBufferedExtentsReducer(): (
  BufferedExtentsState: any,
  AnyAction: any
) => BufferedExtentsState {
  return (state = initialState, action) => {
    switch (action.type) {
      case BUFFERED_EXTENTS_INITIALIZE_SUCCESS: {
        return {
          ...state,
          initialized: true,
          data: action.payload.feature_collection,
          count: action.payload.count,
        };
      }
      case BUFFERED_EXTENTS_UPDATE_SUCCESS:
      case BUFFERED_EXTENTS_REMOVE_FURTHEST_SUCCESS: {
        return {
          ...state,
          data: action.payload.feature_collection,
          count: action.payload.count,
        };
      }
      case BUFFERED_EXTENTS_INITIALIZE_FAIL:
      case BUFFERED_EXTENTS_UPDATE_FAIL:
      case BUFFERED_EXTENTS_REMOVE_FURTHEST_FAIL: {
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

/**
 * Selects object for BUFFERED EXTENTS
 * @param state
 * @returns bufferedExtents object
 */
const selectBufferedExtents: (state: any) => BufferedExtentsState = (state) =>
  state.bufferedExtents;

export { createBufferedExtentsReducer, selectBufferedExtents };
