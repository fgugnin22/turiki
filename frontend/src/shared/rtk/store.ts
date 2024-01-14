import { configureStore } from "@reduxjs/toolkit";
// import logger from "redux-logger";
import { setupListeners } from "@reduxjs/toolkit/query";
import userReducer from "./user";
import { tournamentAPI } from "./tournamentAPI";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
export const store = configureStore({
  reducer: {
    [tournamentAPI.reducerPath]: tournamentAPI.reducer,
    user: userReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(tournamentAPI.middleware),
  devTools: import.meta.env.VITE_NODE_ENV !== "production"
});
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
setupListeners(store.dispatch);
