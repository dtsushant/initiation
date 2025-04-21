import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "/@/types/auth.ts";
import { ModulePropertyOptions } from "@xingine/core/xingine.type";

export interface AppState {
  user: User | null;
  allowedModule: ModulePropertyOptions[] | null;
  loading: boolean;
}

const initialState: AppState = {
  user: null,
  loading: true,
  allowedModule: null,
};

const slice = createSlice({
  name: "app",
  initialState,
  reducers: {
    initializeApp: () => initialState,
    loadUser: (state, { payload: user }: PayloadAction<User>) => {
      state.user = user;
      state.loading = false;
    },
    loadAllowedModule: (
      state,
      { payload: allowedModules }: PayloadAction<ModulePropertyOptions[]>,
    ) => {
      state.allowedModule = allowedModules;
    },
    logout: (state) => {
      state.user = null;
    },
    endLoad: (state) => {
      state.loading = false;
    },
  },
});

export const { loadUser, loadAllowedModule, logout, endLoad, initializeApp } =
  slice.actions;

export default slice.reducer;
