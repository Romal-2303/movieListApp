// import library components and middlewares here
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import logger from "redux-logger";
import persistStore from "redux-persist/es/persistStore";
import persistReducer from "redux-persist/es/persistReducer";

//@ import root rducers
import { rootReducer } from "./rootReducer.ts";

const middleWares = [process.env.NODE_ENV !== "development" && logger].filter(
  Boolean
);

const persistConfig = {
  key: "root",
  storage,
  blacklist: [],
  whitelist: ["counterSlice", "dataFillModeSwitchSlice"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: true, // this is to prevet the error: "non-serializable value encountered" => this is because we might ran into a non plain javascript object while communicating with the backend
    }).concat(middleWares as any),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
