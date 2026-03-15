import { useEffect } from "react";
import { AppRouter } from "./app/router";
// import "./App.css";
import BackendDownOverlay from "./components/common/BackendDownOverlay";
import { useAppStore } from "./store/authStore";
import { checkBackendHealth } from "./services/backendHealth";


function App() {
  const isBackendDown = useAppStore((state) => state.isBackendDown);

  useEffect(() => {
    // Run immediately on app start
    checkBackendHealth();

    // Then run every 10 seconds
    const interval = setInterval(checkBackendHealth, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {isBackendDown && <BackendDownOverlay />}
      <AppRouter />
    </div>
  );
}

export default App;