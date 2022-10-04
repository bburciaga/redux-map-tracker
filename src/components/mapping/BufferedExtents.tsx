import intersect from "@turf/intersect";
import { GeoJSON, useMap, useMapEvent } from "react-leaflet";
import { useDispatch, useSelector } from "react-redux";
import { createUserGeo } from "../../helpers/geometry";
import {
  BUFFERED_EXTENTS_UPDATE_ON_NO_INTERSECTIONS_REQUEST,
  BUFFERED_EXTENTS_UPDATE_ON_ONE_INTERSECTIONS_REQUEST,
  BUFFERED_EXTENTS_UPDATE_ON_THREE_INTERSECTIONS_REQUEST,
  BUFFERED_EXTENTS_UPDATE_ON_TWO_INTERSECTIONS_REQUEST,
} from "../../state/actions";
import { selectBufferedExtents } from "../../state/reducers/bufferedExtents";

interface IBufferedExtentsComponentProps {
  proof?: boolean;
  dispatchActions?: boolean;
}

const BufferedExtents = ({
  proof = false,
  dispatchActions = true,
}: IBufferedExtentsComponentProps) => {
  const dispatch = useDispatch();
  const map = useMap();
  const bufferedExtents = useSelector(selectBufferedExtents);

  useMapEvent("zoomend", (_e) => {
    const userBounds = map.getBounds();
    const userGeo = createUserGeo(userBounds);

    if (dispatchActions && !bufferedExtents.initialized && map.getZoom() > 8) {
      dispatch({
        type: BUFFERED_EXTENTS_UPDATE_ON_NO_INTERSECTIONS_REQUEST,
        payload: {
          aGeo: userGeo,
          intersects: null,
        },
      });
    }
  });

  useMapEvent("moveend", (_e) => {
    const userBounds = map.getBounds();
    const userGeo = createUserGeo(userBounds);

    if (dispatchActions && bufferedExtents.initialized && map.getZoom() > 8) {
      const tempExtents = bufferedExtents.data.features;
      const intersects: any[] = [];

      tempExtents.forEach((extent: any) => {
        if (intersect(userGeo, extent)) {
          intersects.push(extent);
        }
      });

      const payload = {
        aGeo: userGeo,
        intersects: intersects,
      };

      switch (intersects.length) {
        case 0:
          dispatch({
            type: BUFFERED_EXTENTS_UPDATE_ON_NO_INTERSECTIONS_REQUEST,
            payload: payload,
          });
          break;
        case 1:
          dispatch({
            type: BUFFERED_EXTENTS_UPDATE_ON_ONE_INTERSECTIONS_REQUEST,
            payload: payload,
          });
          break;
        case 2:
          dispatch({
            type: BUFFERED_EXTENTS_UPDATE_ON_TWO_INTERSECTIONS_REQUEST,
            payload: payload,
          });
          break;
        case 3:
          dispatch({
            type: BUFFERED_EXTENTS_UPDATE_ON_THREE_INTERSECTIONS_REQUEST,
            payload: payload,
          });
          break;
      }
    }
  });

  return (
    <>
      {bufferedExtents.initialized && proof && (
        <GeoJSON data={bufferedExtents.data} key={Math.random()} />
      )}
    </>
  );
};

export default BufferedExtents;
