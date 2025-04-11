import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GenericErrors } from "/@/types/error.ts";

export interface LoginState {
  user: {
    email: string;
    password: string;
  };
  errors: GenericErrors;
  loginIn: boolean;
  focusedField: string;
  forgotPasswordVisible: boolean;
}

const initialState: LoginState = {
  user: {
    email: "",
    password: "",
  },
  errors: {},
  loginIn: false,
  focusedField: "",
  forgotPasswordVisible: false,
};

const slice = createSlice({
  name: "login",
  initialState,
  reducers: {
    initializeLogin: () => initialState,
    updateField: (
      state,
      {
        payload: { name, value },
      }: PayloadAction<{ name: keyof LoginState["user"]; value: string }>,
    ) => {
      state.user[name] = value;
    },
    updateErrors: (
      state,
      { payload: errors }: PayloadAction<GenericErrors>,
    ) => {
      state.errors = errors;
      state.loginIn = false;
    },
    startLoginIn: (state) => {
      state.loginIn = true;
    },
    updateForgotPasswordVisible: (
      state,
      { payload }: PayloadAction<boolean>,
    ) => {
      state.forgotPasswordVisible = payload;
    },
    updateFocus: (state, { payload }: PayloadAction<string>) => {
      state.focusedField = payload;
    },
    blurField: (state) => {
      state.focusedField = "";
    },
  },
});

export const {
  initializeLogin,
  updateField,
  updateErrors,
  startLoginIn,
  updateForgotPasswordVisible,
  updateFocus,
  blurField,
} = slice.actions;

export default slice.reducer;
