import { configureStore } from '@reduxjs/toolkit';
import AppReducer from '@src/redux/slice/App';
import Home1Reducer from '@src/redux/slice/Home1';
import MessageV1Reducer from '@src/redux/slice/MessageV1';
import ManageMembersReducer from '@src/redux/slice/ManageMembers';
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
import ZnsDetailReducer from '@src/redux/slice/ZnsDetail';
import BankReducer from '@src/redux/slice/Bank';
import PostReducer from '@src/redux/slice/Post';
import RegisterPostReducer from '@src/redux/slice/RegisterPost';
import LeaveReducer from '@src/redux/slice/Leave';
import DashBoardReducer from '@src/redux/slice/DashBoard';
import CheckInOutReducer from '@src/redux/slice/CheckInOut';
import CheckInOutManagerReducer from '@src/redux/slice/CheckInOutManager';
import { account_RTK } from './query/account_RTK';
import { call_RTK } from './query/call_RTK';
import { call_agent_RTK } from './query/call_agent_RTK';
import { message_v1_RTK } from './query/message_v1_RTK';
import { zaloRTK } from './query/zaloRTK';
import { chat_session_RTK } from './query/chat_session_RTK';
import { chat_room_RTK } from './query/chat_room_RTK';
import { orderRTK } from './query/orderRTK';
import { agent_RTK } from './query/agent_RTK';
import { noteRTK } from './query/noteRTK';
import { walletRTK } from './query/walletRTK';
import { voucherRTK } from './query/voucherRTK';
import { bank_RTK } from './query/bank_RTK';
import { postRTK } from './query/postRTK';
import { statisticsRTK } from './query/statisticsRTK';
import { check_in_out_RTK } from './query/check_in_out_RTK';

export const store = configureStore({
    reducer: {
        dummy: (state = {}) => state,
        AppSlice: AppReducer,
        Home1Slice: Home1Reducer,
        MessageV1Slice: MessageV1Reducer,
        ManageMembersSlice: ManageMembersReducer,
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
        ZnsDetailSlice: ZnsDetailReducer,
        BankSlice: BankReducer,
        PostSlice: PostReducer,
        RegisterPostSlice: RegisterPostReducer,
        LeaveSlice: LeaveReducer,
        DashBoardSlice: DashBoardReducer,
        CheckInOutSlice: CheckInOutReducer,
        CheckInOutManagerSlice: CheckInOutManagerReducer,
        [account_RTK.reducerPath]: account_RTK.reducer,
        [call_RTK.reducerPath]: call_RTK.reducer,
        [call_agent_RTK.reducerPath]: call_agent_RTK.reducer,
        [message_v1_RTK.reducerPath]: message_v1_RTK.reducer,
        [zaloRTK.reducerPath]: zaloRTK.reducer,
        [chat_session_RTK.reducerPath]: chat_session_RTK.reducer,
        [chat_room_RTK.reducerPath]: chat_room_RTK.reducer,
        [orderRTK.reducerPath]: orderRTK.reducer,
        [agent_RTK.reducerPath]: agent_RTK.reducer,
        [noteRTK.reducerPath]: noteRTK.reducer,
        [walletRTK.reducerPath]: walletRTK.reducer,
        [voucherRTK.reducerPath]: voucherRTK.reducer,
        [bank_RTK.reducerPath]: bank_RTK.reducer,
        [postRTK.reducerPath]: postRTK.reducer,
        [statisticsRTK.reducerPath]: statisticsRTK.reducer,
        [check_in_out_RTK.reducerPath]: check_in_out_RTK.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            account_RTK.middleware,
            call_RTK.middleware,
            call_agent_RTK.middleware,
            message_v1_RTK.middleware,
            zaloRTK.middleware,
            chat_session_RTK.middleware,
            chat_room_RTK.middleware,
            orderRTK.middleware,
            agent_RTK.middleware,
            noteRTK.middleware,
            walletRTK.middleware,
            voucherRTK.middleware,
            bank_RTK.middleware,
            postRTK.middleware,
            statisticsRTK.middleware,
            check_in_out_RTK.middleware
        ),
});

// Type hỗ trợ
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
