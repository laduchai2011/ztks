import { useEffect, useState, useRef } from 'react';
import AppRouter from '@src/router';
import axiosInstance from '@src/api/axiosInstance';
import { MyResponse } from '@src/dataStruct/response';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { set_account, set_accountInformation, set_myAdmin, set_zaloApp, set_calling } from '@src/redux/slice/App';
import { AccountField, AccountInformationField } from '@src/dataStruct/account';
import { useGetZaloAppWithAccountIdQuery } from '@src/redux/query/zaloRTK';
import { useLazyGetCallAgentWithAccountIdQuery } from '@src/redux/query/callAgentRTK';
import { useLazyGetLastMessageWithUidQuery } from '@src/redux/query/messageV1RTK';
import { getSocket } from '@src/socketIo';
import { MySip } from '@src/call';
import { CallInStateEnum, CallOutStateEnum } from '@src/dataStruct/call';
import { set_callOutState, set_callInState, set_callingIsIn } from '@src/redux/slice/App';
import { SessionState } from 'sip.js';
import CallDialog from './component/CallDialog';
import { useLazyGetZaloUserQuery, useLazyGetZaloOaWithOaIdQuery } from '@src/redux/query/zaloRTK';
import { ZaloAppField } from '@src/dataStruct/zalo';

