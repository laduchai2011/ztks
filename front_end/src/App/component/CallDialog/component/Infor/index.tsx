import { FC, memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { TiTick } from 'react-icons/ti';
import { IoClose } from 'react-icons/io5';
import {
    CallTypeEnum,
    CallTypeType,
    CallInStateType,
    CallOutStateType,
    CallInStateEnum,
    CallOutStateEnum,
} from '@src/dataStruct/call';
import { useLazyCheckConsentQuery } from '@src/redux/query/callRTK';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';

const Infor: FC<{
    setIsRequestConsent: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ setIsRequestConsent }) => {
    // const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);
    const zaloOa: ZaloOaField | undefined = useSelector((state: RootState) => state.MessageV1Slice.zaloOa);

    const callInState_callDialog: CallInStateType = useSelector(
        (state: RootState) => state.AppSlice.callDialog.callInState
    );
    const callOutState_callDialog: CallOutStateType = useSelector(
        (state: RootState) => state.AppSlice.callDialog.callOutState
    );

    const [selectedCallType, setSelectedCallType] = useState<CallTypeType>(CallTypeEnum.AUDIO);
    const [expriedTime, setExpriedTime] = useState<string>('');
    const [isRinging, setIsRinging] = useState<boolean>(false);

    const [checkConsent] = useLazyCheckConsentQuery();

    useEffect(() => {
        if (!zaloApp) return;
        if (!zaloOa) return;

        checkConsent({
            phone: '84789860854',
            zaloApp: zaloApp,
            zaloOa: zaloOa,
            accountId: -11,
        })
            .then((res) => {
                const resData = res.data;
                // console.log('checkConsent resData', resData);
                if (resData?.isSuccess && resData.data) {
                    const expired_time = resData.data.data.expired_time;
                    const expired_date = new Date(expired_time);
                    setExpriedTime(expired_date.toLocaleString('vi-VN'));
                }
            })
            .catch((err) => console.error('checkConsent err', err));
    }, [checkConsent, zaloApp, zaloOa]);

    useEffect(() => {
        if (
            callInState_callDialog === CallInStateEnum.RINGING ||
            callOutState_callDialog === CallOutStateEnum.RINGING
        ) {
            setIsRinging(true);
        } else {
            setIsRinging(false);
        }
    }, [callInState_callDialog, callOutState_callDialog]);

    const handleOpenRequestConsent = () => {
        setIsRequestConsent(true);
    };

    const handleClassNameSelectedCallType = (callType: CallTypeType) => {
        // if (selectedCallType === callType) {
        //     return style.selected;
        // }
        if (CallTypeEnum.AUDIO === callType) {
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
                        <TiTick size={20} color="greenyellow" />
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
            {!isRinging && <div className={style.time}>{`Hạn đến ${expriedTime}`}</div>}
            {!isRinging && (
                <div className={style.requestContent}>
                    <div onClick={() => handleOpenRequestConsent()}>Gửi yêu cầu cấp quyền gọi</div>
                </div>
            )}
        </div>
    );
};

export default memo(Infor);
