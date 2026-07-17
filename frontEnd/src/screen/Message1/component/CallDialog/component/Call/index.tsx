import { FC, memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { MdCall, MdWifiCalling3 } from 'react-icons/md';
// import { CallTypeEnum, CallTypeType } from '@src/dataStruct/call';
import { MySip } from '../../../../call';
import { SessionState } from 'sip.js';
import { CallInStateEnum, CallInStateType, CallOutStateEnum, CallOutStateType } from '@src/dataStruct/call';

const Call: FC<{
    mySip: MySip | null;
    callInState: CallInStateType;
    setCallInState: React.Dispatch<React.SetStateAction<CallInStateType>>;
    callOutState: CallOutStateType;
    setCallOutState: React.Dispatch<React.SetStateAction<CallOutStateType>>;
}> = ({ mySip, callInState, setCallInState, callOutState, setCallOutState }) => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const uid: string = useSelector((state: RootState) => state.MessageV1Slice.uid);

    const handleOpenCall = () => {
        if (mySip) {
            mySip.callUid(`99${uid}`, false, (state) => {
                switch (state) {
                    case SessionState.Initial:
                        setCallOutState(CallOutStateEnum.CONNECTING);
                        break;

                    case SessionState.Establishing:
                        setCallOutState(CallOutStateEnum.RINGING);
                        break;

                    case SessionState.Established:
                        setCallOutState(CallOutStateEnum.CALL_IN);
                        break;

                    case SessionState.Terminating:
                        setCallOutState(CallOutStateEnum.CALL_END);
                        break;

                    case SessionState.Terminated:
                        setCallOutState(CallOutStateEnum.CALL_END);
                        break;
                }
            });
        }
    };

    const handleOfCall = () => {
        if (mySip) {
            setCallOutState(CallOutStateEnum.CALL_END);
            mySip.destroyCallOut();
            mySip.destroyCallIn();
        }
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
                        <MdCall size={40} color="red" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(Call);
