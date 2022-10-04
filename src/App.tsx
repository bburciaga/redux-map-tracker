import "./styles.css";
import MainMap from "./components/mapping/main/MainMap";
import ProofMap from "./components/mapping/proof/ProofMap";
import { Provider } from "react-redux";
import { setupStore } from "./store";

export default function App() {
  return (
    <Provider store={setupStore()}>
      <div style={{ display: "flex", flexFlow: "nowrap row-reverse" }}>
        <MainMap />
        <ProofMap />
      </div>
    </Provider>
  );
}
