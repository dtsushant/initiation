import { Action, Reducer } from "@reduxjs/toolkit";
import { store } from "/@/store";

export type ReducersMap<State = unknown> = {
  [K in string]: Reducer<State, Action>;
};

export type State = ReturnType<typeof store.getState>;

export function dispatchOnCall(action: Action) {
  return () => store.dispatch(action);
}
