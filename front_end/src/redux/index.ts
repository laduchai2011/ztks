import { configureStore } from '@reduxjs/toolkit';
import App_Reducer from '@src/redux/slice/App';
import Home_V1_Reducer from '@src/redux/slice/Home_V1';
import Message_V1_Reducer from '@src/redux/slice/Message_V1';
import Oa_Reducer from '@src/redux/slice/Oa';
import Oa_Setting_Reducer from '@src/redux/slice/Oa_Setting';
import Support_Room_Reducer from '@src/redux/slice/Support_Room';
import Order_Reducer from '@src/redux/slice/Order';
import Account_Receive_Message_Reducer from '@src/redux/slice/Account_Receive_Message';
import Manage_Agent_Reducer from '@src/redux/slice/Manage_Agent';
import Member_Reducer from '@src/redux/slice/Member';
import Note_Reducer from '@src/redux/slice/Note';
import Signup_Reducer from '@src/redux/slice/Signup';
import Profile_Reducer from '@src/redux/slice/Profile';
import Forget_Password_Reducer from '@src/redux/slice/Forget_Password';
import Wallet_Reducer from '@src/redux/slice/Wallet';
import Zns_Reducer from '@src/redux/slice/Zns';
import Zns_Detail_Reducer from '@src/redux/slice/Zns_Detail';
import Bank_Reducer from '@src/redux/slice/Bank';
import Post_Reducer from '@src/redux/slice/Post';
import Register_Post_Reducer from '@src/redux/slice/Register_Post';
import Leave_Reducer from '@src/redux/slice/Leave';
import Dash_Board_Reducer from '@src/redux/slice/Dash_Board';
import Check_In_Out_Reducer from '@src/redux/slice/Check_In_Out';
import Check_In_Out_Manager_Reducer from '@src/redux/slice/Check_In_Out_Manager';
import { account_RTK } from './query/account_RTK';
import { call_RTK } from './query/call_RTK';
import { call_agent_RTK } from './query/call_agent_RTK';
import { message_v1_RTK } from './query/message_v1_RTK';
import { zalo_RTK } from './query/zalo_RTK';
import { chat_session_RTK } from './query/chat_session_RTK';
import { chat_room_RTK } from './query/chat_room_RTK';
import { order_RTK } from './query/order_RTK';
import { agent_RTK } from './query/agent_RTK';
import { note_RTK } from './query/note_RTK';
import { wallet_RTK } from './query/wallet_RTK';
import { voucher_RTK } from './query/voucher_RTK';
import { bank_RTK } from './query/bank_RTK';
import { post_RTK } from './query/post_RTK';
import { statistics_RTK } from './query/statistics_RTK';
import { check_in_out_RTK } from './query/check_in_out_RTK';

export const store = configureStore({
    reducer: {
        dummy: (state = {}) => state,
        App_Slice: App_Reducer,
        Home_V1_Slice: Home_V1_Reducer,
        Message_V1_Slice: Message_V1_Reducer,
        Oa_Slice: Oa_Reducer,
        Oa_Setting_Slice: Oa_Setting_Reducer,
        Support_Room_Slice: Support_Room_Reducer,
        Order_Slice: Order_Reducer,
        Account_Receive_Message_Slice: Account_Receive_Message_Reducer,
        Manage_Agent_Slice: Manage_Agent_Reducer,
        Member_Slice: Member_Reducer,
        Note_Slice: Note_Reducer,
        Signup_Slice: Signup_Reducer,
        Profile_Slice: Profile_Reducer,
        Forget_Password_Slice: Forget_Password_Reducer,
        Wallet_Slice: Wallet_Reducer,
        Zns_Slice: Zns_Reducer,
        Zns_Detail_Slice: Zns_Detail_Reducer,
        Bank_Slice: Bank_Reducer,
        Post_Slice: Post_Reducer,
        Register_Post_Slice: Register_Post_Reducer,
        Leave_Slice: Leave_Reducer,
        Dash_Board_Slice: Dash_Board_Reducer,
        Check_In_Out_Slice: Check_In_Out_Reducer,
        Check_In_Out_Manager_Slice: Check_In_Out_Manager_Reducer,
        [account_RTK.reducerPath]: account_RTK.reducer,
        [call_RTK.reducerPath]: call_RTK.reducer,
        [call_agent_RTK.reducerPath]: call_agent_RTK.reducer,
        [message_v1_RTK.reducerPath]: message_v1_RTK.reducer,
        [zalo_RTK.reducerPath]: zalo_RTK.reducer,
        [chat_session_RTK.reducerPath]: chat_session_RTK.reducer,
        [chat_room_RTK.reducerPath]: chat_room_RTK.reducer,
        [order_RTK.reducerPath]: order_RTK.reducer,
        [agent_RTK.reducerPath]: agent_RTK.reducer,
        [note_RTK.reducerPath]: note_RTK.reducer,
        [wallet_RTK.reducerPath]: wallet_RTK.reducer,
        [voucher_RTK.reducerPath]: voucher_RTK.reducer,
        [bank_RTK.reducerPath]: bank_RTK.reducer,
        [post_RTK.reducerPath]: post_RTK.reducer,
        [statistics_RTK.reducerPath]: statistics_RTK.reducer,
        [check_in_out_RTK.reducerPath]: check_in_out_RTK.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(
            account_RTK.middleware,
            call_RTK.middleware,
            call_agent_RTK.middleware,
            message_v1_RTK.middleware,
            zalo_RTK.middleware,
            chat_session_RTK.middleware,
            chat_room_RTK.middleware,
            order_RTK.middleware,
            agent_RTK.middleware,
            note_RTK.middleware,
            wallet_RTK.middleware,
            voucher_RTK.middleware,
            bank_RTK.middleware,
            post_RTK.middleware,
            statistics_RTK.middleware,
            check_in_out_RTK.middleware
        ),
});

// Type hỗ trợ
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
