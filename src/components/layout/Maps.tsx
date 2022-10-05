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
        {userSettings.proof 
          ? 
            <>
              <Header title={'Proof'} />
              <ProofMap />
            </>
          : 
            <>
              <Header title={'main'} />
              <MainMap />
            </>
        }
      </div>
    </div>
  );
}