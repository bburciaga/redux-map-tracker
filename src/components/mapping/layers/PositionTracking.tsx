import { useEffect, useState } from "react";
import { Geolocation } from "@capacitor/geolocation";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { selectPositionTracking } from "../../../state/reducers/positionTracking";

export default function PositionTracking() {
  const dispatch = useDispatch();
  const { is_watching } = useSelector(selectPositionTracking);

  const findMe = async () => {
    try {
      await Geolocation.getCurrentPosition().then((pos) => {
        console.log("Position", pos);
      });
    } catch (error: any) {}
  };

  useEffect(() => {
    if (is_watching) {
      console.log("true");
      findMe();
    }
  });

  return <></>;
}
