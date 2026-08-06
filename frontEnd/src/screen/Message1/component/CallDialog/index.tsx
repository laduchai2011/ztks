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
import { MySip } from '../../call';
import { setIsShow_callDialog } from '@src/redux/slice/MessageV1';
import {
    useLazyGetMccInfoQuery,
    useLazyCheckConsentQuery,
    useRequestConsentMutation,
    useOutboundMutation,
} from '@src/redux/query/callRTK';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { CallInStateEnum, CallInStateType, CallOutStateEnum, CallOutStateType } from '@src/dataStruct/call';

const CallDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);
    const zaloOa: ZaloOaField | undefined = useSelector((state: RootState) => state.MessageV1Slice.zaloOa);
    const isShow: boolean = useSelector((state: RootState) => state.MessageV1Slice.callDialog.isShow);
    const uid: string = useSelector((state: RootState) => state.MessageV1Slice.uid);

    const [agentCode, setAgentCode] = useState<string>('');
    const [agentPassword, setAgentPassword] = useState<string>('taokosao201195');
    const [isRequestConsent, setIsRequestConsent] = useState<boolean>(false);
    const [isConnecting, setIsConnecting] = useState<boolean>(false);
    const [isRinging, setIsRinging] = useState<boolean>(false);
    const [isCallIn, setIsCallIn] = useState<boolean>(false);
    const [isCallOut, setIsCallOut] = useState<boolean>(false);
    const [mySip, setMySip] = useState<MySip | null>(null);
    const [callInState, setCallInState] = useState<CallInStateType>(CallInStateEnum.CALL_END);
    const [callOutState, setCallOutState] = useState<CallOutStateType>(CallOutStateEnum.CALL_END);

    const [checkConsent] = useLazyCheckConsentQuery();
    const [requestConsent] = useRequestConsentMutation();
    const [getMccInfo] = useLazyGetMccInfoQuery();
    const [outbound] = useOutboundMutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (isShow) {
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
    }, [isShow]);

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
    }, [agentPassword]);

    // useEffect(() => {
    //     if (!mySip) return;
    //     mySip.handleIncomingCall((stream: MediaStream) => {
    //         console.log('Receive remote stream');
    //         if (audioRef.current) {
    //             audioRef.current.srcObject = stream;
    //             audioRef.current.play().catch(console.error);
    //         }
    //     });
    // }, [mySip]);

    const handleInComing = async () => {
        // const mySip = new MySip('103', agentPassword);
        // mySip.createUserAgent();
        // mySip.createRegisterer();
        // await mySip.connectSip();
        // await mySip.handleIncomingCall((stream: MediaStream) => {
        //     console.log('Receive remote stream');
        //     if (audioRef.current) {
        //         audioRef.current.srcObject = stream;
        //         audioRef.current.play().catch(console.error);
        //     }
        // });
    };

    const handleClose = () => {
        dispatch(setIsShow_callDialog(false));
    };

    const handleOpenRequestConsent = () => {
        // if (!zaloApp) return;
        // if (!zaloOa) return;
        // requestConsent({
        //     phone: '84869628195',
        //     call_type: CallTypeEnum.AUDIO,
        //     reason_code: 101,
        //     zaloApp: zaloApp,
        //     zaloOa: zaloOa,
        //     accountId: -1,
        // })
        //     .then((res) => {
        //         console.log(res);
        //     })
        //     .catch((err) => {
        //         console.error(err);
        //     });
    };

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

        // outbound({
        //     phone: '84789860854',
        //     call_type: CallTypeEnum.AUDIO,
        //     reason_code: 101,
        //     zaloApp: zaloApp,
        //     zaloOa: zaloOa,
        //     accountId: -1,
        // })
        //     .then((res) => {
        //         console.log(res);
        //     })
        //     .catch((err) => {
        //         console.error(err);
        //     });
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.header}>Cuộc gọi</div>
                    {/* <div className={style.content}>
                        <div>Bạn chưa có quyền gọi tới người dùng này</div>
                        <div onClick={() => handleOpenRequestConsent()}>Gửi yêu cầu cấp quyền gọi</div>
                    </div> */}
                    <Infor isRinging={isRinging} callInState={callInState} setIsRequestConsent={setIsRequestConsent} />
                    <RequestConsent
                        isConnecting={isConnecting}
                        isRinging={isRinging}
                        isShow={isRequestConsent}
                        setIsShow={setIsRequestConsent}
                    />
                    <Call
                        mySip={mySip}
                        callInState={callInState}
                        setCallInState={setCallInState}
                        callOutState={callOutState}
                        setCallOutState={setCallOutState}
                    />
                    <audio ref={audioRef} autoPlay playsInline />
                    <button className={style.button} onClick={() => handleInComing()}>
                        In Coming
                    </button>
                    {/* <div>
                        <input
                            value={agentCode}
                            onChange={(e) => setAgentCode(e.target.value)}
                            placeholder="agentcode"
                        />
                    </div> */}
                    {/* <button onClick={() => handleRequestConsent()}>Xin cấp quyền gọi</button>
                    <button onClick={() => handleGetAgent()}>Lấy agent</button>
                    <button onClick={() => handleOutbound()}>Tạo link cuộc gọi</button>
                    <button onClick={() => handleCallUid()}>CallUid</button> */}
                </div>
            </div>
        </div>
    );
};

export default memo(CallDialog);
