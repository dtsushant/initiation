import { GenericErrors } from "/@/types/error.ts";
import { createSlice, PayloadAction, Reducer } from "@reduxjs/toolkit";
import { Category } from "/@/types/category.ts";

export interface CategoryFormFields {
  code: string;
  label: string;
  description: string;
  level: number;
  parentCategoryCode?: string;
}
export interface CategoryFormState {
  form: CategoryFormFields;
  autoGenerateCode: boolean;
  submitting: boolean;
  error?: GenericErrors;
}

const initialState: CategoryFormState = {
  form: {
    code: "",
    label: "",
    description: "",
    level: 0,
    parentCategoryCode: undefined,
  },
  autoGenerateCode: true,
  submitting: false,
  error: {},
};

export type CategoryFormField = keyof CategoryFormFields;
export type CategoryFormValue = string | number | undefined;

const categoryFormSlice = createSlice({
  name: "categoryForm",
  initialState,
  reducers: {
    setFormField: (
      state,
      {
        payload,
      }: PayloadAction<{ field: CategoryFormField; value: CategoryFormValue }>,
    ) => {
      state.form[payload.field] = payload.value;
    },
    resetForm: (state) => {
      state.form = initialState.form;
    },
    selectedCategory: (state, action: PayloadAction<Category | undefined>) => {
      state.form = action.payload
        ? {
            code: action.payload.code,
            label: action.payload.label || "",
            description: action.payload.description || "",
            level: action.payload.level,
            parentCategoryCode: action.payload.parentCategoryCode,
          }
        : initialState.form;
    },
    isAutoGenerateCode: (state, action: PayloadAction<boolean>) => {
      state.autoGenerateCode = action.payload;
    },
    startSubmitting: (state) => {
      state.submitting = true;
      state.error = undefined;
    },
    submissionSuccess: (state) => {
      state.submitting = false;
      state.form = initialState.form;
    },
    submissionError: (state, action: PayloadAction<GenericErrors>) => {
      state.submitting = false;
      state.error = action.payload;
    },
  },
});

export const {
  setFormField,
  resetForm,
  selectedCategory,
  startSubmitting,
  submissionSuccess,
  submissionError,
  isAutoGenerateCode,
} = categoryFormSlice.actions;

export default categoryFormSlice.reducer as Reducer<CategoryFormState>;
