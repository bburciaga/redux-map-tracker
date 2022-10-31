import IconButton from "@mui/material/IconButton/IconButton";
import Typography from "@mui/material/Typography/Typography";
import BuildIcon from "@mui/icons-material/Build";
import { useDispatch, useSelector } from "react-redux";
import { selectUserSettings } from "../../state/reducers/userSettings";
import {
  USER_SETTINGS_DISABLE_PROOF_MAP,
  USER_SETTINGS_ENABLE_PROOF_MAP,
} from "../../state/actions";
import { selectRecordedPosition } from "../../state/reducers/recordedPosition";
import { Snackbar } from "@material-ui/core";

export default function Footer() {
  const dispatch = useDispatch();
  const recordedPosition = useSelector(selectRecordedPosition);
  const userSettings = useSelector(selectUserSettings);

  const enableProof = () => {
    dispatch({
      type: USER_SETTINGS_ENABLE_PROOF_MAP,
    });
  };

  const disableProof = () => {
    dispatch({
      type: USER_SETTINGS_DISABLE_PROOF_MAP,
    });
  };

  return (
    <div
      style={{
        display: "flex",
        flexFlow: "nowrap row",
        justifyContent: "center",
      }}
    >
      <IconButton
        sx={{ width: 40, height: 40, borderRadius: 0 }}
        onClick={() => {
          if (userSettings.proof) {
            disableProof();
          } else {
            enableProof();
          }
        }}
      >
        <BuildIcon />
      </IconButton>
      {userSettings.current_position && (
        <Typography>
          Pos: {userSettings.current_position.lat},{" "}
          {userSettings.current_position.lng}
          Arr len: {recordedPosition.data.length}
        </Typography>
      )}
      <Snackbar 
        open={userSettings.error !== null}
        message={userSettings.error} />
    </div>
  );
}
