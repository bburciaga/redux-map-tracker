import { useSelector } from "react-redux";
import { selectUserSettings } from "../../state/reducers/userSettings";
import MainMap from "../mapping/main/MainMap";
import ProofMap from "../mapping/proof/ProofMap";
import Header from "./Header";


export default function Maps () {
  const userSettings = useSelector(selectUserSettings);

  return (
    <div
      style={{ display: "flex", flexFlow: "nowrap row-reverse"}}>
      <div style={{ width: '100%'}}>
        <Header title={userSettings.proof ? 'Proof' : 'Main'} />
        {userSettings.proof 
          ? <ProofMap />
          : <MainMap />
        }
      </div>
    </div>
  );
}