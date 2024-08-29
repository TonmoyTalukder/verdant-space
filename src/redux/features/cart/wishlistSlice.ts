// features/cart/wishlistSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WishlistItem {
    productId: string;
    productName: string;
    image: string;
    price: number;
}

export interface WishlistState {
    items: WishlistItem[];
}

const initialState: WishlistState = {
    items: [],
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        addToWishlist: (state, action: PayloadAction<{
            productId: string;
            productName: string;
            image: string;
            price: number;
        }>) => {
            const newItem = action.payload;
            console.log("Adding item:", newItem);

            // Check if the item already exists by comparing productId
            const existingItem = state.items.find((item) => item.productId === newItem.productId);

            if (!existingItem) {
                state.items.push(newItem);
            } 
        },

        removeFromWishlist: (state, action: PayloadAction<{ productId: string }>) => {
            state.items = state.items.filter(item => item.productId !== action.payload.productId);
        },

        clearWishlist(state) {
            state.items = [];
        },
    },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
