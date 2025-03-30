import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

const dummyReducer = (state = {}, action: any) => state;

// Import slices here when you create them

export const store = configureStore({
  reducer: {
    dummy: dummyReducer,
    // Add your other reducers here
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // You can ignore specific action types or paths if needed
        // ignoredActions: ['some/action'],
        // ignoredPaths: ['some.path'],
      },
    }),
  devTools: import.meta.env.VITE_APP_NODE_ENV !== 'production',
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
