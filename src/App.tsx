import "./styles.css";
import { Provider } from "react-redux";
import { setupStore } from "./store";
import Maps from "./components/layout/Maps";
import Footer from "./components/layout/Footer";

export default function App() {
  return (
    <Provider store={setupStore()}>
      <Maps />
      <Footer />
    </Provider>
  );
}
