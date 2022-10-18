import { useEffect, useState } from "react";
import { GeoJSON, Marker } from "react-leaflet";
import { Geolocation } from "@capacitor/geolocation";
import { useDispatch, useSelector } from "react-redux";
import { selectPositionTracking } from "../../../state/reducers/positionTracking";
import {
  POSITION_TRACKING_UPDATE_FAIL,
  POSITION_TRACKING_UPDATE_REQUEST,
  USER_SETTINGS_UPDATE_CURRENT_POSITION_FAIL,
  USER_SETTINGS_UPDATE_CURRENT_POSITION_REQUEST,
} from "../../../state/actions";
import { lineString } from "@turf/turf";
import { selectUserSettings } from "../../../state/reducers/userSettings";

export default function PositionTracking() {
  const dispatch = useDispatch();
  const { watch_id, current_position, data } = useSelector(
    selectPositionTracking
  );
  const { is_tracking, show_position } = useSelector(selectUserSettings);
  const [polyline, setPolyline] = useState(null);

  useEffect(() => {
    if (data.length > 1) {
      setPolyline(lineString(data));
    }
  }, [data]);

  const findMe = async () => {
    try {
      let i: number = 0;
      let position: any;
      const count: number = current_position !== null ? 1 : 10;
      while (i < count) {
        position = await Geolocation.getCurrentPosition().then((pos: any) => {
          return pos;
        });
        i = i + 1;
      }
      if (is_tracking || watch_id) {
        dispatch({
          type: USER_SETTINGS_UPDATE_CURRENT_POSITION_REQUEST,
          payload: {
            position: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          },
        });
      }
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
    if (is_tracking || watch_id || show_position) {
      findMe();
    }
  });

  return (
    <>
      {watch_id ||
        (show_position && current_position && (
          <Marker
            position={{
              lat: current_position.lat,
              lng: current_position.lng,
            }}
          />
        ))}
      {watch_id && polyline && <GeoJSON data={polyline} key={Math.random()} />}
    </>
  );
}
