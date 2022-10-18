class RecordedPositionState {
  initialized: boolean;
  error: any;

  data: any[];

  constructor() {
    this.initialized = false;
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
      default:
        return state;
    }
  };
}

const selectRecordedPosition: (state: any) => RecordedPositionState = (state) =>
  state.recordedPosition;

export { createRecordedPositionReducer, selectRecordedPosition };
