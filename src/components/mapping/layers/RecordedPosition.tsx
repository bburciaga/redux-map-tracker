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

export default function RecordedPosition() {
  const dispatch = useDispatch();
  const { current_position, is_tracking, show_position, watch_id } =
    useSelector(selectUserSettings);
  const { data } = useSelector(selectRecordedPosition);
  const [polyline, setPolyline] = useState(null);

  function isTracking() {
    return is_tracking && watch_id !== null;
  }

  useEffect(() => {
    if (data.length > 1) {
      setPolyline(lineString(data));
    }
  }, [data]);

  const findMe = async () => {
    try {
      let i: number = 0;
      let position: any;
      while (i < 5) {
        position = await Geolocation.getCurrentPosition().then((pos: any) => {
          return pos.coords;
        });
        i = i + 1;
      }
      dispatch({
        type: USER_SETTINGS_UPDATE_CURRENT_POSITION_REQUEST,
        payload: {
          position: {
            lat: position.latitude,
            lng: position.longitude,
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

  useEffect(() => {
    if (isTracking() || show_position) {
      findMe();
    }
  });

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
