import { useEffect } from "react";
import { GeoJSON, Marker } from "react-leaflet";
import { Geolocation } from "@capacitor/geolocation";
import { useDispatch, useSelector } from "react-redux"; import { selectPositionTracking } from "../../../state/reducers/positionTracking"; import { POSITION_TRACKING_UPDATE_FAIL, POSITION_TRACKING_UPDATE_REQUEST } from "../../../state/actions";
import { point } from "@turf/turf";

export default function PositionTracking() {
  const dispatch = useDispatch();
  const { is_watching, current_position } = useSelector(selectPositionTracking);

  useEffect(() => {
    console.log(current_position);
  }, [current_position]);

  const findMe = async () => {
    try {
      const position = await Geolocation.getCurrentPosition().then((pos: any) => {
        return pos;
      });
      dispatch({
        type: POSITION_TRACKING_UPDATE_REQUEST,
        payload: {
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
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
    {current_position && <Marker position={{
      lat: current_position.lat.toFixed(5),
      lng: current_position.lng.toFixed(5)
    }} />}
  </>;

}
