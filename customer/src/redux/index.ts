import { configureStore } from '@reduxjs/toolkit';
import AppReducer from '@src/redux/slice/App';
import HomeReducer from '@src/redux/slice/Home';
import VoucherReducer from '@src/redux/slice/Voucher';
import OrderReducer from '@src/redux/slice/Order';
import SignupReducer from '@src/redux/slice/Signup';
import ForgetPasswordReducer from '@src/redux/slice/ForgetPassword';
import { voucherRTK } from './query/voucherRTK';
import { orderRTK } from './query/orderRTK';
import { customerRTK } from './query/customerRTK';
import { postRTK } from './query/postRTK';
import { zaloRTK } from './query/zaloRTK';

export const store = configureStore({
    reducer: {
        dummy: (state = {}) => state,
        AppSlice: AppReducer,
        VoucherSlice: VoucherReducer,
        HomeSlice: HomeReducer,
        OrderSlice: OrderReducer,
        SignupSlice: SignupReducer,
        ForgetPasswordSlice: ForgetPasswordReducer,
        [voucherRTK.reducerPath]: voucherRTK.reducer,
        [orderRTK.reducerPath]: orderRTK.reducer,
        [customerRTK.reducerPath]: customerRTK.reducer,
        [postRTK.reducerPath]: postRTK.reducer,
        [zaloRTK.reducerPath]: zaloRTK.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            voucherRTK.middleware,
            orderRTK.middleware,
            customerRTK.middleware,
            postRTK.middleware,
            zaloRTK.middleware
        ),
});

// Type hỗ trợ
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
