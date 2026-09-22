import { useEffect, useState, useRef } from 'react';
import AppRouter from '@src/router';
import axiosInstance from '@src/api/axiosInstance';
import { My_Response_Field } from '@src/data_struct/response';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { set__account, set__account_information, set__my_admin, set__zalo_app } from '@src/redux/slice/App';
import { Account_Field, Account_Information_Field } from '@src/data_struct/account';
import { use_get_Zalo_App_With_Account_Id_Query } from '@src/redux/query/zalo_RTK';
import { useLazy_get_Call_Agent_With_Account_Id_Query } from '@src/redux/query/call_agent_RTK';
import { useLazy_get_Last_Message_With_Uid_Query } from '@src/redux/query/message_v1_RTK';
import { get_Socket } from '@src/socketIo';
import { My_Sip } from '@src/call';
import {
    Call_In_State_Enum,
    Call_Out_State_Enum,
    Call_In_State_Type,
    Call_Out_State_Type,
    Call_In_Cmd_Type,
    Call_Out_Cmd_Type,
    Call_In_Cmd_Enum,
    Call_Out_Cmd_Enum,
} from '@src/data_struct/call';
import {
    set__is_show__call_dialog,
    set__zalo_oa__call_dialog,
    set__zalo_user__call_dialog,
    set__call_in_cmd_type__call_dialog,
    set__call_out_cmd_type__call_dialog,
    set__call_out_state__call_dialog,
    set__call_in_state__call_dialog,
} from '@src/redux/slice/App';
import { SessionState } from 'sip.js';
import CallDialog from './component/CallDialog';
import { useLazy_get_Zalo_User_Query, useLazy_get_Zalo_Oa_With_Oa_Id_Query } from '@src/redux/query/zalo_RTK';
import { Zalo_App_Field } from '@src/data_struct/zalo';
// import { ZaloUserField } from '@src/dataStruct/zalo/user';

