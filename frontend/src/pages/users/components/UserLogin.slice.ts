import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createFormReducers,
  createInitialFormState,
  FormState,
} from "/@/lib/xingine-react/component/group/form/FormGroup.slice.ts";

interface LoginUser {
  email: string;
  password: string;
}
export interface LoginState extends FormState<LoginUser> {
  focusedField: string;
  forgotPasswordVisible: boolean;
}

const initialState: LoginState = {
  ...createInitialFormState<LoginUser>({
    email: "",
    password: "",
  }),
  focusedField: "",
  forgotPasswordVisible: false,
};

const slice = createSlice({
  name: "login",
  initialState,
  reducers: {
    ...createFormReducers<LoginUser>(),
    initializeLogin: () => initialState,
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
  startSubmitting,
  updateForgotPasswordVisible,
  updateFocus,
  blurField,
} = slice.actions;

export default slice.reducer;
