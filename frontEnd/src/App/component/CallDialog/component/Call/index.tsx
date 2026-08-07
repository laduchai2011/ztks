import { memo, useRef } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { MdCall, MdWifiCalling3 } from 'react-icons/md';
import { CallInStateEnum, CallInStateType, CallOutStateEnum, CallOutStateType } from '@src/dataStruct/call';
import { set_calling } from '@src/redux/slice/App';

const Call = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const uid: string | undefined = useSelector((state: RootState) => state.MessageV1Slice.uid);
    const callInState: CallInStateType = useSelector((state: RootState) => state.AppSlice.call.inState);
    const callOutState: CallOutStateType = useSelector((state: RootState) => state.AppSlice.call.outState);

    const handleOpenCall = () => {
        if (!uid) return;
        dispatch(set_calling({ is: true, uid: uid }));
    };

    const handleOfCall = () => {
        dispatch(set_calling({ is: true, uid: undefined, chatRoomId: undefined }));
    };

    return (
        <div className={style.parent} ref={parent_element}>
            {callOutState === CallOutStateEnum.CONNECTING && <div className={style.connecting}>Đang kết nối ...</div>}
            {callOutState === CallOutStateEnum.RINGING && <div className={style.ring}>Đổ chuông</div>}
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
                        <MdCall size={40} color="greenyellow" />
                        <MdCall onClick={() => handleOfCall()} size={40} color="red" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(Call);
