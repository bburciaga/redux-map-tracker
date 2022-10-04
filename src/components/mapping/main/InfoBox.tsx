import { useSelector } from "react-redux";
import { selectCachedData } from "../../../state/reducers/cachedData";

const InfoBox = (props: any) => {
  const { count } = props;
  const cachedData = useSelector(selectCachedData);

  return (
    <div
      style={{
        zIndex: 9999,
        backgroundColor: "white",
        width: 185,
        height: 150,
        borderRadius: 10,
        margin: 5,
        position: "absolute",
        borderWidth: 3,
        borderStyle: "solid",
        borderColor: "black",
      }}
    >
      <p style={{ margin: 15 }}>Page Render Count: {count}</p>
      <p style={{ margin: 15 }}>Cached Data Render Count: {cachedData.count}</p>
    </div>
  );
};

export default InfoBox;
