import { configureStore } from '@reduxjs/toolkit';
import AppReducer from '@src/redux/slice/App';
import VoucherReducer from '@src/redux/slice/Voucher';
import { accountRTK } from './query/accountRTK';

export const store = configureStore({
    reducer: {
        dummy: (state = {}) => state,
        AppSlice: AppReducer,
        VoucherSlice: VoucherReducer,
        [accountRTK.reducerPath]: accountRTK.reducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(accountRTK.middleware),
});

// Type hỗ trợ
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
