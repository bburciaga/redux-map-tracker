import {
  USER_SETTINGS_DISABLE_POSITION_TRACKING,
  USER_SETTINGS_DISABLE_PROOF_MAP,
  USER_SETTINGS_DISABLE_SHOW_POSITION,
  USER_SETTINGS_ENABLE_POSITION_TRACKING,
  USER_SETTINGS_ENABLE_PROOF_MAP,
  USER_SETTINGS_ENABLE_SHOW_POSITION,
  USER_SETTINGS_SAVE_DATA_FAIL,
  USER_SETTINGS_SAVE_DATA_SUCCESS,
  USER_SETTINGS_UPDATE_BOUND_FAIL,
  USER_SETTINGS_UPDATE_BOUND_ON_MOVE,
  USER_SETTINGS_UPDATE_BOUND_ON_ZOOM,
  USER_SETTINGS_UPDATE_CURRENT_POSITION_FAIL,
  USER_SETTINGS_UPDATE_CURRENT_POSITION_SUCCESS,
  USER_SETTINGS_UPDATE_WATCH_ID,
  USER_SETTINGS_UPDATE_WATCH_ID_FAIL,
} from "../actions";

class UserSettingsState {
  initialized: boolean;
  error: any;

  is_tracking: boolean;
  show_position: boolean;
  proof: boolean;

  watch_id: number;
  current_position: { lat: number; lng: number };
  activity_data: any;
  user_bounds: any;

  constructor() {
    this.initialized = true;
    this.error = null;

    this.is_tracking = false;
    this.show_position = false;
    this.proof = false;

    this.watch_id = null;
    this.current_position = null;
    this.activity_data = null;
    this.user_bounds = null;
  }
}
const initialState = new UserSettingsState();

function createUserSettingsReducer(): (
  UserSettingsState: any,
  AnyAction: any
) => UserSettingsState {
  return (state = initialState, action) => {
    switch (action.type) {
      case USER_SETTINGS_ENABLE_POSITION_TRACKING: {
        return {
          ...state,
          is_tracking: true,
        };
      }
      case USER_SETTINGS_DISABLE_POSITION_TRACKING: {
        return {
          ...state,
          is_tracking: false,
        };
      }
      case USER_SETTINGS_ENABLE_SHOW_POSITION: {
        return {
          ...state,
          show_position: true,
        };
      }
      case USER_SETTINGS_DISABLE_SHOW_POSITION: {
        return {
          ...state,
          show_position: false,
        };
      }
      case USER_SETTINGS_ENABLE_PROOF_MAP: {
        return {
          ...state,
          proof: true,
        };
      }
      case USER_SETTINGS_DISABLE_PROOF_MAP: {
        return {
          ...state,
          proof: false,
        };
      }
      case USER_SETTINGS_UPDATE_WATCH_ID: {
        return {
          ...state,
          watch_id: action.payload.id,
        };
      }
      case USER_SETTINGS_UPDATE_WATCH_ID: {
        return {
          ...state,
          watch_id: null,
        };
      }
      case USER_SETTINGS_UPDATE_CURRENT_POSITION_SUCCESS: {
        return {
          ...state,
          current_position: {
            lat: action.payload.position.lat.toFixed(6),
            lng: action.payload.position.lng.toFixed(6),
          },
        };
      }
      case USER_SETTINGS_SAVE_DATA_SUCCESS: {
        return {
          ...state,
          activity_data: action.payload.feature,
        };
      }
      case USER_SETTINGS_UPDATE_BOUND_ON_MOVE:
      case USER_SETTINGS_UPDATE_BOUND_ON_ZOOM: {
        return {
          ...state,
          user_bounds: action.payload.feature,
        };
      }
      case USER_SETTINGS_UPDATE_BOUND_FAIL:
      case USER_SETTINGS_SAVE_DATA_FAIL:
      case USER_SETTINGS_UPDATE_WATCH_ID_FAIL:
      case USER_SETTINGS_UPDATE_CURRENT_POSITION_FAIL: {
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

const selectUserSettings: (state: any) => UserSettingsState = (state) =>
  state.userSettings;

export { createUserSettingsReducer, selectUserSettings };
