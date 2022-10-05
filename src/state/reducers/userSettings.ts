import {
  USER_SETTINGS_DISABLE_POSITION_TRACKING,
  USER_SETTINGS_ENABLE_POSITION_TRACKING,
} from "../actions";

class UserSettingsState {
  initialized: boolean;
  error: any;

  tracking: boolean;

  constructor() {
    this.initialized = true;
    this.error = null;

    this.tracking = false;
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
          tracking: true,
        };
      }
      case USER_SETTINGS_DISABLE_POSITION_TRACKING: {
        return {
          ...state,
          tracking: false,
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
