import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "./store/store";
import { setInitialized,  } from "./store/features/authSlice"; // You'll need this simple action
import { AppRouter } from "./app/router";
import { checkAuth } from "./store/features/authThunk";

export function App() {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      const token = localStorage.getItem("token");
      if (token) {
        dispatch(checkAuth());
      } else {
        // If no token exists, we skip the API call and just stop loading
        dispatch(setInitialized());
      }
      initialized.current = true;
    }
  }, [dispatch]);

  // This prevents a "flash" of the login page if the user is actually logged in
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <AppRouter />;
}