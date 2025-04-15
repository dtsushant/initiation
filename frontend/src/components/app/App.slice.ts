import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "/@/types/auth.ts";

export interface AppState {
  user: User | null;
  loading: boolean;
  collapsed: boolean;
  isDesktop: boolean;
  confirmationModalVisible: boolean;
}

const initialState: AppState = {
  user: null,
  loading: true,
  collapsed: false,
  isDesktop: window.innerWidth >= 1024,
  confirmationModalVisible: false,
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
    logout: (state) => {
      state.user = null;
    },
    endLoad: (state) => {
      state.loading = false;
    },
    toggleCollapse: (state, { payload }: PayloadAction<boolean>) => {
      state.collapsed = payload;
    },
    setIsDesktop: (state, { payload }: PayloadAction<boolean>) => {
      state.isDesktop = payload;
    },
    setConfirmationModalVisible: (
      state,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.confirmationModalVisible = payload;
    },
  },
});

export const {
  loadUser,
  logout,
  endLoad,
  initializeApp,
  toggleCollapse,
  setIsDesktop,
  setConfirmationModalVisible,
} = slice.actions;

export default slice.reducer;
