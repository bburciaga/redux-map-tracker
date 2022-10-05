import { useSelector } from "react-redux";
import { selectBufferedExtents } from "../../../state/reducers/bufferedExtents";
import { selectCachedData } from "../../../state/reducers/cachedData";
import { selectUserBound } from "../../../state/reducers/userBound";

interface IInfoBoxProps {
  count: number;
  proof?: boolean;
}

const InfoBox = ({ count, proof = false }: IInfoBoxProps) => {
  const bufferedExtents = useSelector(selectBufferedExtents);
  const userBound = useSelector(selectUserBound);
  const cachedData = useSelector(selectCachedData);

  return (
    <div
      style={{
        zIndex: 1500,
        backgroundColor: "white",
        width: 220,
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
      {proof && (
        <p style={{ margin: 15 }}>
          Buffered Extents Change Count: {bufferedExtents.count}
        </p>
      )}
      {proof && (
        <p style={{ margin: 15 }}>User Bound Change Count: {userBound.count}</p>
      )}
      <p style={{ margin: 15 }}>Cached Data Render Count: {cachedData.count}</p>
    </div>
  );
};

export default InfoBox;
