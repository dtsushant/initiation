import { createSlice, PayloadAction, Reducer } from "@reduxjs/toolkit";
import { Category } from "/@/types/category.ts";

export interface CategoryState {
  categories: Category[];
  selectedCategory?: Category;
  loading: boolean;
  expanded: Record<string, boolean>; // submitting form
  error?: string; // error messages
}

// 🟦 Initial state
const initialState: CategoryState = {
  categories: [],
  selectedCategory: undefined,
  loading: false,
  expanded: {},
  error: undefined,
};

// 🟪 Redux slice
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    startLoading: (state) => {
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
    selectCategory: (state, action: PayloadAction<Category | undefined>) => {
      state.selectedCategory = action.payload;
    },
  },
});

export const { startLoading, setCategories, selectCategory, setExpanded } =
  categorySlice.actions;

export default categorySlice.reducer as Reducer<CategoryState>;
