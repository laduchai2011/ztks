import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { MdCall } from 'react-icons/md';
import {
    Call_In_State_Enum,
    Call_In_State_Type,
    Call_Out_State_Enum,
    Call_Out_State_Type,
    Call_In_Cmd_Enum,
    Call_Out_Cmd_Enum,
} from '@src/data_struct/call';
import { set__call_in_cmd_type__call_dialog, set__call_out_cmd_type__call_dialog } from '@src/redux/slice/App';
import { avatarnull } from '@src/utility/string';
// import { ZaloOaField } from '@src/dataStruct/zalo';
import { Zalo_User_Field } from '@src/data_struct/zalo/user';
import { formatDuration } from '@src/utility/string';

const Call = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const [text, set__text] = useState<string>('');
    const [time, set__time] = useState(0);

    const zalo_user__call_dialog: Zalo_User_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.call_dialog.zalo_user
    );
    const call_in_state__call_dialog: Call_In_State_Type = useSelector(
        (state: RootState) => state.App_Slice.call_dialog.call_in_state
    );
    const call_out_state__call_dialog: Call_Out_State_Type = useSelector(
        (state: RootState) => state.App_Slice.call_dialog.call_out_state
    );

    useEffect(() => {
        let intervalTime: any;
        if (call_in_state__call_dialog === Call_In_State_Enum.CALL_IN) {
            set__text('');
            intervalTime = setInterval(() => {
                set__time((pre) => pre + 1000);
            }, 1000);
        }

        if (call_in_state__call_dialog === Call_In_State_Enum.CALL_END) {
            clearInterval(intervalTime);
        }
    }, [call_in_state__call_dialog]);

    useEffect(() => {
        let intervalTime: any;
        if (call_out_state__call_dialog === Call_Out_State_Enum.CALL_IN) {
            intervalTime = setInterval(() => {
                set__time((pre) => pre + 1000);
            }, 1000);
        }

        if (call_out_state__call_dialog === Call_Out_State_Enum.CALL_END) {
            clearInterval(intervalTime);
        }
    }, [call_out_state__call_dialog]);

    const handle_Accept = () => {
        if (call_in_state__call_dialog === Call_In_State_Enum.RINGING) {
            dispatch(set__call_in_cmd_type__call_dialog(Call_In_Cmd_Enum.ACCEPT));
            set__text('Đợi chút');
            return;
        }
    };

    const handle_On_Call_Out = () => {
        dispatch(set__call_out_cmd_type__call_dialog(Call_Out_Cmd_Enum.BEGIN));
    };

    const handle_Of_Call_Out = () => {
        switch (call_out_state__call_dialog) {
            case Call_Out_State_Enum.CONNECTING: {
                dispatch(set__call_out_cmd_type__call_dialog(Call_Out_Cmd_Enum.CANCEl));
                break;
            }
            case Call_Out_State_Enum.RINGING: {
                dispatch(set__call_out_cmd_type__call_dialog(Call_Out_Cmd_Enum.CANCEl));
                break;
            }
            case Call_Out_State_Enum.CALL_END: {
                //statements;
                break;
            }
            case Call_Out_State_Enum.CALL_IN: {
                dispatch(set__call_out_cmd_type__call_dialog(Call_Out_Cmd_Enum.FINISH));
                break;
            }
            default: {
                //statements;
                break;
            }
        }
    };

    const handle_Of_Call_In = () => {
        switch (call_in_state__call_dialog) {
            case Call_In_State_Enum.RINGING: {
                dispatch(set__call_in_cmd_type__call_dialog(Call_In_Cmd_Enum.CANCEl));
                break;
            }
            case Call_In_State_Enum.CALL_IN: {
                dispatch(set__call_in_cmd_type__call_dialog(Call_In_Cmd_Enum.FINISH));
                break;
            }
            case Call_In_State_Enum.CALL_END: {
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
            {call_out_state__call_dialog === Call_Out_State_Enum.CONNECTING && (
                <div className={style.connecting}>Đang kết nối ...</div>
            )}
            {call_out_state__call_dialog === Call_Out_State_Enum.RINGING && <div className={style.ring}>Đổ chuông</div>}
            {call_in_state__call_dialog !== Call_In_State_Enum.CALL_END && (
                <div className={style.avatarContainer}>
                    <img src={zalo_user__call_dialog?.data.avatar || avatarnull} alt="Avatar" />
                </div>
            )}
            {call_in_state__call_dialog !== Call_In_State_Enum.CALL_END && (
                <div className={style.userName}>{zalo_user__call_dialog?.data.display_name}</div>
            )}
            {call_in_state__call_dialog === Call_In_State_Enum.RINGING && (
                <div className={style.callIn}>Đang gọi đến</div>
            )}
            {text.length > 0 && <div className={style.text}>{text}</div>}
            {(call_in_state__call_dialog === Call_In_State_Enum.CALL_IN ||
                call_out_state__call_dialog === Call_Out_State_Enum.CALL_IN) && (
                <div className={style.text}>{formatDuration(time)}</div>
            )}
            {call_in_state__call_dialog === Call_In_State_Enum.CALL_END && (
                <div className={style.icon1}>
                    {call_out_state__call_dialog === Call_Out_State_Enum.CALL_END && (
                        <MdCall onClick={() => handle_On_Call_Out()} size={40} color="greenyellow" />
                    )}
                    {(call_out_state__call_dialog === Call_Out_State_Enum.RINGING ||
                        call_out_state__call_dialog === Call_Out_State_Enum.CALL_IN) && (
                        <MdCall onClick={() => handle_Of_Call_Out()} size={40} color="red" />
                    )}
                </div>
            )}
            {call_in_state__call_dialog === Call_In_State_Enum.RINGING && (
                <div className={style.icon2}>
                    <div>
                        <MdCall onClick={() => handle_Accept()} size={40} color="greenyellow" />
                        <MdCall onClick={() => handle_Of_Call_In()} size={40} color="red" />
                    </div>
                </div>
            )}
            {call_in_state__call_dialog === Call_In_State_Enum.CALL_IN && (
                <div className={style.icon2}>
                    <div>
                        <MdCall onClick={() => handle_Of_Call_In()} size={40} color="red" />
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(Call);
