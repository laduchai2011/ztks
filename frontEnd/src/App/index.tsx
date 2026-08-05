import { useEffect, useState } from 'react';
import AppRouter from '@src/router';
import axiosInstance from '@src/api/axiosInstance';
import { MyResponse } from '@src/dataStruct/response';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { set_account, set_accountInformation, set_myAdmin, set_zaloApp } from '@src/redux/slice/App';
import { AccountField, AccountInformationField } from '@src/dataStruct/account';
import { useGetZaloAppWithAccountIdQuery } from '@src/redux/query/zaloRTK';
import { useLazyGetCallAgentWithAccountIdQuery } from '@src/redux/query/callAgentRTK';
import { getSocket } from '@src/socketIo';
import { MySip } from '@src/call';
import { CallInStateEnum, CallInStateType, CallOutStateEnum, CallOutStateType } from '@src/dataStruct/call';
import { SessionState } from 'sip.js';
import CallDialog from './component/CallDialog';

const App = () => {
    const dispatch = useDispatch<AppDispatch>();
    const accountInformation: AccountInformationField | undefined = useSelector(
        (state: RootState) => state.AppSlice.accountInformation
    );
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const myAdmin: number | undefined = useSelector((state: RootState) => state.AppSlice.myAdmin);
    const calling: { is: boolean; uid?: string } = useSelector((state: RootState) => state.AppSlice.calling);

    const [getCallAgentWithAccountId] = useLazyGetCallAgentWithAccountIdQuery();

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

                    // if (audioRef.current) {
                    //     audioRef.current.srcObject = stream;
                    //     audioRef.current.play().catch(console.error);
                    // }
                },
                (state) => {
                    switch (state) {
                        case SessionState.Initial:
                            break;

                        case SessionState.Establishing:
                            break;

                        case SessionState.Established:
                            // setCallInState(CallInStateEnum.CALL_IN);
                            break;

                        case SessionState.Terminating:
                            // setCallInState(CallInStateEnum.CALL_END);
                            break;

                        case SessionState.Terminated:
                            // setCallInState(CallInStateEnum.CALL_END);
                            break;
                    }
                },
                (invitation) => {
                    console.log(11111111, invitation.request.from.uri);
                    if (invitation) {
                        // setCallInState(CallInStateEnum.RINGING);
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
    }, [getCallAgentWithAccountId]);

    useEffect(() => {
        if (!mySip) return;

        if (calling.is && calling.uid) {
            mySip.callUid(`99${calling.uid}`, false, (state) => {
                console.log('callUid state', state);
                switch (state) {
                    case SessionState.Initial:
                        break;

                    case SessionState.Establishing:
                        break;

                    case SessionState.Established:
                        break;

                    case SessionState.Terminating:
                        break;

                    case SessionState.Terminated:
                        break;
                }
            });
        }
    }, [mySip, calling]);

    useEffect(() => {}, []);

    return (
        <div>
            <AppRouter />
            <CallDialog />
        </div>
    );
};

export default App;
