import { configureStore } from "@reduxjs/toolkit";
import productsReducer from './features/products/productsSlice';
import cartReducer from './features/cart/cartSlice';
import authReducer from './features/users/authSlice';
import orderReducer from './features/orders/ordersSlice';
import wishlistReducer from './features/cart/wishlistSlice';
import { baseApi } from "./api/baseApi"; // Assuming you're using RTK Query

export const store = configureStore({
  reducer: {
    // Use baseApi.reducer instead of baseApi.reducerPath here
    [baseApi.reducerPath]: baseApi.reducer,
    products: productsReducer,
    cart: cartReducer,
    auth: authReducer,
    order: orderReducer,
    wishlist: wishlistReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware), // Add the API middleware
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in dev
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;


// import { configureStore } from "@reduxjs/toolkit";
// import productsReducer from './features/products/productsSlice';
// import cartReducer from './features/cart/cartSlice';
// import authReducer from './features/users/authSlice';
// import { baseApi } from "./api/baseApi"; // Assuming you're using RTK Query

// import {
//   persistReducer,
//   persistStore,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from 'redux-persist';
// import storage from "redux-persist/lib/storage";

// const persistConfig = {
//   key: 'auth',
//   storage,
// }

// const persistedAuthReducer = persistReducer(persistConfig, authReducer);

// export const store = configureStore({
//   reducer: {
//     // Use baseApi.reducer instead of baseApi.reducerPath here
//     [baseApi.reducerPath]: baseApi.reducer,
//     products: productsReducer,
//     cart: cartReducer,
//     auth: persistedAuthReducer,
//   },
//   middleware: (getDefaultMiddlewares) => getDefaultMiddlewares({
//     serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
// }).concat(baseApi.middleware), // Add the API middleware
//   devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in dev
// });

// // Infer the `RootState` and `AppDispatch` types from the store itself
// export type RootState = ReturnType<typeof store.getState>;
// // Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
// export type AppDispatch = typeof store.dispatch;

// export const persistor = persistStore(store);

