import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocationOffIcon from "@mui/icons-material/LocationOff";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { selectUserSettings } from "../../../../state/reducers/userSettings";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux/es/hooks/useDispatch";
import {
  USER_SETTINGS_DISABLE_SHOW_POSITION,
  USER_SETTINGS_ENABLE_SHOW_POSITION,
} from "../../../../state/actions";

export function ShowPositionButton() {
  const dispatch = useDispatch();
  const { show_position } = useSelector(selectUserSettings);
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

  const enablePosition = () =>
    dispatch({
      type: USER_SETTINGS_ENABLE_SHOW_POSITION,
    });

  const disablePosition = () =>
    dispatch({
      type: USER_SETTINGS_DISABLE_SHOW_POSITION,
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
        if (show_position) disablePosition();
        else enablePosition();
      }}
    >
      {show_position ? <LocationOnIcon /> : <LocationOffIcon />}
    </button>
  );
}
