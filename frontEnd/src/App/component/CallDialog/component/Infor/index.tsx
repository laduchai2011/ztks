import { FC, memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { TiTick } from 'react-icons/ti';
import { IoClose } from 'react-icons/io5';
import { CallTypeEnum, CallTypeType, CallInStateEnum, CallInStateType } from '@src/dataStruct/call';
import { useLazyCheckConsentQuery } from '@src/redux/query/callRTK';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';

const Infor: FC<{
    isRinging: boolean;
    callInState: CallInStateType;
    setIsRequestConsent: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ isRinging, callInState, setIsRequestConsent }) => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);
    const zaloOa: ZaloOaField | undefined = useSelector((state: RootState) => state.MessageV1Slice.zaloOa);

    const [selectedCallType, setSelectedCallType] = useState<CallTypeType>(CallTypeEnum.AUDIO);

    const [checkConsent] = useLazyCheckConsentQuery();

    useEffect(() => {
        if (!zaloApp) return;
        if (!zaloOa) return;

        checkConsent({
            phone: '84789860854',
            zaloApp: zaloApp,
            zaloOa: zaloOa,
            accountId: -11,
        });
    }, [checkConsent, zaloApp, zaloOa]);

    const handleOpenRequestConsent = () => {
        setIsRequestConsent(true);
    };

    const handleClassNameSelectedCallType = (callType: CallTypeType) => {
        if (selectedCallType === callType) {
            return style.selected;
        }
    };

    const handleSelectCallType = (callType: CallTypeType) => {
        setSelectedCallType(callType);
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.consents}>
                <div>
                    <div
                        className={handleClassNameSelectedCallType(CallTypeEnum.AUDIO)}
                        onClick={() => handleSelectCallType(CallTypeEnum.AUDIO)}
                    >
                        <div>Audio</div>
                        <IoClose size={20} color="red" />
                    </div>
                    <div
                        className={handleClassNameSelectedCallType(CallTypeEnum.AUDIO_AND_VIDEO)}
                        onClick={() => handleSelectCallType(CallTypeEnum.AUDIO_AND_VIDEO)}
                    >
                        <div>Audio and video</div>
                        <IoClose size={20} color="red" />
                    </div>
                </div>
            </div>
            {!isRinging && <div className={style.time}>{`Hạn đến ngày`}</div>}
            {!isRinging && (
                <div className={style.requestContent}>
                    <div onClick={() => handleOpenRequestConsent()}>Gửi yêu cầu cấp quyền gọi</div>
                </div>
            )}
        </div>
    );
};

export default memo(Infor);
