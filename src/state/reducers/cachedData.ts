import {
  CACHED_DATA_INITIALIZE_FAIL,
  CACHED_DATA_INITIALIZE_SUCCESS,
  CACHED_DATA_REMOVE_FURTHEST_FAIL,
  CACHED_DATA_REMOVE_FURTHEST_SUCCESS,
  CACHED_DATA_UPDATE_FAIL,
  CACHED_DATA_UPDATE_SUCCESS,
} from "../actions";

export class CachedDataState {
  initialized: boolean;
  data: any;
  count: number;

  constructor() {
    this.initialized = false;
    this.data = {
      type: "FeatureCollection",
      features: [],
    };
    this.count = 0;
  }
}
const initialState = new CachedDataState();

function createCachedDataReducer(): (
  CachedDataState: any,
  AnyAction: any
) => CachedDataState {
  return (state = initialState, action) => {
    switch (action.type) {
      case CACHED_DATA_INITIALIZE_SUCCESS: {
        return {
          ...state,
          initialized: true,
          data: action.payload.feature_collection,
          count: action.payload.count,
        };
      }
      case CACHED_DATA_UPDATE_SUCCESS:
      case CACHED_DATA_REMOVE_FURTHEST_SUCCESS: {
        return {
          ...state,
          data: action.payload.feature_collection,
          count: action.payload.count,
        };
      }
      case CACHED_DATA_INITIALIZE_FAIL:
      case CACHED_DATA_UPDATE_FAIL:
      case CACHED_DATA_REMOVE_FURTHEST_FAIL: {
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

const selectCachedData: (state: any) => CachedDataState = (state) =>
  state.cachedData;

export { createCachedDataReducer, selectCachedData };
