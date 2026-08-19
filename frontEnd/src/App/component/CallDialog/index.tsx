import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
// import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import Infor from './component/Infor';
import RequestConsent from './component/RequestConsent';
import Call from './component/Call';
import { IoMdClose } from 'react-icons/io';
import { CLOSE } from '@src/const/text';
import {
    useLazyGetMccInfoQuery,
    useLazyCheckConsentQuery,
    useRequestConsentMutation,
    useOutboundMutation,
} from '@src/redux/query/callRTK';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import {
    CallInStateEnum,
    CallInStateType,
    CallOutStateEnum,
    CallOutStateType,
    // CallTypeEnum,
} from '@src/dataStruct/call';
import { setData_toastMessage, setIsShow_callDialog } from '@src/redux/slice/App';
import { messageType_enum } from '@src/component/ToastMessage/type';

const CallDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);
    const zaloOa: ZaloOaField | undefined = useSelector((state: RootState) => state.MessageV1Slice.zaloOa);

    const isShow_callDialog: boolean | undefined = useSelector((state: RootState) => state.AppSlice.callDialog.isShow);
    const chatRoomId_callDialog: number | undefined = useSelector(
        (state: RootState) => state.AppSlice.callDialog.chatRoomId
    );
    const callInState_callDialog: CallInStateType = useSelector(
        (state: RootState) => state.AppSlice.callDialog.callInState
    );
    const callOutState_callDialog: CallOutStateType = useSelector(
        (state: RootState) => state.AppSlice.callDialog.callOutState
    );

    // const [agentCode, setAgentCode] = useState<string>('');
    // const [agentPassword, setAgentPassword] = useState<string>('taokosao201195');
    const [isRequestConsent, setIsRequestConsent] = useState<boolean>(false);
    // const [isConnecting, setIsConnecting] = useState<boolean>(false);
    // const [isRinging, setIsRinging] = useState<boolean>(false);
    // const [isCallIn, setIsCallIn] = useState<boolean>(false);
    // const [isCallOut, setIsCallOut] = useState<boolean>(false);
    // const [callInState, setCallInState] = useState<CallInStateType>(CallInStateEnum.CALL_END);
    // const [callOutState, setCallOutState] = useState<CallOutStateType>(CallOutStateEnum.CALL_END);

    const [checkConsent] = useLazyCheckConsentQuery();
    const [requestConsent] = useRequestConsentMutation();
    const [getMccInfo] = useLazyGetMccInfoQuery();
    const [outbound] = useOutboundMutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (isShow_callDialog) {
            parentElement.classList.add(style.display);
            const timeout2 = setTimeout(() => {
                parentElement.classList.add(style.opacity);
                clearTimeout(timeout2);
            }, 50);
        } else {
            parentElement.classList.remove(style.opacity);

            const timeout2 = setTimeout(() => {
                parentElement.classList.remove(style.display);
                clearTimeout(timeout2);
            }, 550);
        }
    }, [isShow_callDialog]);

    useEffect(() => {
        if (
            callInState_callDialog !== CallInStateEnum.CALL_END ||
            callOutState_callDialog !== CallOutStateEnum.CALL_END
        ) {
            // setIsRinging(true);
            setIsRequestConsent(false);
        } else {
            // setIsRinging(false);
        }
        // setCallInState(callInState_callDialog);
    }, [callInState_callDialog, callOutState_callDialog]);

    const audioRef = useRef<HTMLAudioElement>(null);
    useEffect(() => {
        // const handleSip = async () => {
        //     const mySip_ = new MySip('103', agentPassword);
        //     mySip_.createUserAgent();
        //     mySip_.createRegisterer();
        //     await mySip_.connectSip();
        //     await mySip_.handleIncomingCall(
        //         (stream: MediaStream) => {
        //             console.log('Receive remote stream');
        //             if (audioRef.current) {
        //                 audioRef.current.srcObject = stream;
        //                 audioRef.current.play().catch(console.error);
        //             }
        //         },
        //         (state) => {
        //             switch (state) {
        //                 case SessionState.Initial:
        //                     break;
        //                 case SessionState.Establishing:
        //                     break;
        //                 case SessionState.Established:
        //                     setCallInState(CallInStateEnum.CALL_IN);
        //                     break;
        //                 case SessionState.Terminating:
        //                     setCallInState(CallInStateEnum.CALL_END);
        //                     break;
        //                 case SessionState.Terminated:
        //                     setCallInState(CallInStateEnum.CALL_END);
        //                     break;
        //             }
        //         },
        //         (invitation) => {
        //             console.log(11111111, invitation.request.from.uri);
        //             if (invitation) {
        //                 setCallInState(CallInStateEnum.RINGING);
        //             }
        //         }
        //     );
        //     setMySip(mySip_);
        // };
        // handleSip();
    }, []);

    const handleClose = () => {
        // dispatch(set_calling({ is: false, uid: undefined, chatRoomId: undefined }));
        if (
            callInState_callDialog !== CallInStateEnum.CALL_END ||
            callOutState_callDialog !== CallOutStateEnum.CALL_END
        ) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.WARN,
                    message: 'Bạn không thể đóng khi đang ở trong 1 cuộc gọi !',
                })
            );
            return;
        }
        dispatch(setIsShow_callDialog(false));
    };

    // const handleOpenRequestConsent = () => {
    //     if (!zaloApp) return;
    //     if (!zaloOa) return;
    //     requestConsent({
    //         phone: '84789860854',
    //         call_type: CallTypeEnum.AUDIO,
    //         reason_code: 101,
    //         zaloApp: zaloApp,
    //         zaloOa: zaloOa,
    //         accountId: -1,
    //     })
    //         .then((res) => {
    //             console.log(res);
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //         });
    // };

    const handleGetAgent = () => {
        if (!zaloApp) return;
        if (!zaloOa) return;

        getMccInfo({
            zaloApp: zaloApp,
            zaloOa: zaloOa,
            accountId: -1,
        })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const handleOutbound = () => {
        if (!zaloApp) return;
        if (!zaloOa) return;
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.header}>Cuộc gọi</div>
                    <Infor setIsRequestConsent={setIsRequestConsent} />
                    <RequestConsent
                        isShow={isRequestConsent}
                        setIsShow={setIsRequestConsent}
                        chatRoomId={chatRoomId_callDialog || -1}
                    />
                    <Call />
                    <audio ref={audioRef} autoPlay playsInline />
                    {/* <button className={style.button} onClick={() => handleOpenRequestConsent()}>
                        Request Consent
                    </button> */}
                </div>
            </div>
        </div>
    );
};

export default memo(CallDialog);
