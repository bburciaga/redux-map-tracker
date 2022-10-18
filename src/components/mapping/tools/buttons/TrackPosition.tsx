import LocationSearchingIcon from "@mui/icons-material/LocationSearching";
import LocationDisabledIcon from "@mui/icons-material/LocationDisabled";
import { useDispatch, useSelector } from "react-redux";
import {
  USER_SETTINGS_DISABLE_POSITION_TRACKING,
  USER_SETTINGS_ENABLE_POSITION_TRACKING,
} from "../../../../state/actions";
import { selectUserSettings } from "../../../../state/reducers/userSettings";
import { useEffect, useState } from "react";

export default function TrackPositionButton() {
  const dispatch = useDispatch();
  const userSettings = useSelector(selectUserSettings);
  const [initialTime, setInitialTime] = useState(0);

  // timer of 3 seconds
  const timer = () => {
    if (initialTime > 0) {
      setTimeout(() => {
        setInitialTime(initialTime - 1);
      }, 1000);
    }
  };

  // if timer has started, then start the timer
  useEffect(timer, [initialTime, timer]);

  const enableTracking = () =>
    dispatch({
      type: USER_SETTINGS_ENABLE_POSITION_TRACKING,
    });

  const disableTracking = () =>
    dispatch({
      type: USER_SETTINGS_DISABLE_POSITION_TRACKING,
    });

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
      disabled={initialTime > 0} // if timer = 0 return true
      onClick={() => {
        if (userSettings.is_tracking) disableTracking();
        else enableTracking();
        setInitialTime(3);
      }}
    >
      {userSettings.is_tracking ? (
        <LocationSearchingIcon />
      ) : (
        <LocationDisabledIcon />
      )}
    </button>
  );
}
