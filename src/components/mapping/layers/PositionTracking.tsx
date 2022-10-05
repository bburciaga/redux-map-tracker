import { useEffect } from "react";
import { GeoJSON, Marker } from "react-leaflet";
import { Geolocation } from "@capacitor/geolocation";
import { useDispatch, useSelector } from "react-redux"; import { selectPositionTracking } from "../../../state/reducers/positionTracking"; import { POSITION_TRACKING_UPDATE_FAIL, POSITION_TRACKING_UPDATE_REQUEST } from "../../../state/actions";
import { point } from "@turf/turf";

export default function PositionTracking() {
  const dispatch = useDispatch();
  const { is_watching, current_position } = useSelector(selectPositionTracking);

  const findMe = async () => {
    try {
      const position = await Geolocation.getCurrentPosition().then((pos: any) => {
        return pos;
      });
      dispatch({
        type: POSITION_TRACKING_UPDATE_REQUEST,
        payload: {
          position: [position.coords.latitude.toFixed(7), position.coords.longitude.toFixed(7)]
        }
      });
    } catch (error: any) {
      dispatch({
        type: POSITION_TRACKING_UPDATE_FAIL,
        payload: {
          error: error
        }
      })
    }
  };

  useEffect(() => {
    if (is_watching) {
      findMe();
    }
  });

  return <>
    {current_position && <Marker position={[current_position.latitude.toFixed(5), current_position.longitude.toFixed(5)]} />}
  </>;

}
