import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { MdCall, MdWifiCalling3 } from 'react-icons/md';
import { CallInStateEnum, CallInStateType, CallOutStateEnum, CallOutStateType } from '@src/dataStruct/call';
import { set_calling, set_callingIsIn, set_callingIsCallIn } from '@src/redux/slice/App';
import { avatarnull } from '@src/utility/string';
// import { ZaloOaField } from '@src/dataStruct/zalo';
import { ZaloUserField } from '@src/dataStruct/zalo/user';

const Call = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const uid: string | undefined = useSelector((state: RootState) => state.MessageV1Slice.uid);
    const callInState: CallInStateType = useSelector((state: RootState) => state.AppSlice.call.inState);
    const callOutState: CallOutStateType = useSelector((state: RootState) => state.AppSlice.call.outState);
    // const zaloOa: ZaloOaField | undefined = useSelector((state: RootState) => state.AppSlice.calling.zaloOa);
    const zaloUser: ZaloUserField | undefined = useSelector((state: RootState) => state.AppSlice.calling.zaloUser);
    const callingIsIn: boolean | undefined = useSelector((state: RootState) => state.AppSlice.calling.isIn);
    const [text, setText] = useState<string>('');
    const [time, setTime] = useState(0);

    useEffect(() => {
        let intervalTime: any;
        if (callInState === CallInStateEnum.CALL_IN) {
            setText('');
            intervalTime = setInterval(() => {
                setTime((pre) => pre + 1);
            }, 1000);
        }

        if (callInState === CallInStateEnum.CALL_END) {
            clearInterval(intervalTime);
        }
    }, [callInState]);

    const handleAccept = () => {
        if (callingIsIn) {
            dispatch(set_callingIsCallIn(true));
            setText('Đợi chút');
            return;
        }
    };

    const handleOpenCall = () => {
        if (!uid) return;
        dispatch(set_calling({ is: true, uid: uid }));
    };

    const handleOfCall = () => {
        dispatch(set_calling({ is: true, uid: undefined }));
        dispatch(set_callingIsIn(false));
    };

    const handleOfCallIn = () => {
        dispatch(set_callingIsCallIn(false));
        dispatch(set_callingIsIn(false));
    };

    return (
        <div className={style.parent} ref={parent_element}>
            {callOutState === CallOutStateEnum.CONNECTING && <div className={style.connecting}>Đang kết nối ...</div>}
            {callOutState === CallOutStateEnum.RINGING && <div className={style.ring}>Đổ chuông</div>}
            {callInState !== CallInStateEnum.CALL_END && (
                <div className={style.avatarContainer}>
                    <img src={zaloUser?.data.avatar || avatarnull} alt="Avatar" />
                </div>
            )}
            {callInState !== CallInStateEnum.CALL_END && (
                <div className={style.userName}>{zaloUser?.data.display_name}</div>
            )}
            {callInState === CallInStateEnum.RINGING && <div className={style.callIn}>Đang gọi đến</div>}
            {text.length > 0 && <div className={style.text}>{text}</div>}
            {callInState === CallInStateEnum.CALL_IN && <div className={style.text}>{time}</div>}
            {callInState === CallInStateEnum.CALL_END && (
                <div className={style.icon1}>
                    {callOutState === CallOutStateEnum.CALL_END && (
                        <MdCall onClick={() => handleOpenCall()} size={40} color="greenyellow" />
                    )}
                    {(callOutState === CallOutStateEnum.RINGING || callOutState === CallOutStateEnum.CALL_IN) && (
                        <MdCall onClick={() => handleOfCall()} size={40} color="red" />
                    )}
                </div>
            )}
            {callInState === CallInStateEnum.RINGING && (
                <div className={style.icon2}>
                    <div>
                        <MdCall onClick={() => handleAccept()} size={40} color="greenyellow" />
                        <MdCall onClick={() => handleOfCall()} size={40} color="red" />
                    </div>
                </div>
            )}
            {callInState === CallInStateEnum.CALL_IN && (
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
