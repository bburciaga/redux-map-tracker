import LocationSearchingIcon from '@mui/icons-material/LocationSearching';
import LocationDisabledIcon from '@mui/icons-material/LocationDisabled';
import { useDispatch, useSelector } from "react-redux";
import {
  USER_SETTINGS_DISABLE_POSITION_TRACKING,
  USER_SETTINGS_ENABLE_POSITION_TRACKING,
} from "../../../../state/actions";
import { selectUserSettings } from "../../../../state/reducers/userSettings";

export default function PositionTracker() {
  const dispatch = useDispatch();
  const userSettings = useSelector(selectUserSettings);

  return (
    <button
      className="leaflet-control"
      style={{
        padding: 5,
        marginTop: 10,
        marginRight: 10,
        width: 40,
        height: 40,
        backgroundColor: "white",
      }}
      onClick={() => {
        if (userSettings.tracking) {
          dispatch({
            type: USER_SETTINGS_DISABLE_POSITION_TRACKING,
          });
        } else {
          dispatch({
            type: USER_SETTINGS_ENABLE_POSITION_TRACKING,
          });
        }
      }}
    >
      {userSettings.tracking ? <LocationSearchingIcon /> : <LocationDisabledIcon />}
    </button>
  );
}
