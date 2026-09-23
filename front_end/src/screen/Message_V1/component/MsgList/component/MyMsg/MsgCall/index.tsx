import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { Zalo_Call_Type, Hook_Call_Type_Enum } from '@src/data_struct/zalo/hook_data';
import { Call_V1_Field } from '@src/data_struct/message_v1';
import { MdOutlinePhoneMissed } from 'react-icons/md';
import { ImPhoneHangUp } from 'react-icons/im';
import { Call_Finish_State_Enum, Call_Finish_State_Type } from './type';
import { formatDuration } from '@src/utility/string';

const MsgCall: FC<{ data?: Call_V1_Field<Zalo_Call_Type> }> = ({ data }) => {
    const [call_finish_state, set__call_finish_state] = useState<Call_Finish_State_Type>(
        Call_Finish_State_Enum.FAILURE
    );
    const [content, set__content] = useState<string>('Cuộc gọi nhỡ');

    useEffect(() => {
        if (!data) return;
        const call_duration = Number(data.call_duration);
        if (call_duration > 0) {
            set__call_finish_state(Call_Finish_State_Enum.SUCCESS);
            set__content('Cuộc gọi');
        } else {
            set__call_finish_state(Call_Finish_State_Enum.FAILURE);
            set__content('Cuộc gọi nhỡ');
        }
    }, [data]);

    const handle_Color = (_call_finish_state: Call_Finish_State_Type) => {
        switch (_call_finish_state) {
            case Call_Finish_State_Enum.SUCCESS: {
                return 'greenyellow';
            }
            case Call_Finish_State_Enum.FAILURE: {
                return 'red';
            }
            default: {
                break;
            }
        }
    };

    if (data?.call_type === Hook_Call_Type_Enum.AUDIO) {
        return (
            <div className={style.parent}>
                {call_finish_state === Call_Finish_State_Enum.SUCCESS && (
                    <ImPhoneHangUp color={handle_Color(call_finish_state)} />
                )}
                {call_finish_state === Call_Finish_State_Enum.FAILURE && (
                    <MdOutlinePhoneMissed color={handle_Color(call_finish_state)} />
                )}
                <div>{content}</div>
                <div>{formatDuration(Number(data.call_duration))}</div>
            </div>
        );
    }
};

export default memo(MsgCall);
