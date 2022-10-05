import { useEffect, useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import { useDispatch, useSelector } from "react-redux";
import { selectPositionTracking } from "../../../state/reducers/positionTracking";
import { POSITION_TRACKING_UPDATE_FAIL, POSITION_TRACKING_UPDATE_REQUEST } from "../../../state/actions";

export default function PositionTracking() {
  const dispatch = useDispatch();
  const { is_watching } = useSelector(selectPositionTracking);

  const findMe = async () => {
    try {
      const position = await Geolocation.getCurrentPosition().then((pos: any) => {
        return pos;
      });
      dispatch({
        type: POSITION_TRACKING_UPDATE_REQUEST,
        payload: {
          position: [position.coords.longitude, position.coords.latitude]
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

  return <></>;
}
