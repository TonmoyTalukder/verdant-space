// features/products/productsSlice.ts

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TProduct } from '../../../types/productTypes';

export interface ProductsState {
  searchResults: TProduct[]; // Store search results
  allProducts: TProduct[]; // Store all products
}

const initialState: ProductsState = {
  searchResults: [],
  allProducts: [], // assuming you are fetching all products
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setSearchResults: (state, action: PayloadAction<TProduct[]>) => {
      state.searchResults = action.payload;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
});

export const { setSearchResults, clearSearchResults } = productsSlice.actions;

export default productsSlice.reducer;


// import { createSlice } from "@reduxjs/toolkit";

// type TProducts = {
//     name: null | string;
//     description: null | string;
// };

// type TInitialState = {
//     products: TProducts[];
// };

// const initialState: TInitialState = {
//     products: [],
// };

// const productsSlice = createSlice({
//     name: 'products',
//     initialState,
//     reducers: {
//       setProducts: (state, action) => {
//         const { name, description } = action.payload;
//         state.products.push({ name, description });
        
//         // Convert state to a plain object for logging
//       ("Updated state (plain):", JSON.stringify(state.products));
//       },
//     },
//   });
  

// export const { setProducts } = productsSlice.actions;

// export default productsSlice.reducer;


// import { createSlice } from "@reduxjs/toolkit";


// const initialState = {
//     products: [],
// };

// const productsSlice = createSlice({
//     name: 'products',
//     initialState,
//     reducers: {
      
//         },
//     },
// ) ;


// // export const {setProducts} = productsSlice.actions;

// export default productsSlice.reducer;




// type TSale = {
//     onSale: null | string;
//     onSaleDiscountPercentage: null | number;
// };

// type TInventory = {
//     quantity: null | number;
//     inStock: null | boolean;
// };


// type TProducts = {
//     name: null | string;
//     description: null | string;
//     // price: null | number;
//     // image: null | string;
//     // type: null | string;
//     // seasonal: null | string;
//     // rating: null | number;
//     // sale: TSale;
//     // tags: null | string[];
//     // inventory: TInventory;
//     // isDeleted?: null | boolean;
// };

// type TInitialState = {
//     products : TProducts[];
// }



// setProducts: (state, action) => {
//     const {name, description} = action.payload;
//     state.products.push(name, description); }