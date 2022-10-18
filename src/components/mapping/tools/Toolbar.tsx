import { useEffect, useRef } from "react";
import L from "leaflet";
import TrackPositionButton from "./buttons/TrackPosition";
import { ShowPositionButton } from "./buttons/ShowPosition";

const POSITION_CLASSES = {
  bottomleft: "leaflet-bottom leaflet-left",
  bottomright: "leaflet-bottom leaflet-right",
  topleft: "leaflet-top leaflet-left",
  topright: "leaflet-top leaflet-right",
};

export default function Toolbar() {
  const divRef = useRef();

  useEffect(() => {
    L.DomEvent.disableClickPropagation(divRef?.current);
    L.DomEvent.disableClickPropagation(divRef?.current);
  }, [divRef.current]);

  return (
    <>
      <div
        ref={divRef}
        className={"leaflet-right leaflet-bottom leaflet-control"}
        style={{
          zIndex: 9999,
          margin: 15,
          display: "static",
        }}
      >
        <TrackPositionButton />
        <ShowPositionButton />
      </div>
    </>
  );
}
