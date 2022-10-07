import { useEffect, useState } from "react";
import { GeoJSON, Marker } from "react-leaflet";
import { Geolocation } from "@capacitor/geolocation";
import { useDispatch, useSelector } from "react-redux"; import { selectPositionTracking } from "../../../state/reducers/positionTracking"; import { POSITION_TRACKING_UPDATE_FAIL, POSITION_TRACKING_UPDATE_REQUEST } from "../../../state/actions";
import { lineString } from "@turf/turf";

export default function PositionTracking() {
  const dispatch = useDispatch();
  const { is_watching, current_position, data } = useSelector(selectPositionTracking);
  const [polyline, setPolyline] = useState(null);

  useEffect(() => {
    if (data.length > 1) {
      setPolyline(lineString(data));
    }
  }, [data]);

  const findMe = async () => {
    try {
      const position = await Geolocation.getCurrentPosition().then((pos: any) => {
        return pos;
      });
      console.log('donger');
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
        setTimeout(findMe, 3000);
    }
  });

  return (
    <>
      {current_position && (
        <Marker position={{
          lat: current_position.lat,
          lng: current_position.lng
        }} />
      )}
      {polyline && (
        <GeoJSON data={polyline} key={Math.random()} />
      )}
    </>
  );

}
