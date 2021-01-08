import { configureStore, getDefaultMiddleware  } from "@reduxjs/toolkit";
import rootReducer from "./reducers/index.js";

const isDevMode = process.env.NODE_ENV === "development";

const store = configureStore({
    reducer: rootReducer,
    devTools: isDevMode, //only show dev tools if we are in development mode
    middleware: getDefaultMiddleware({
		serializableCheck: false,
		immutableCheck: false
	})
});

export default store;