import { AppRouter } from "./app/router";
import "./App.css";
import BackendDownOverlay from "./components/common/BackendDownOverlay";
import { useAppStore } from "./store/authStore";

function App() {
  const isBackendDown = useAppStore((state) => state.isBackendDown);
  
  return (
    <div >
      {isBackendDown && <BackendDownOverlay />}
      <AppRouter />
    </div>
  );
}

export default App;