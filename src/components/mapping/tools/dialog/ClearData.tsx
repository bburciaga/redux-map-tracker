import { Dialog, DialogContent } from "@mui/material";
import { useDispatch } from "react-redux";
import { RECORDED_POSITION_CLEAR_DATA_REQUEST, USER_SETTINGS_SAVE_DATA_REQUEST } from "../../../../state/actions";

export default function ClearDataDialog({ enabled, setEnabled }) {
  const dispatch = useDispatch();

  const handleClose = (save: boolean) => {
    dispatch({
      type: RECORDED_POSITION_CLEAR_DATA_REQUEST,
      payload: {
        save_data: save,
        action_to_dispatch: USER_SETTINGS_SAVE_DATA_REQUEST
      },
    });
    setEnabled(false);
  };

  return (
    <Dialog open={enabled} onClose={() => setEnabled(false)}>
      <DialogContent>
        <button onClick={() => handleClose(true)}>Save Records</button>
        <button onClick={() => handleClose(false)}>Clear Records</button>
      </DialogContent>
    </Dialog>
  );
}
