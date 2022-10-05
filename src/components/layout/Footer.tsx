import IconButton from "@mui/material/IconButton/IconButton";
import Typography from "@mui/material/Typography/Typography";
import BuildIcon from "@mui/icons-material/Build";
import { useDispatch, useSelector } from "react-redux";
import { selectUserSettings } from "../../state/reducers/userSettings";
import { USER_SETTINGS_DISABLE_PROOF_MAP, USER_SETTINGS_ENABLE_PROOF_MAP } from "../../state/actions";
import { selectPositionTracking } from "../../state/reducers/positionTracking";

export default function Footer () {
  const dispatch = useDispatch();
  const positionTracking = useSelector(selectPositionTracking);
  const userSettings = useSelector(selectUserSettings);

  const enableProof = () => {
    dispatch({
      type: USER_SETTINGS_ENABLE_PROOF_MAP
    });
  }

  const disableProof = () => {
    dispatch({
      type: USER_SETTINGS_DISABLE_PROOF_MAP
    });
  }

  return (
    <div style={{ display: 'flex', flexFlow: 'nowrap row' }}>
      <IconButton
        sx={{ width: 40, height: 40, borderRadius: 0}}
        onClick={() => {
          if (userSettings.proof) {
            disableProof();
          }
          else {
            enableProof();
          }
        }}>
        <BuildIcon />
      </IconButton>
      {positionTracking.current_position && <Typography>
        Position: {positionTracking.current_position.toString(' ')}
      </Typography>}
    </div>
  )
}