import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { GenericErrors } from "/@/lib/xingine-react/types/error.ts";

export type FormState<T> = {
  form: T;
  submitting: boolean;
  loading: boolean;
  errors: GenericErrors;
};

export function createInitialFormState<TForm>(form: TForm): FormState<TForm> {
  return {
    form,
    loading: false,
    submitting: false,
    errors: {},
  };
}

export function createFormReducers<T>() {
  return {
    updateField: (
      state: FormState<T>,
      action: PayloadAction<{ name: keyof T; value: T[keyof T] }>,
    ) => {
      state.form[action.payload.name] = action.payload.value;
    },
    startLoading: (state: FormState<T>) => {
      state.loading = true;
    },
    stopLoading: (state: FormState<T>) => {
      state.loading = false;
    },
    startSubmitting: (state: FormState<T>) => {
      state.submitting = true;
    },
    submissionSuccess: (state: FormState<T>) => {
      state.submitting = false;
      state.errors = {};
    },
    updateErrors: (
      state: FormState<T>,
      action: PayloadAction<GenericErrors>,
    ) => {
      state.submitting = false;
      state.errors = action.payload;
    },
  };
}

type DefaultFormType = Record<string, object>;
interface DefaultFormState extends FormState<DefaultFormType> {
  focusedField: string;
}

const initialState: DefaultFormState = {
  ...createInitialFormState({}),
  focusedField: "",
};

const slice = createSlice({
  name: "defaultFormState",
  initialState,
  reducers: {
    ...createFormReducers<DefaultFormType>(),
  },
});

export const {
  updateField,
  updateErrors,
  startSubmitting,
  submissionSuccess,
  startLoading,
  stopLoading,
} = slice.actions;

export default slice.reducer;
