import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../rtk/user';
import logger from 'redux-logger'
export const store = configureStore({
	reducer: {
		user: userReducer,
	},
	// middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
	devTools: import.meta.env.VITE_NODE_ENV !== 'production',
});