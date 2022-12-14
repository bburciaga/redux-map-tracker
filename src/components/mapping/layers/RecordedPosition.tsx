import { useEffect, useState } from "react";
import { GeoJSON, Marker } from "react-leaflet";
import { Geolocation } from "@capacitor/geolocation";
import { useDispatch, useSelector } from "react-redux";
import {
  USER_SETTINGS_UPDATE_CURRENT_POSITION_FAIL,
  USER_SETTINGS_UPDATE_CURRENT_POSITION_REQUEST,
} from "../../../state/actions";
import { lineString } from "@turf/turf";
import { selectUserSettings } from "../../../state/reducers/userSettings";
import { selectRecordedPosition } from "../../../state/reducers/recordedPosition";
import useTimeout from "../../../hooks/useTimeout";

export default function RecordedPosition() {
  const dispatch = useDispatch();
  const { current_position, is_tracking, show_position, watch_id } =
    useSelector(selectUserSettings);
  const { data } = useSelector(selectRecordedPosition);
  const [polyline, setPolyline] = useState(null);

  function isTracking() {
    return is_tracking && watch_id !== null;
  }

  const findMe = async () => {
    try {
      let i: number = 0;
      let position: any;
      let count: number = current_position === null ? 4 : 0;
      do {
        position = await Geolocation.getCurrentPosition().then((pos: any) => {
          return pos;
        });
        i = i + 1;
      } while (i < count); 
      dispatch({
        type: USER_SETTINGS_UPDATE_CURRENT_POSITION_REQUEST,
        payload: {
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        },
      });
    } catch (error: any) {
      dispatch({
        type: USER_SETTINGS_UPDATE_CURRENT_POSITION_FAIL,
        payload: {
          error: error,
        },
      });
    }
  };

  const { reset } = useTimeout(() => {
    if (isTracking() || show_position)
      findMe();
    reset();
  }, 2000);


  useEffect(() => {
    if (data.length >= 2) {
      setPolyline(lineString(data));
    }
    if (data.length <= 1) {
      setPolyline(null);
    }
  }, [data]);

  return (
    <>
      {show_position && current_position && (
        <Marker
          position={{
            lat: current_position.lat,
            lng: current_position.lng,
          }}
        />
      )}
      {isTracking() && polyline && (
        <GeoJSON data={polyline} key={Math.random()} />
      )}
    </>
  );
}
