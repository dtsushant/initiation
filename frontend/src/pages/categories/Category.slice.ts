import { createSlice, PayloadAction, Reducer } from "@reduxjs/toolkit";
import { Category } from "/@/types/category.ts";

export interface CategoryFormState {
  code: string;
  label: string;
  description: string;
  level: number;
  parentCategoryCode?: string;
}

export interface CategoryState {
  categories: Category[];
  selectedCategory?: Category;
  form: CategoryFormState;
  loading: boolean;
  submitting: boolean;
  expanded: Record<string, boolean>; // submitting form
  error?: string; // error messages
}

// 🟦 Initial state
const initialState: CategoryState = {
  categories: [],
  selectedCategory: undefined,
  form: {
    code: "",
    label: "",
    description: "",
    level: 0,
    parentCategoryCode: undefined,
  },
  loading: false,
  submitting: false,
  expanded: {},
  error: undefined,
};

type CategoryFormField = keyof CategoryFormState;
type CategoryFormValue = string | number | undefined;

// 🟪 Redux slice
const categorySlice = createSlice({
  name: "category",
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
      state.selectedCategory = undefined;
    },
    startLoading: (state) => {
      console.log("loading the loading");
      state.loading = true;
      state.error = undefined;
    },
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
      state.loading = false;
    },
    setExpanded: (state, code: PayloadAction<string>) => {
      state.expanded = {
        ...state.expanded,
        [code.payload]: !state.expanded[code.payload],
      };
    },
    selectCategory: (state, action: PayloadAction<Category>) => {
      state.selectedCategory = action.payload;
      state.form = {
        code: action.payload.code,
        label: action.payload.label || "",
        description: action.payload.description || "",
        level: action.payload.level,
        parentCategoryCode: action.payload.parentCategoryCode,
      };
    },
    startSubmitting: (state) => {
      state.submitting = true;
      state.error = undefined;
    },
    submissionSuccess: (state) => {
      state.submitting = false;
      state.form = initialState.form;
    },
    submissionError: (state, action: PayloadAction<string>) => {
      state.submitting = false;
      state.error = action.payload;
    },
  },
});

export const {
  setFormField,
  resetForm,
  startLoading,
  setCategories,
  selectCategory,
  startSubmitting,
  submissionSuccess,
  submissionError,
  setExpanded,
} = categorySlice.actions;

export default categorySlice.reducer as Reducer<CategoryState>;
