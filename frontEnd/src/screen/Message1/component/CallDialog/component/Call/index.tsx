import { FC, memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { MdCall, MdWifiCalling3 } from 'react-icons/md';
import { CallTypeEnum, CallTypeType } from '@src/dataStruct/call';
import { MySip } from '../../../../call';

const Call: FC<{
    mySip: MySip | null;
    isConnecting: boolean;
    isRinging: boolean;
    setIsConnecting: React.Dispatch<React.SetStateAction<boolean>>;
    setIsRinging: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ mySip, isConnecting, isRinging, setIsRinging, setIsConnecting }) => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const uid: string = useSelector((state: RootState) => state.MessageV1Slice.uid);

    const handleOpenCall = () => {
        setIsConnecting(true);
        // const mySip = new MySip('101', 'taokosao201195');
        // mySip.createUserAgent();
        // mySip.createRegisterer();
        // await mySip.connectSip();
        // await mySip.callUid(`99${uid}`);
        if (mySip) {
            mySip.callUid(`99${uid}`);
        }
    };

    const handleOfCall = () => {
        setIsRinging(false);
        setIsConnecting(false);
        if (mySip) {
            mySip.destroyCallUid();
        }
    };

    return (
        <div className={style.parent} ref={parent_element}>
            {isConnecting && <div className={style.connecting}>Đang kết nối ...</div>}
            {isRinging && <div className={style.ring}>Đổ chuông</div>}
            <div className={style.icon}>
                {!isRinging && !isConnecting && (
                    <MdCall onClick={() => handleOpenCall()} size={40} color="greenyellow" />
                )}
                {(isRinging || isConnecting) && <MdCall onClick={() => handleOfCall()} size={40} color="red" />}
            </div>
        </div>
    );
};

export default memo(Call);
