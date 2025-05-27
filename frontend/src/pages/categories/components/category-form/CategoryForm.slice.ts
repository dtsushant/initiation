import { createSlice, PayloadAction, Reducer } from "@reduxjs/toolkit";
import { Category, CategoryFormFields } from "/@/types/category.ts";
import {
  createFormReducers,
  createInitialFormState,
  FormState,
} from "/@/lib/xingine-react/component/group/form/FormGroup.slice.ts";

export interface CategoryFormState extends FormState<CategoryFormFields> {
  autoGenerateCode: boolean;
}

const initialState: CategoryFormState = {
  ...createInitialFormState<CategoryFormFields>({
    code: "",
    label: "",
    description: "",
    parentCategoryCode: undefined,
  }),
  autoGenerateCode: true,
};

export type CategoryFormField = keyof CategoryFormFields;
export type CategoryFormValue = string | number | undefined;

const categoryFormSlice = createSlice({
  name: "categoryForm",
  initialState,
  reducers: {
    ...createFormReducers<CategoryFormFields>(),
    resetForm: (state) => {
      state.form = initialState.form;
    },
    selectedCategory: (state, action: PayloadAction<Category | undefined>) => {
      state.form = action.payload
        ? {
            code: action.payload.code,
            label: action.payload.label || "",
            description: action.payload.description || "",
            parentCategoryCode: action.payload.parentCategoryCode,
          }
        : initialState.form;
    },
    isAutoGenerateCode: (state, action: PayloadAction<boolean>) => {
      state.autoGenerateCode = action.payload;
    },
  },
});

export const {
  updateField,
  resetForm,
  selectedCategory,
  startSubmitting,
  submissionSuccess,
  updateErrors,
  isAutoGenerateCode,
} = categoryFormSlice.actions;

export default categoryFormSlice.reducer as Reducer<CategoryFormState>;
