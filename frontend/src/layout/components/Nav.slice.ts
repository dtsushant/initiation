import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface NavState {
  collapsed: boolean;
  isDesktop: boolean;
  confirmationModalVisible: boolean;
}

const initialState: NavState = {
  collapsed: false,
  isDesktop: window.innerWidth >= 1024,
  confirmationModalVisible: false,
};

const slice = createSlice({
  name: "nav",
  initialState,
  reducers: {
    initializeApp: () => initialState,

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

export const { toggleCollapse, setIsDesktop, setConfirmationModalVisible } =
  slice.actions;

export default slice.reducer;
