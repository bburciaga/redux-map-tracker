import {
  USER_BOUND_INITIALIZE,
  USER_BOUND_UPDATE_ON_MOVE,
  USER_BOUND_UPDATE_ON_ZOOM,
} from "../actions";

class UserBoundState {
  initialized: boolean;
  data: any;
  count: number;

  constructor() {
    this.initialized = false;
    this.data = null;
    this.count = 0;
  }
}
const initialState = new UserBoundState();

function createUserBoundReducer(): (
  UserBoundState: any,
  AnyAction: any
) => UserBoundState {
  return (state = initialState, action) => {
    switch (action.type) {
      case USER_BOUND_INITIALIZE: {
        return {
          ...state,
          initialized: true,
          data: action.payload.feature,
          count: action.payload.count,
        };
      }
      case USER_BOUND_UPDATE_ON_MOVE:
      case USER_BOUND_UPDATE_ON_ZOOM: {
        return {
          ...state,
          data: action.payload.feature,
          count: action.payload.count,
        };
      }
      default:
        return state;
    }
  };
}

const selectUserBound: (state: any) => UserBoundState = (state) =>
  state.userBound;

export { createUserBoundReducer, selectUserBound };
