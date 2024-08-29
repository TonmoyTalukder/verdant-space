import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../../store';

export interface OrderState {
    orderId: string | null;
    products: Array<{ productId: string; quantity: number }> | [];
    price: number | null;
}

const initialState: OrderState = {
    orderId: null,
    products: [],
    price: null,
};

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        setOrderId: (state, action: PayloadAction<string>) => {
            state.orderId = action.payload;
        },
        setOrderProducts: (state, action: PayloadAction<Array<{ productId: string; quantity: number }>>) => {
            state.products = action.payload;
        },
        setOrderedTotalPrice: (state, action: PayloadAction<number>) => {
            state.price = action.payload;
        },
        clearOrderId: (state) => {
            state.orderId = null;
        },
    },
});

export const { setOrderId, clearOrderId, setOrderProducts, setOrderedTotalPrice } = orderSlice.actions;

export const selectOrderId = (state: RootState) => state.order.orderId;

export default orderSlice.reducer;
