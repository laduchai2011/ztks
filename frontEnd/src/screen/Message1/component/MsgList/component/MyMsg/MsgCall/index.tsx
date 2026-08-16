import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { ZaloCallType, HookCallTypeEnum } from '@src/dataStruct/zalo/hookData';
import { CallV1Field } from '@src/dataStruct/message_v1';
import { MdOutlinePhoneMissed } from 'react-icons/md';
import { ImPhoneHangUp } from 'react-icons/im';
import { CallFinishStateEnum, CallFinishStateType } from './type';
import { formatDuration } from '@src/utility/string';

const MsgCall: FC<{ data?: CallV1Field<ZaloCallType> }> = ({ data }) => {
    const [callFinishState, setCallFinishState] = useState<CallFinishStateType>(CallFinishStateEnum.FAILURE);
    const [content, setContent] = useState<string>('Cuộc gọi nhỡ');

    useEffect(() => {
        if (!data) return;
        const call_duration = Number(data.call_duration);
        if (call_duration > 0) {
            setCallFinishState(CallFinishStateEnum.SUCCESS);
            setContent('Cuộc gọi');
        } else {
            setCallFinishState(CallFinishStateEnum.FAILURE);
            setContent('Cuộc gọi nhỡ');
        }
    }, [data]);

    const handleColor = (callFinishState_: CallFinishStateType) => {
        switch (callFinishState_) {
            case CallFinishStateEnum.SUCCESS: {
                return 'greenyellow';
            }
            case CallFinishStateEnum.FAILURE: {
                return 'red';
            }
            default: {
                break;
            }
        }
    };

    if (data?.call_type === HookCallTypeEnum.AUDIO) {
        return (
            <div className={style.parent}>
                {callFinishState === CallFinishStateEnum.SUCCESS && (
                    <ImPhoneHangUp color={handleColor(callFinishState)} />
                )}
                {callFinishState === CallFinishStateEnum.FAILURE && (
                    <MdOutlinePhoneMissed color={handleColor(callFinishState)} />
                )}
                <div>{content}</div>
                <div>{formatDuration(Number(data.call_duration))}</div>
            </div>
        );
    }
};

export default memo(MsgCall);
