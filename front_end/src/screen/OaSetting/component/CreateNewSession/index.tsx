import { memo, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { CREATE_NEW_SESSION } from '@src/const/text';
import { use_create_Chat_Session_Mutation } from '@src/redux/query/chat_session_RTK';
import { Chat_Session_Body_Field } from '@src/data_struct/chat_session/body';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set__is_loading, set__data__toast_message, set__chat_sessions } from '@src/redux/slice/Oa_Setting';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Crud_Enum } from '../../type';

const CreateNewSession = () => {
    const dispatch = useDispatch<AppDispatch>();

    const zalo_oa: Zalo_Oa_Field | undefined = useSelector((state: RootState) => state.Oa_Setting_Slice.zalo_oa);

    const [label, set__label] = useState<string>('');
    const [code, set__code] = useState<string>('');

    const [create_Chat_Session] = use_create_Chat_Session_Mutation();

    const handle_Label = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__label(value);
    };

    const handle_Code = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__code(value);
    };

    const handle_Create = () => {
        const label1 = label.trim();
        const code1 = code.trim();
        if (label1.length === 0) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Nhãn không được để trống !',
                })
            );
            return;
        }
        if (code1.length === 0) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Mã không được để trống !',
                })
            );
            return;
        }

        const chat_session_body: Chat_Session_Body_Field = {
            label: label1,
            code: code1,
            is_ready: false,
            selected_account_id: '',
            zalo_oa_id: zalo_oa?.id || '',
            account_id: '',
        };

        dispatch(set__is_loading(true));
        create_Chat_Session(chat_session_body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__chat_sessions({ chat_sessions: [res_data.data], crud_type: Crud_Enum.CREATE }));
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.SUCCESS,
                            message: res_data.message,
                        })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: res_data?.message,
                        })
                    );
                }
            })
            .catch((err) => console.error(err))
            .finally(() => dispatch(set__is_loading(false)));
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>{CREATE_NEW_SESSION}</div>
                <div className={style.contentContainer}>
                    <div className={style.warn}>
                        Nếu không tạo phiên, chúng tôi sẽ phát hội thoại cho các phiên bất kỳ hoặc người dùng sẽ không
                        thể nhắn tin cho bạn
                    </div>
                    <div className={style.inputContainer}>
                        <input value={label} onChange={(e) => handle_Label(e)} placeholder="Nhãn" />
                        <input value={code} onChange={(e) => handle_Code(e)} placeholder="Mã" />
                    </div>
                    <div className={style.btnContainer}>
                        <button className={style.btn} onClick={() => handle_Create()}>
                            Tạo phiên mới
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(CreateNewSession);
