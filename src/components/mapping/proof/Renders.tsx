import { useSelector } from "react-redux";
import { selectUserBound } from "../../../state/reducers/userBound";
import { GeoJSON } from "react-leaflet";
import React from "react";
import InfoBox from "../tools/InfoBox";
import BufferedExtents from "../layers/BufferedExtents";
import CachedData from "../layers/CachedData";
import PositionTracking from "../layers/PositionTracking";

export const Renders = () => {
  const userBound = useSelector(selectUserBound);

  const countRef = React.useRef(0);
  countRef.current++;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {userBound.initialized && (
        <GeoJSON
          data={userBound.data}
          key={Math.random()}
          style={{ color: "red" }}
        />
      )}
      <BufferedExtents proof={true} dispatchActions={false} />
      <CachedData />
      <InfoBox count={countRef.current} proof={true} />
      <PositionTracking />
    </div>
  );
};