const App = () => {
    const dispatch = useDispatch<AppDispatch>();
    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const zalo_app: Zalo_App_Field | undefined = useSelector((state: RootState) => state.App_Slice.zalo_app);
    const my_admin: string | undefined = useSelector((state: RootState) => state.App_Slice.my_admin);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const is_show__call_dialog: boolean | undefined = useSelector(
        (state: RootState) => state.App_Slice.call_dialog.is_show
    );
    const uid__call_dialog: string | undefined = useSelector((state: RootState) => state.App_Slice.call_dialog.uid);
    // const chatRoomId_callDialog: number | undefined = useSelector(
    //     (state: RootState) => state.AppSlice.callDialog.chatRoomId
    // );
    // const zaloOa_callDialog: ZaloOaField | undefined = useSelector(
    //     (state: RootState) => state.AppSlice.callDialog.zaloOa
    // );
    // const zaloUser_callDialog: ZaloUserField | undefined = useSelector(
    //     (state: RootState) => state.AppSlice.callDialog.zaloUser
    // );
    const call_in_cmd_type__call_dialog: Call_In_Cmd_Type = useSelector(
        (state: RootState) => state.App_Slice.call_dialog.call_in_cmd_type
    );
    const call_out_cmd_type__call_dialog: Call_Out_Cmd_Type = useSelector(
        (state: RootState) => state.App_Slice.call_dialog.call_out_cmd_type
    );
    const call_in_state__call_dialog: Call_In_State_Type = useSelector(
        (state: RootState) => state.App_Slice.call_dialog.call_in_state
    );
    const call_out_state__call_dialog: Call_Out_State_Type = useSelector(
        (state: RootState) => state.App_Slice.call_dialog.call_out_state
    );

    const [get_Call_Agent_With_Account_Id] = useLazy_get_Call_Agent_With_Account_Id_Query();
    const [get_Last_Message_With_Uid] = useLazy_get_Last_Message_With_Uid_Query();
    const [get_Zalo_User] = useLazy_get_Zalo_User_Query();
    const [get_Zalo_Oa_With_Oa_Id] = useLazy_get_Zalo_Oa_With_Oa_Id_Query();

    const [my_sip, set__my_sip] = useState<My_Sip | null>(null);

    useEffect(() => {
        if (!account) return;

        const socket = get_Socket();
        const room = `accountId_${account.id}`;

        const onConnect = () => {
            socket.emit('joinRoom', room);
        };

        socket.on('connect', onConnect);

        // nếu socket đã connect sẵn từ trước thì join luôn
        if (socket.connected) {
            onConnect();
        }

        return () => {
            socket.emit('leaveRoom', room);
            socket.off('connect', onConnect);
        };
    }, [account]);

    useEffect(() => {
        const my_id = sessionStorage.getItem('myId');

        if (my_id === null) {
            const fetch_Check_Signin = async () => {
                try {
                    const response = await axiosInstance.get<My_Response_Field<string>>(
                        `/service__account/query/is_signin`
                    );
                    const res_data = response.data;
                    if (res_data.is_success) {
                        if (res_data.data) {
                            sessionStorage.setItem('myId', `${res_data.data}`);
                        } else {
                            sessionStorage.removeItem('myId');
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            };

            fetch_Check_Signin();
        }
    }, []);

    useEffect(() => {
        const get_Account_Information = async () => {
            try {
                const response = await axiosInstance.get<My_Response_Field<Account_Information_Field>>(
                    `/service__account/query/get_account_information`
                );
                const res_data = response.data;
                // console.log('getAccountInformation', resData);
                if (res_data.is_success) {
                    if (res_data.data) {
                        dispatch(set__account_information(res_data.data));
                        dispatch(set__my_admin(res_data.data.added_by_id || ''));
                        sessionStorage.setItem('accountInformation', `${JSON.stringify(res_data.data)}`);
                    } else {
                        sessionStorage.removeItem('accountInformation');
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        get_Account_Information();
    }, [dispatch]);

    useEffect(() => {
        const get_Account = async () => {
            try {
                const response =
                    await axiosInstance.get<My_Response_Field<Account_Field>>(`/service__account/query/get_me`);
                const res_data = response.data;
                // console.log('getAccount', resData);
                if (res_data.is_success) {
                    if (res_data.data) {
                        dispatch(set__account(res_data.data));
                        sessionStorage.setItem('account', `${JSON.stringify(res_data.data)}`);
                    } else {
                        sessionStorage.removeItem('account');
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        get_Account();
    }, [dispatch]);

    const {
        data: data__zalo_app,
        // isFetching,
        isLoading: is_loading__zalo_app,
        isError: is_error__zalo_app,
        error: error__zalo_app,
    } = use_get_Zalo_App_With_Account_Id_Query(
        { role: account_information?.account_type || '', account_id: my_admin || '' },
        { skip: my_admin === undefined || account_information === undefined }
    );
    useEffect(() => {
        if (is_error__zalo_app && error__zalo_app) {
            console.error(error__zalo_app);
        }
    }, [dispatch, is_error__zalo_app, error__zalo_app]);
    useEffect(() => {
        // dispatch(set_isLoading(isLoading_zaloApp));
    }, [dispatch, is_loading__zalo_app]);
    useEffect(() => {
        const res_data = data__zalo_app;
        if (res_data?.is_success && res_data.data) {
            dispatch(set__zalo_app(res_data.data));
        }
    }, [dispatch, data__zalo_app]);

    // connect call-center
    useEffect(() => {
        let sip: My_Sip | null = null;
        let mounted = true;

        (async () => {
            const res = await get_Call_Agent_With_Account_Id({ account_id: '' });

            if (!(res.data?.is_success && res.data.data)) {
                console.error('Failed to get call agent');
                return;
            }

            if (!mounted) return;

            sip = new My_Sip(res.data.data.agent_code, res.data.data.password);

            sip.create_User_Agent();
            sip.create_Registerer();

            await sip.connect_Sip();

            set__my_sip(sip);
        })();

        return () => {
            mounted = false;

            if (sip) {
                void sip.disconnect_Sip();
            }
        };
    }, [dispatch, get_Call_Agent_With_Account_Id]);

    useEffect(() => {
        if (!my_sip) return;
        my_sip.handle_Incoming_Call(
            (stream: MediaStream) => {
                console.log('Receive remote stream');

                if (audioRef.current) {
                    audioRef.current.srcObject = stream;
                    audioRef.current.play().catch(console.error);
                }
            },
            (state) => {
                switch (state) {
                    case SessionState.Initial:
                        break;

                    case SessionState.Establishing:
                        break;

                    case SessionState.Established:
                        dispatch(set__call_in_state__call_dialog(Call_In_State_Enum.CALL_IN));
                        break;

                    case SessionState.Terminating:
                        dispatch(set__call_in_state__call_dialog(Call_In_State_Enum.CALL_END));
                        break;

                    case SessionState.Terminated:
                        dispatch(set__call_in_state__call_dialog(Call_In_State_Enum.CALL_END));
                        break;
                }
            },
            async (invitation) => {
                const uid = invitation.request.from.uri.user;
                // console.log('Incoming call from uid:', uid);

                if (!uid) return;
                if (!zalo_app) return;
                if (!account_information) return;

                try {
                    const res__last_message = await get_Last_Message_With_Uid({ uid });
                    const res_data__last_message = res__last_message.data;

                    if (res_data__last_message?.is_success && res_data__last_message.data) {
                        const res__zalo_oa = await get_Zalo_Oa_With_Oa_Id({
                            oa_id: res_data__last_message.data.oa_id,
                            account_id: account_information.added_by_id || '',
                        });
                        const res_data__zalo_oa = res__zalo_oa.data;
                        if (res_data__zalo_oa?.is_success && res_data__zalo_oa.data) {
                            const res__zalo_user = await get_Zalo_User({
                                zalo_app: zalo_app,
                                zalo_oa: res_data__zalo_oa.data,
                                user_id_by_app: res_data__last_message.data.user_id_by_app,
                            });

                            const res_data__zalo_user = res__zalo_user.data;

                            if (invitation) {
                                dispatch(set__is_show__call_dialog(true));
                                dispatch(set__zalo_oa__call_dialog(res_data__zalo_oa.data));
                                dispatch(set__zalo_user__call_dialog(res_data__zalo_user?.data));
                                dispatch(set__call_in_state__call_dialog(Call_In_State_Enum.RINGING));
                            }
                        }
                    }
                } catch (error) {
                    console.error('Error fetching Zalo user:', error);
                }
            }
        );
    }, [
        dispatch,
        my_sip,
        zalo_app,
        account_information,
        get_Last_Message_With_Uid,
        get_Zalo_Oa_With_Oa_Id,
        get_Zalo_User,
    ]);
    useEffect(() => {
        if (!my_sip) return;

        switch (call_in_cmd_type__call_dialog) {
            case Call_In_Cmd_Enum.ACCEPT: {
                my_sip.accept();
                break;
            }
            case Call_In_Cmd_Enum.CANCEl: {
                my_sip.destroy_Call_In();
                break;
            }
            case Call_In_Cmd_Enum.EMPTY: {
                break;
            }
            case Call_In_Cmd_Enum.FINISH: {
                my_sip.destroy_Call_In();
                break;
            }
            default: {
                //statements;
                break;
            }
        }
    }, [my_sip, call_in_cmd_type__call_dialog]);
    useEffect(() => {
        if (call_in_state__call_dialog === Call_In_State_Enum.CALL_END) {
            dispatch(set__call_in_cmd_type__call_dialog(Call_In_Cmd_Enum.EMPTY));
        }
    }, [dispatch, call_in_state__call_dialog]);

    useEffect(() => {
        if (!my_sip) return;

        switch (call_out_cmd_type__call_dialog) {
            case Call_Out_Cmd_Enum.BEGIN: {
                if (is_show__call_dialog) {
                    if (uid__call_dialog) {
                        let isTimeout = true;
                        dispatch(set__call_out_state__call_dialog(Call_Out_State_Enum.CONNECTING));
                        setTimeout(() => {
                            if (!isTimeout) return;
                            dispatch(set__call_out_state__call_dialog(Call_Out_State_Enum.CALL_END));
                            my_sip.destroy_Call_Out();
                        }, 6000);
                        my_sip.call_Uid(`99${uid__call_dialog}`, false, (state) => {
                            // console.log('callUid state', state);
                            isTimeout = false;
                            switch (state) {
                                case SessionState.Initial:
                                    // console.log('callUid state Initial', CallOutStateEnum.CONNECTING);
                                    // dispatch(set_callOutState(CallOutStateEnum.CONNECTING));
                                    break;

                                case SessionState.Establishing:
                                    dispatch(set__call_out_state__call_dialog(Call_Out_State_Enum.RINGING));
                                    break;

                                case SessionState.Established:
                                    dispatch(set__call_out_state__call_dialog(Call_Out_State_Enum.CALL_IN));
                                    break;

                                case SessionState.Terminating:
                                    dispatch(set__call_out_state__call_dialog(Call_Out_State_Enum.CALL_END));
                                    break;

                                case SessionState.Terminated:
                                    dispatch(set__call_out_state__call_dialog(Call_Out_State_Enum.CALL_END));
                                    break;
                            }
                        });
                    }
                }
                break;
            }
            case Call_Out_Cmd_Enum.CANCEl: {
                my_sip.destroy_Call_Out();
                break;
            }
            case Call_Out_Cmd_Enum.EMPTY: {
                break;
            }
            case Call_Out_Cmd_Enum.FINISH: {
                my_sip.destroy_Call_Out();
                break;
            }
            default: {
                //statements;
                break;
            }
        }
    }, [dispatch, my_sip, is_show__call_dialog, uid__call_dialog, call_out_cmd_type__call_dialog]);
    useEffect(() => {
        if (call_out_state__call_dialog === Call_Out_State_Enum.CALL_END) {
            dispatch(set__call_out_cmd_type__call_dialog(Call_Out_Cmd_Enum.EMPTY));
        }
    }, [dispatch, call_out_state__call_dialog]);

    return (
        <div>
            <AppRouter />
            <CallDialog />
            <audio style={{ display: 'hidden' }} ref={audioRef} />
        </div>
    );
};

export default App;
