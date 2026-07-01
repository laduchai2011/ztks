import { FC, memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { TiTick } from 'react-icons/ti';
import { IoClose } from 'react-icons/io5';
import { CallTypeEnum, CallTypeType } from '@src/dataStruct/call';

const Infor: FC<{ isRinging: boolean; setIsRequestConsent: React.Dispatch<React.SetStateAction<boolean>> }> = ({
    isRinging,
    setIsRequestConsent,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const [selectedCallType, setSelectedCallType] = useState<CallTypeType>(CallTypeEnum.AUDIO);

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
            {isRinging && <div className={style.time}>{`Hạn đến ngày`}</div>}
            {isRinging && (
                <div className={style.requestContent}>
                    <div onClick={() => handleOpenRequestConsent()}>Gửi yêu cầu cấp quyền gọi</div>
                </div>
            )}
        </div>
    );
};

export default memo(Infor);