const App = () => {
    const dispatch = useDispatch<AppDispatch>();
    const accountInformation: AccountInformationField | undefined = useSelector(
        (state: RootState) => state.AppSlice.accountInformation
    );
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);
    const myAdmin: number | undefined = useSelector((state: RootState) => state.AppSlice.myAdmin);
    const calling: { is: boolean; uid?: string } = useSelector((state: RootState) => state.AppSlice.calling);
    const callingIsIn: boolean | undefined = useSelector((state: RootState) => state.AppSlice.calling.isIn);
    const callingIsCallIn: boolean | undefined = useSelector((state: RootState) => state.AppSlice.calling.isCallIn);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const [getCallAgentWithAccountId] = useLazyGetCallAgentWithAccountIdQuery();
    const [getLastMessageWithUid] = useLazyGetLastMessageWithUidQuery();
    const [getZaloUser] = useLazyGetZaloUserQuery();
    const [getZaloOaWithOaId] = useLazyGetZaloOaWithOaIdQuery();

    const [mySip, setMySip] = useState<MySip | null>(null);

    useEffect(() => {
        if (!account) return;

        const socket = getSocket();
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
        const myId = sessionStorage.getItem('myId');

        if (myId === null) {
            const fetchCheckSignin = async () => {
                try {
                    const response = await axiosInstance.get<MyResponse<number>>(`/service_account/query/isSignin`);
                    const resData = response.data;
                    if (resData.isSuccess) {
                        if (resData.data) {
                            sessionStorage.setItem('myId', `${resData.data}`);
                        } else {
                            sessionStorage.removeItem('myId');
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            };

            fetchCheckSignin();
        }
    }, []);

    useEffect(() => {
        const getAccountInformation = async () => {
            try {
                const response = await axiosInstance.get<MyResponse<AccountInformationField>>(
                    `/service_account/query/getAccountInformation`
                );
                const resData = response.data;
                // console.log('getAccountInformation', resData);
                if (resData.isSuccess) {
                    if (resData.data) {
                        dispatch(set_accountInformation(resData.data));
                        dispatch(set_myAdmin(resData.data.addedById || -1));
                        sessionStorage.setItem('accountInformation', `${JSON.stringify(resData.data)}`);
                    } else {
                        sessionStorage.removeItem('accountInformation');
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        getAccountInformation();
    }, [dispatch]);

    useEffect(() => {
        const getAccount = async () => {
            try {
                const response = await axiosInstance.get<MyResponse<AccountField>>(`/service_account/query/getMe`);
                const resData = response.data;
                // console.log('getAccount', resData);
                if (resData.isSuccess) {
                    if (resData.data) {
                        dispatch(set_account(resData.data));
                        sessionStorage.setItem('account', `${JSON.stringify(resData.data)}`);
                    } else {
                        sessionStorage.removeItem('account');
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        getAccount();
    }, [dispatch]);

    const {
        data: data_zaloApp,
        // isFetching,
        isLoading: isLoading_zaloApp,
        isError: isError_zaloApp,
        error: error_zaloApp,
    } = useGetZaloAppWithAccountIdQuery(
        { role: accountInformation?.accountType || '', accountId: myAdmin || 0 },
        { skip: myAdmin === undefined || accountInformation === undefined }
    );
    useEffect(() => {
        if (isError_zaloApp && error_zaloApp) {
            console.error(error_zaloApp);
            // dispatch(
            //     setData_toastMessage({
            //         type: messageType_enum.ERROR,
            //         message: 'Lấy dữ liệu zalo-app KHÔNG thành công !',
            //     })
            // );
        }
    }, [dispatch, isError_zaloApp, error_zaloApp]);
    useEffect(() => {
        // dispatch(set_isLoading(isLoading_zaloApp));
    }, [dispatch, isLoading_zaloApp]);
    useEffect(() => {
        const resData = data_zaloApp;
        if (resData?.isSuccess && resData.data) {
            dispatch(set_zaloApp(resData.data));
        }
    }, [dispatch, data_zaloApp]);

    // useEffect(() => {
    //     getCallAgentWithAccountId({ accountId: -1 })
    //         .then(async (res) => {
    //             const resData = res.data;
    //             if (resData?.isSuccess && resData.data) {
    //                 const mySip_ = new MySip(resData.data.agentCode, resData.data.password);
    //                 mySip_.createUserAgent();
    //                 mySip_.createRegisterer();
    //                 await mySip_.connectSip();
    //                 await mySip_.handleIncomingCall(
    //                     (stream: MediaStream) => {
    //                         console.log('Receive remote stream');

    //                         // if (audioRef.current) {
    //                         //     audioRef.current.srcObject = stream;
    //                         //     audioRef.current.play().catch(console.error);
    //                         // }
    //                     },
    //                     (state) => {
    //                         switch (state) {
    //                             case SessionState.Initial:
    //                                 break;

    //                             case SessionState.Establishing:
    //                                 break;

    //                             case SessionState.Established:
    //                                 // setCallInState(CallInStateEnum.CALL_IN);
    //                                 break;

    //                             case SessionState.Terminating:
    //                                 // setCallInState(CallInStateEnum.CALL_END);
    //                                 break;

    //                             case SessionState.Terminated:
    //                                 // setCallInState(CallInStateEnum.CALL_END);
    //                                 break;
    //                         }
    //                     },
    //                     (invitation) => {
    //                         console.log(11111111, invitation.request.from.uri);
    //                         if (invitation) {
    //                             // setCallInState(CallInStateEnum.RINGING);
    //                         }
    //                     }
    //                 );
    //                 setMySip(mySip_);
    //             }
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //         });
    // }, [dispatch, getCallAgentWithAccountId]);

    useEffect(() => {
        let sip: MySip | null = null;
        let mounted = true;

        (async () => {
            const res = await getCallAgentWithAccountId({ accountId: -1 });

            if (!(res.data?.isSuccess && res.data.data)) {
                console.error('Failed to get call agent');
                return;
            }

            if (!mounted) return;

            sip = new MySip(res.data.data.agentCode, res.data.data.password);

            sip.createUserAgent();
            sip.createRegisterer();

            await sip.connectSip();

            await sip.handleIncomingCall(
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
                            dispatch(set_callInState(CallInStateEnum.CALL_IN));
                            break;

                        case SessionState.Terminating:
                            dispatch(set_callInState(CallInStateEnum.CALL_END));
                            break;

                        case SessionState.Terminated:
                            dispatch(set_callInState(CallInStateEnum.CALL_END));
                            break;
                    }
                },
                async (invitation) => {
                    const uid = invitation.request.from.uri.user;
                    // console.log('Incoming call from uid:', uid);

                    if (!uid) return;
                    if (!zaloApp) return;
                    if (!account) return;

                    try {
                        const resLastMessage = await getLastMessageWithUid({ uid });
                        const resDataLastMessage = resLastMessage.data;

                        if (resDataLastMessage?.isSuccess && resDataLastMessage.data) {
                            const resZaloOa = await getZaloOaWithOaId({
                                oaId: resDataLastMessage.data.oa_id,
                                accountId: account.id,
                            });
                            const resDataZaloOa = resZaloOa.data;
                            if (resDataZaloOa?.isSuccess && resDataZaloOa.data) {
                                const resZaloUser = await getZaloUser({
                                    zaloApp: zaloApp,
                                    zaloOa: resDataZaloOa.data,
                                    userIdByApp: resDataLastMessage.data.user_id_by_app,
                                });

                                const resDataZaloUser = resZaloUser.data;

                                if (invitation) {
                                    dispatch(
                                        set_calling({
                                            is: true,
                                            uid: undefined,
                                            chatRoomId: undefined,
                                            zaloOa: resDataZaloOa.data,
                                            zaloUser: resDataZaloUser?.data,
                                        })
                                    );
                                    dispatch(set_callingIsIn(true));
                                    dispatch(set_callInState(CallInStateEnum.RINGING));
                                }
                            }
                        }
                    } catch (error) {
                        console.error('Error fetching Zalo user:', error);
                    }
                }
            );

            setMySip(sip);
        })();

        return () => {
            mounted = false;

            if (sip) {
                void sip.disconnectSip();
            }
        };
    }, [dispatch, getCallAgentWithAccountId, getLastMessageWithUid, getZaloUser, getZaloOaWithOaId, zaloApp, account]);

    useEffect(() => {
        if (!mySip) return;

        if (calling.is && calling.uid) {
            let isTimeout = true;
            dispatch(set_callOutState(CallOutStateEnum.CONNECTING));
            setTimeout(() => {
                if (!isTimeout) return;
                dispatch(set_callOutState(CallOutStateEnum.CALL_END));
                mySip.destroyCallOut();
                mySip.destroyCallIn();
            }, 6000);
            mySip.callUid(`99${calling.uid}`, false, (state) => {
                // console.log('callUid state', state);
                isTimeout = false;
                switch (state) {
                    case SessionState.Initial:
                        // console.log('callUid state Initial', CallOutStateEnum.CONNECTING);
                        // dispatch(set_callOutState(CallOutStateEnum.CONNECTING));
                        break;

                    case SessionState.Establishing:
                        dispatch(set_callOutState(CallOutStateEnum.RINGING));
                        break;

                    case SessionState.Established:
                        dispatch(set_callOutState(CallOutStateEnum.CALL_IN));
                        break;

                    case SessionState.Terminating:
                        dispatch(set_callOutState(CallOutStateEnum.CALL_END));
                        break;

                    case SessionState.Terminated:
                        dispatch(set_callOutState(CallOutStateEnum.CALL_END));
                        break;
                }
            });
        }

        console.log('accept', callingIsCallIn);
        if (callingIsCallIn) {
            mySip.accept();
        }

        if (!calling.uid) {
            mySip.destroyCallOut();
        }

        if (!callingIsIn) {
            mySip.destroyCallIn();
        }
    }, [dispatch, mySip, calling, callingIsIn, callingIsCallIn]);

    return (
        <div>
            <AppRouter />
            <CallDialog />
            <audio style={{ display: 'hidden' }} ref={audioRef} />
        </div>
    );
};

export default App;
