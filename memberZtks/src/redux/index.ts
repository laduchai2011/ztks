import { configureStore } from '@reduxjs/toolkit';
import AppReducer from '@src/redux/slice/App';
import VoucherReducer from '@src/redux/slice/Voucher';
import RequireTakeMoneyReducer from '@src/redux/slice/RequireTakeMoney';
import { accountRTK } from './query/accountRTK';
import { voucherRTK } from './query/voucherRTK';
import { walletRTK } from './query/walletRTK';
import { bankRTK } from './query/bankRTK';

export const store = configureStore({
    reducer: {
        dummy: (state = {}) => state,
        AppSlice: AppReducer,
        VoucherSlice: VoucherReducer,
        RequireTakeMoneySlice: RequireTakeMoneyReducer,
        [accountRTK.reducerPath]: accountRTK.reducer,
        [voucherRTK.reducerPath]: voucherRTK.reducer,
        [walletRTK.reducerPath]: walletRTK.reducer,
        [bankRTK.reducerPath]: bankRTK.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            accountRTK.middleware,
            voucherRTK.middleware,
            walletRTK.middleware,
            bankRTK.middleware
        ),
});

// Type hỗ trợ
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
