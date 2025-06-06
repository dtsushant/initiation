import { Action, Reducer } from "@reduxjs/toolkit";
import { store } from "/src/initiation/store";

export type ReducersMap<State = unknown> = {
  [K in string]: Reducer<State, Action>;
};

export type State = ReturnType<typeof store.getState>;

export function dispatchOnCall(action: Action) {
  return () => store.dispatch(action);
}
