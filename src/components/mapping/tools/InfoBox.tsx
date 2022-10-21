import { useSelector } from "react-redux";
import { selectBufferedExtents } from "../../../state/reducers/bufferedExtents";
import { selectCachedData } from "../../../state/reducers/cachedData";

interface IInfoBoxProps {
  count: number;
  proof?: boolean;
}

const InfoBox = ({ count, proof = false }: IInfoBoxProps) => {
  const bufferedExtents = useSelector(selectBufferedExtents);
  const cachedData = useSelector(selectCachedData);

  return (
    <div
      style={{
        zIndex: 1500,
        backgroundColor: "white",
        width: 220,
        minHeight: 150,
        borderRadius: 10,
        margin: 5,
        position: "absolute",
        borderWidth: 3,
        borderStyle: "solid",
        borderColor: "black",
      }}
    >
      <p style={{ margin: 15 }}>Page Render Count: {count}</p>
      {proof && (
        <p style={{ margin: 15 }}>
          Buffered Extents Change Count: {bufferedExtents.count}
        </p>
      )}
      <p style={{ margin: 15 }}>Cached Data Render Count: {cachedData.count}</p>
    </div>
  );
};

export default InfoBox;
