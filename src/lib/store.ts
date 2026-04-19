
import { configureStore } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";

import authReducer from "../features/auth/authSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import inviteReducer from "../features/invite/inviteSlice";
import userReducer from "../features/user/userSlice";
import orgReducer from "../features/organization/orgSlice";
import projectReducer from "../features/projects/projectSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dashboard: dashboardReducer,
    invites: inviteReducer,
    users: userReducer,
    organizations: orgReducer,
    projects: projectReducer,
  },
  devTools: true,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;