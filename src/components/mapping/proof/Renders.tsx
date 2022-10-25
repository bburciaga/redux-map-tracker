import { useSelector } from "react-redux";
import { GeoJSON } from "react-leaflet";
import React from "react";
import InfoBox from "../tools/InfoBox";
import BufferedExtents from "../layers/BufferedExtents";
import CachedData from "../layers/CachedData";
import { ActivityData } from "../layers/UserSettings";
import { selectUserSettings } from "../../../state/reducers/userSettings";

export const Renders = () => {
  const userSettings = useSelector(selectUserSettings);

  const countRef = React.useRef(0);
  countRef.current++;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      {userSettings.user_bounds && (
        <GeoJSON
          data={userSettings.user_bounds}
          key={Math.random()}
          style={{ color: "red" }}
        />
      )}
      {/* <BufferedExtents proof={true} dispatchActions={false} /> */}
      {/* <CachedData /> */}
      {/* <InfoBox count={countRef.current} proof={true} /> */}
      <ActivityData />
    </div>
  );
};
