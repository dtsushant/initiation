import { Action, configureStore } from "@reduxjs/toolkit";
import app from "/@/components/app/App.slice";
import login from "/@/pages/auth/Login.slice";
import category from "/@/pages/categories/Category.slice";
import nav from "/@/layout/components/nav.slice";
import categoryForm from "/@/pages/categories/components/category-form/CategoryForm.slice";

export const store = configureStore({
  reducer: { app, login, category, nav, categoryForm },
  devTools: {
    name: "Initiation",
  },
});

export type State = ReturnType<typeof store.getState>;

export function dispatchOnCall(action: Action) {
  return () => store.dispatch(action);
}
