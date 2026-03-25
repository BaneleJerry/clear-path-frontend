import { useEffect } from "react";
import { AppRouter } from "./app/router";
import BackendDownOverlay from "./components/common/BackendDownOverlay";
import { useAuthStore } from "./store/authStore"; 
import { checkBackendHealth } from "./services/backendHealth";

function App() {
  // Grab the necessary state and actions
  const isBackendDown = useAuthStore((state) => state.isBackendDown);
  const isInitialLoading = useAuthStore((state) => state.isInitialLoading);
  const validateToken = useAuthStore((state) => state.validateToken);

  useEffect(() => {
    const init = async () => {
      await validateToken(); 
      await checkBackendHealth(); 
    };
    init();

    const interval = setInterval(checkBackendHealth, 60000);
    return () => clearInterval(interval);
  }, [validateToken]);

  if (isInitialLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {isBackendDown && <BackendDownOverlay />}
      <AppRouter />
    </div>
  );
}

export default App;