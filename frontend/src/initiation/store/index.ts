import { Action, configureStore } from "@reduxjs/toolkit";
import auth from "/src/initiation/components/auth/Auth.slice";

export const store = configureStore({
  reducer: { auth },
  devTools: {
    name: "Initiation",
  },
});

export type State = ReturnType<typeof store.getState>;

export function dispatchOnCall(action: Action) {
  return () => store.dispatch(action);
}
