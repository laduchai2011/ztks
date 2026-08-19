import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { MdCall } from 'react-icons/md';
import {
    CallInStateEnum,
    CallInStateType,
    CallOutStateEnum,
    CallOutStateType,
    CallInCmdEnum,
    CallOutCmdEnum,
} from '@src/dataStruct/call';
import { setCallInCmdType_callDialog, setCallOutCmdType_callDialog } from '@src/redux/slice/App';
import { avatarnull } from '@src/utility/string';
// import { ZaloOaField } from '@src/dataStruct/zalo';
import { ZaloUserField } from '@src/dataStruct/zalo/user';
import { formatDuration } from '@src/utility/string';

const Call = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const [text, setText] = useState<string>('');
    const [time, setTime] = useState(0);

    const zaloUser_callDialog: ZaloUserField | undefined = useSelector(
        (state: RootState) => state.AppSlice.callDialog.zaloUser
    );
    const callInState_callDialog: CallInStateType = useSelector(
        (state: RootState) => state.AppSlice.callDialog.callInState
    );
    const callOutState_callDialog: CallOutStateType = useSelector(
        (state: RootState) => state.AppSlice.callDialog.callOutState
    );

    useEffect(() => {
        let intervalTime: any;
        if (callInState_callDialog === CallInStateEnum.CALL_IN) {
            setText('');
            intervalTime = setInterval(() => {
                setTime((pre) => pre + 1000);
            }, 1000);
        }

        if (callInState_callDialog === CallInStateEnum.CALL_END) {
            clearInterval(intervalTime);
        }
    }, [callInState_callDialog]);

    useEffect(() => {
        let intervalTime: any;
        if (callOutState_callDialog === CallOutStateEnum.CALL_IN) {
            intervalTime = setInterval(() => {
                setTime((pre) => pre + 1000);
            }, 1000);
        }

        if (callOutState_callDialog === CallOutStateEnum.CALL_END) {
            clearInterval(intervalTime);
        }
    }, [callOutState_callDialog]);

    const handleAccept = () => {
        if (callInState_callDialog === CallInStateEnum.RINGING) {
            dispatch(setCallInCmdType_callDialog(CallInCmdEnum.ACCEPT));
            setText('Đợi chút');
            return;
        }
    };

    const handleOnCallOut = () => {
        dispatch(setCallOutCmdType_callDialog(CallOutCmdEnum.BEGIN));
    };

    const handleOfCallOut = () => {
        switch (callOutState_callDialog) {
            case CallOutStateEnum.CONNECTING: {
                dispatch(setCallOutCmdType_callDialog(CallOutCmdEnum.CANCEl));
                break;
            }
            case CallOutStateEnum.RINGING: {
                dispatch(setCallOutCmdType_callDialog(CallOutCmdEnum.CANCEl));
                break;
            }
            case CallOutStateEnum.CALL_END: {
                //statements;
                break;
            }
            case CallOutStateEnum.CALL_IN: {
                dispatch(setCallOutCmdType_callDialog(CallOutCmdEnum.FINISH));
                break;
            }
            default: {
                //statements;
                break;
            }
        }
    };

    const handleOfCallIn = () => {
        switch (callInState_callDialog) {
            case CallInStateEnum.RINGING: {
                dispatch(setCallInCmdType_callDialog(CallInCmdEnum.CANCEl));
                break;
            }
            case CallInStateEnum.CALL_IN: {
                dispatch(setCallInCmdType_callDialog(CallInCmdEnum.FINISH));
                break;
            }
            case CallInStateEnum.CALL_END: {
                break;
            }
            default: {
                //statements;
                break;
            }
        }
    };

    return (
        <div className={style.parent} ref={parent_element}>
            {callOutState_callDialog === CallOutStateEnum.CONNECTING && (
                <div className={style.connecting}>Đang kết nối ...</div>
            )}
            {callOutState_callDialog === CallOutStateEnum.RINGING && <div className={style.ring}>Đổ chuông</div>}
            {callInState_callDialog !== CallInStateEnum.CALL_END && (
                <div className={style.avatarContainer}>
                    <img src={zaloUser_callDialog?.data.avatar || avatarnull} alt="Avatar" />
                </div>
            )}
            {callInState_callDialog !== CallInStateEnum.CALL_END && (
                <div className={style.userName}>{zaloUser_callDialog?.data.display_name}</div>
            )}
            {callInState_callDialog === CallInStateEnum.RINGING && <div className={style.callIn}>Đang gọi đến</div>}
            {text.length > 0 && <div className={style.text}>{text}</div>}
            {(callInState_callDialog === CallInStateEnum.CALL_IN ||
                callOutState_callDialog === CallOutStateEnum.CALL_IN) && (
                <div className={style.text}>{formatDuration(time)}</div>
            )}
            {callInState_callDialog === CallInStateEnum.CALL_END && (
                <div className={style.icon1}>
                    {callOutState_callDialog === CallOutStateEnum.CALL_END && (
                        <MdCall onClick={() => handleOnCallOut()} size={40} color="greenyellow" />
                    )}
                    {(callOutState_callDialog === CallOutStateEnum.RINGING ||
                        callOutState_callDialog === CallOutStateEnum.CALL_IN) && (
                        <MdCall onClick={() => handleOfCallOut()} size={40} color="red" />
                    )}
                </div>
            )}
            {callInState_callDialog === CallInStateEnum.RINGING && (
                <div className={style.icon2}>
                    <div>
                        <MdCall onClick={() => handleAccept()} size={40} color="greenyellow" />
                        <MdCall onClick={() => handleOfCallIn()} size={40} color="red" />
                    </div>
                </div>
            )}
            {callInState_callDialog === CallInStateEnum.CALL_IN && (
                <div className={style.icon2}>
                    <div>
                        <MdCall onClick={() => handleOfCallIn()} size={40} color="red" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(Call);
