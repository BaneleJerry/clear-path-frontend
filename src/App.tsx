import { useEffect, useRef } from "react"; // Added useRef
import { useAppDispatch, useAppSelector } from "./store/store";
import { checkAuth } from "./store/features/authThunk";
import { setLoading } from "./store/features/authSlice";
import { AppRouter } from "./app/router";

export function App() {
  const dispatch = useAppDispatch();
  const { token, isLoading } = useAppSelector((state) => state.auth);

  
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;

    if (token) {
      dispatch(checkAuth());
    } else {
      dispatch(setLoading(false));
    }

    initialized.current = true;
  }, [dispatch, token]);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <div className="flex flex-col items-center gap-2">
          {/* Simple CSS spinner or text */}
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-gray-500 font-medium">Verifying session...</p>
        </div>
      </div>
    );
  }

  return <AppRouter />;
}