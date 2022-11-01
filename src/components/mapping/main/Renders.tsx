import React, { useEffect, useState } from "react";
import { useMap, useMapEvent } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { createUserGeo } from "../../../helpers/geometry";
import {
  USER_SETTINGS_UPDATE_BOUND_FAIL,
  USER_SETTINGS_UPDATE_BOUND_ON_MOVE,
  USER_SETTINGS_UPDATE_BOUND_ON_ZOOM,
} from "../../../state/actions/index";
import { selectUserSettings } from "../../../state/reducers/userSettings";
import BufferedExtents from "../layers/BufferedExtents";
import CachedData from "../layers/CachedData";
import RecordedPosition from "../layers/RecordedPosition";

export const Renders = () => {
  const dispatch = useDispatch();
  const map = useMap();
  const userSettings = useSelector(selectUserSettings);
  const [zoomedToPosition, setZoomedToPosition] = useState(false);

  const countRef = React.useRef(0);
  countRef.current++;

  useEffect(() => {
    if (
      userSettings.current_position &&
      userSettings.is_tracking &&
      !zoomedToPosition
    ) {
      map.setView(userSettings.current_position, 18);
      setZoomedToPosition(true);
    }

    if (!userSettings.is_tracking) {
      setZoomedToPosition(false);
    }
  }, [userSettings.current_position, userSettings.is_tracking]);

  useMapEvent("zoomend", (_e) => {
    if (map.getZoom() > 8) {
      /* User Bound Actions */
      const tempBounds = map.getBounds();
      const userGeo = createUserGeo(tempBounds);

      try {
        dispatch({
          type: USER_SETTINGS_UPDATE_BOUND_ON_ZOOM,
          payload: {
            feature: userGeo,
          },
        });
      } catch (error: any) {
        dispatch({
          type: USER_SETTINGS_UPDATE_BOUND_FAIL,
          payload: {
            error: error,
          },
        });
      }
    }
  });

  useMapEvent("moveend", (_e) => {
    if (map.getZoom() > 8) {
      const userGeo = createUserGeo(map.getBounds());
      /* User Bound */
      try {
        dispatch({
          type: USER_SETTINGS_UPDATE_BOUND_ON_MOVE,
          payload: {
            feature: userGeo,
          },
        });
      } catch (error: any) {
        dispatch({
          type: USER_SETTINGS_UPDATE_BOUND_FAIL,
          payload: {
            error: error,
          },
        });
      }
    }
  });

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {/* <BufferedExtents /> */}
      {/* <CachedData /> */}
      <RecordedPosition />
      {/* <InfoBox count={countRef.current} /> */}
    </div>
  );
};
