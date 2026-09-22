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
    useLazy_get_Mcc_Info_Query,
    useLazy_check_Consent_Query,
    use_request_Consent_Mutation,
    use_outbound_Mutation,
} from '@src/redux/query/call_RTK';
import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import {
    Call_In_State_Enum,
    Call_In_State_Type,
    Call_Out_State_Enum,
    Call_Out_State_Type,
    // CallTypeEnum,
} from '@src/data_struct/call';
import { set__data__toast_message, set__is_show__call_dialog } from '@src/redux/slice/App';
import { messageType_enum } from '@src/component/ToastMessage/type';

const CallDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const zalo_app: Zalo_App_Field | undefined = useSelector((state: RootState) => state.App_Slice.zalo_app);
    const zalo_oa: Zalo_Oa_Field | undefined = useSelector((state: RootState) => state.Message_V1_Slice.zalo_oa);

    const is_show__call_dialog: boolean | undefined = useSelector(
        (state: RootState) => state.App_Slice.call_dialog.is_show
    );
    const chat_room_id__call_dialog: string | undefined = useSelector(
        (state: RootState) => state.App_Slice.call_dialog.chat_room_id
    );
    const call_in_state__call_dialog: Call_In_State_Type = useSelector(
        (state: RootState) => state.App_Slice.call_dialog.call_in_state
    );
    const call_out_state__call_dialog: Call_Out_State_Type = useSelector(
        (state: RootState) => state.App_Slice.call_dialog.call_out_state
    );

    // const [agentCode, setAgentCode] = useState<string>('');
    // const [agentPassword, setAgentPassword] = useState<string>('taokosao201195');
    const [is_request_consent, set__is_request_consent] = useState<boolean>(false);
    // const [isConnecting, setIsConnecting] = useState<boolean>(false);
    // const [isRinging, setIsRinging] = useState<boolean>(false);
    // const [isCallIn, setIsCallIn] = useState<boolean>(false);
    // const [isCallOut, setIsCallOut] = useState<boolean>(false);
    // const [callInState, setCallInState] = useState<CallInStateType>(CallInStateEnum.CALL_END);
    // const [callOutState, setCallOutState] = useState<CallOutStateType>(CallOutStateEnum.CALL_END);

    const [check_Consent] = useLazy_check_Consent_Query();
    const [request_Consent] = use_request_Consent_Mutation();
    const [get_Mcc_Info] = useLazy_get_Mcc_Info_Query();
    const [outbound] = use_outbound_Mutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show__call_dialog) {
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
    }, [is_show__call_dialog]);

    useEffect(() => {
        if (
            call_in_state__call_dialog !== Call_In_State_Enum.CALL_END ||
            call_out_state__call_dialog !== Call_Out_State_Enum.CALL_END
        ) {
            set__is_request_consent(false);
        }
    }, [call_in_state__call_dialog, call_out_state__call_dialog]);

    const audioRef = useRef<HTMLAudioElement>(null);

    const handle_Close = () => {
        if (
            call_in_state__call_dialog !== Call_In_State_Enum.CALL_END ||
            call_out_state__call_dialog !== Call_Out_State_Enum.CALL_END
        ) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.WARN,
                    message: 'Bạn không thể đóng khi đang ở trong 1 cuộc gọi !',
                })
            );
            return;
        }
        dispatch(set__is_show__call_dialog(false));
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

    const handle_Get_Agent = () => {
        if (!zalo_app) return;
        if (!zalo_oa) return;

        get_Mcc_Info({
            zalo_app: zalo_app,
            zalo_oa: zalo_oa,
            account_id: '',
        })
            .then((res) => {
                console.log(res);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    // const handle_Out_bound = () => {
    //     if (!zalo_app) return;
    //     if (!zalo_oa) return;
    // };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.header}>Cuộc gọi</div>
                    <Infor set__is_request_consent={set__is_request_consent} />
                    <RequestConsent
                        is_show={is_request_consent}
                        set__is_show={set__is_request_consent}
                        chat_room_id={chat_room_id__call_dialog || ''}
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
