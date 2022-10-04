import { useSelector } from "react-redux";
import { selectUserBound } from "../../../state/reducers/userBound";
import { GeoJSON } from "react-leaflet";
import React from "react";
import InfoBox from "./InfoBox";
import BufferedExtents from "../BufferedExtents";
import CachedData from "../CachedData";

export const Renders = () => {
  const userBound = useSelector(selectUserBound);

  const countRef = React.useRef(0);
  countRef.current++;

  return (
    <>
      {userBound.initialized && (
        <GeoJSON
          data={userBound.data}
          key={Math.random()}
          style={{ color: "red" }}
        />
      )}
      <BufferedExtents proof={true} dispatchActions={false} />
      <CachedData />
      <InfoBox count={countRef.current} />
    </>
  );
};
