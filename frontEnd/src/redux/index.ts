import { configureStore } from '@reduxjs/toolkit';
import AppReducer from '@src/redux/slice/App';
import Home1Reducer from '@src/redux/slice/Home1';
import MessageV1Reducer from '@src/redux/slice/MessageV1';
import ManageMembersReducer from '@src/redux/slice/ManageMembers';
import MemberReceiveMessageReducer from '@src/redux/slice/MemberReceiveMessage';
import OaReducer from '@src/redux/slice/Oa';
import OaSettingReducer from '@src/redux/slice/OaSetting';
import SupportRoomReducer from '@src/redux/slice/SupportRoom';
import OrderReducer from '@src/redux/slice/Order';
import AccountReceiveMessageReducer from '@src/redux/slice/AccountReceiveMessage';
import ManageAgentReducer from '@src/redux/slice/ManageAgent';
import MemberReducer from '@src/redux/slice/Member';
import NoteReducer from '@src/redux/slice/Note';
import SignupReducer from '@src/redux/slice/Signup';
import ProfileReducer from '@src/redux/slice/Profile';
import ForgetPasswordReducer from '@src/redux/slice/ForgetPassword';
import WalletReducer from '@src/redux/slice/Wallet';
import ZnsReducer from '@src/redux/slice/Zns';
import BankReducer from '@src/redux/slice/Bank';
import { accountRTK } from './query/accountRTK';
import { myCustomerRTK } from './query/myCustomerRTK';
import { messageV1RTK } from './query/messageV1RTK';
import { zaloRTK } from './query/zaloRTK';
import { chatSessionRTK } from './query/chatSessionRTK';
import { chatRoomRTK } from './query/chatRoomRTK';
import { orderRTK } from './query/orderRTK';
import { agentRTK } from './query/agentRTK';
import { noteRTK } from './query/noteRTK';
import { walletRTK } from './query/walletRTK';
import { voucherRTK } from './query/voucherRTK';

export const store = configureStore({
    reducer: {
        dummy: (state = {}) => state,
        AppSlice: AppReducer,
        Home1Slice: Home1Reducer,
        MessageV1Slice: MessageV1Reducer,
        ManageMembersSlice: ManageMembersReducer,
        MemberReceiveMessageSlice: MemberReceiveMessageReducer,
        OaSlice: OaReducer,
        OaSettingSlice: OaSettingReducer,
        SupportRoomSlice: SupportRoomReducer,
        OrderSlice: OrderReducer,
        AccountReceiveMessageSlice: AccountReceiveMessageReducer,
        ManageAgentSlice: ManageAgentReducer,
        MemberSlice: MemberReducer,
        NoteSlice: NoteReducer,
        SignupSlice: SignupReducer,
        ProfileSlice: ProfileReducer,
        ForgetPasswordSlice: ForgetPasswordReducer,
        WalletSlice: WalletReducer,
        ZnsSlice: ZnsReducer,
        BankSlice: BankReducer,
        [accountRTK.reducerPath]: accountRTK.reducer,
        [myCustomerRTK.reducerPath]: myCustomerRTK.reducer,
        [messageV1RTK.reducerPath]: messageV1RTK.reducer,
        [zaloRTK.reducerPath]: zaloRTK.reducer,
        [chatSessionRTK.reducerPath]: chatSessionRTK.reducer,
        [chatRoomRTK.reducerPath]: chatRoomRTK.reducer,
        [orderRTK.reducerPath]: orderRTK.reducer,
        [agentRTK.reducerPath]: agentRTK.reducer,
        [noteRTK.reducerPath]: noteRTK.reducer,
        [walletRTK.reducerPath]: walletRTK.reducer,
        [voucherRTK.reducerPath]: voucherRTK.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            accountRTK.middleware,
            myCustomerRTK.middleware,
            messageV1RTK.middleware,
            zaloRTK.middleware,
            chatSessionRTK.middleware,
            chatRoomRTK.middleware,
            orderRTK.middleware,
            agentRTK.middleware,
            noteRTK.middleware,
            walletRTK.middleware,
            voucherRTK.middleware
        ),
});

// Type hỗ trợ
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
