import { configureStore } from "@reduxjs/toolkit";
import productsReducer from './features/products/productsSlice';
import { baseApi } from "./api/baseApi"; // Assuming you're using RTK Query

export const store = configureStore({
  reducer: {
    // Use baseApi.reducer instead of baseApi.reducerPath here
    [baseApi.reducerPath]: baseApi.reducer,
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware), // Add the API middleware
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in dev
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
