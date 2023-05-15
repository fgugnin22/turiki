import { configureStore } from "@reduxjs/toolkit";
import logger from "redux-logger";
import { setupListeners } from '@reduxjs/toolkit/query'

import userReducer from "../rtk/user";
import { tournamentAPI } from "./tournamenAPI";
export const store = configureStore({
    reducer: {
        [tournamentAPI.reducerPath]: tournamentAPI.reducer,
        user: userReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(tournamentAPI.middleware),//.concat(logger),
    devTools: import.meta.env.VITE_NODE_ENV !== "production",
});
setupListeners(store.dispatch);
