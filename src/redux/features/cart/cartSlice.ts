// features/cart/cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  productId: string;
  productName: string;
  image: string;
  price: number;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<{ productId: string; productName: string; image: string; price: number; quantity: number }>) => {
      const { productId, quantity, productName, image, price } = action.payload;

      const existingItem = state.items.find((item) => item.productId === productId);

      if (existingItem) {
        // Replace the existing quantity with the new one
        existingItem.quantity = quantity;
        existingItem.price = price;
      } else {
        // Add new item to cart
        state.items.push({ productId, productName, image, quantity, price });
      }
    },

    updateCartQuantity: (state, action: PayloadAction<{ productId: string; quantity: number }>) => {
      const { productId, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.productId === productId);
      if (existingItem) {
        existingItem.quantity = quantity; // Update quantity
        existingItem.price = (existingItem.price / existingItem.quantity) * quantity; // Update price based on the new quantity
      }
    },

    removeFromCart: (state, action: PayloadAction<{ productId: string }>) => {
      state.items = state.items.filter(item => item.productId !== action.payload.productId);
    },

    clearCart(state) {
      state.items = [];
    },

  },
});

export const { addToCart, updateCartQuantity, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
