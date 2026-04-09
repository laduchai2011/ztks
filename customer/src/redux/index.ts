import { configureStore } from '@reduxjs/toolkit';
import AppReducer from '@src/redux/slice/App';
import VoucherReducer from '@src/redux/slice/Voucher';
import OrderReducer from '@src/redux/slice/Order';
import { accountRTK } from './query/accountRTK';
import { voucherRTK } from './query/voucherRTK';
import { orderRTK } from './query/orderRTK';

export const store = configureStore({
    reducer: {
        dummy: (state = {}) => state,
        AppSlice: AppReducer,
        VoucherSlice: VoucherReducer,
        OrderSlice: OrderReducer,
        [accountRTK.reducerPath]: accountRTK.reducer,
        [voucherRTK.reducerPath]: voucherRTK.reducer,
        [orderRTK.reducerPath]: orderRTK.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(accountRTK.middleware, voucherRTK.middleware, orderRTK.middleware),
});

// Type hỗ trợ
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
