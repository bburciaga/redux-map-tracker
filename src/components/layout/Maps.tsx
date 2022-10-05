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
      {userSettings.proof 
        ? <div style={{ width: '50%'}}>
            <Header title={'Proof'} />
            <ProofMap />
          </div>
        : <div style={{ width: userSettings.proof ? '50%' : '100%'}}>
            <Header title={'main'} />
            <MainMap />
          </div>
        }
    </div>
  );
}