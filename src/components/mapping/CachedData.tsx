import { useSelector } from "react-redux";
import { selectCachedData } from "../../state/reducers/cachedData";
import { GeoJSON } from "react-leaflet";

const CachedData = () => {
  const cachedData = useSelector(selectCachedData);

  return (
    <>
      {cachedData.initialized && (
        <GeoJSON
          data={cachedData.data}
          key={Math.random()}
          style={{ color: "purple" }}
        />
      )}
    </>
  );
};

export default CachedData;
