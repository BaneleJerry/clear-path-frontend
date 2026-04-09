import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../lib/store";
import { setInitialized, } from "../features/auth/authSlice"; 
import { AppRouter } from "./router";
import { checkAuth } from "../features/auth/authThunk";

export function App() {
  const dispatch = useAppDispatch();
  const initialized = useRef(false);
  const [checking, setChecking] = useState(false); 

  useEffect(() => {
    if (!initialized.current) {
      const token = localStorage.getItem("token");
      if (token) {
        setChecking(true);
        dispatch(checkAuth()).finally(() => setChecking(false));
      } else {
        dispatch(setInitialized());
      }
      initialized.current = true;
    }
  }, [dispatch]);

  if (checking) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return <AppRouter />;
}