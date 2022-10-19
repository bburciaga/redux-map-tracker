import { GeoJSON } from "react-leaflet";
import { useSelector } from "react-redux";
import { selectUserSettings } from "../../../state/reducers/userSettings";

export function ActivityData() {
  const { activity_data } = useSelector(selectUserSettings);

  return <GeoJSON data={activity_data} key={Math.random()} />;
}
