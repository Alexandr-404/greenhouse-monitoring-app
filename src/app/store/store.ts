import { configureStore } from "@reduxjs/toolkit";
import { api } from "../../shared/api";
import { roleReducer } from "../../features/authRole/model/slice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    authRole: roleReducer,
  },
  middleware: (gDM) => gDM().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
