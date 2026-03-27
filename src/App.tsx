import { useEffect } from "react";
import { AppRouter } from "./app/router";

import { checkBackendHealth } from "./services/backendHealth";

import { Provider } from "react-redux";
import { store } from "./store/store";

function App() {
  // Grab the necessary state and actions


  useEffect(() => {
    const init = async () => {
      await checkBackendHealth();
    };
    init();

    const interval = setInterval(checkBackendHealth, 60000);
    return () => clearInterval(interval);
  }, []);


  return (
    <Provider store={store}>
      <div>
        <AppRouter />
      </div>
    </Provider>

  );
}

export default App;