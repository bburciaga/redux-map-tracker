import React from "react";
import { useMap, useMapEvent } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { createUserGeo } from "../../../helpers/geometry";
import {
  USER_BOUND_INITIALIZE,
  USER_BOUND_UPDATE_ON_MOVE,
  USER_BOUND_UPDATE_ON_ZOOM,
} from "../../../state/actions/index";
import { selectUserBound } from "../../../state/reducers/userBound";
import BufferedExtents from "../layers/BufferedExtents";
import CachedData from "../layers/CachedData";
import RecordedPosition from "../layers/RecordedPosition";

export const Renders = () => {
  const dispatch = useDispatch();
  const map = useMap();
  const userBound = useSelector(selectUserBound);

  const countRef = React.useRef(0);
  countRef.current++;

  useMapEvent("zoomend", (_e) => {
    if (map.getZoom() > 8) {
      /* User Bound Actions */
      const tempBounds = map.getBounds();
      const userGeo = createUserGeo(tempBounds);

      if (!userBound.initialized) {
        dispatch({
          type: USER_BOUND_INITIALIZE,
          payload: {
            feature: userGeo,
            count: userBound.count + 1,
          },
        });
      } else {
        dispatch({
          type: USER_BOUND_UPDATE_ON_ZOOM,
          payload: {
            feature: userGeo,
            count: userBound.count + 1,
          },
        });
      }
    }
  });

  useMapEvent("moveend", (_e) => {
    if (map.getZoom() > 8) {
      const userGeo = createUserGeo(map.getBounds());
      /* User Bound */
      if (userBound.initialized) {
        dispatch({
          type: USER_BOUND_UPDATE_ON_MOVE,
          payload: {
            feature: userGeo,
            count: userBound.count + 1,
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
      <BufferedExtents />
      <CachedData />
      <RecordedPosition />
      {/* <InfoBox count={countRef.current} /> */}
    </div>
  );
};
