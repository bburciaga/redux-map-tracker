import React from "react";
import { GeoJSON, useMap, useMapEvent } from "react-leaflet";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { createUserGeo } from "../../../helpers/geometry";
import {
  USER_BOUND_INITIALIZE,
  USER_BOUND_UPDATE_ON_MOVE,
  USER_BOUND_UPDATE_ON_ZOOM,
} from "../../../state/actions";
import { selectUserBound } from "../../../state/reducers/userBound";
import BufferedExtents from "../BufferedExtents";
import CachedData from "../CachedData";
import InfoBox from "./InfoBox";

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
    <>
      <BufferedExtents />
      <CachedData />
      <InfoBox count={countRef.current} />
    </>
  );
};
