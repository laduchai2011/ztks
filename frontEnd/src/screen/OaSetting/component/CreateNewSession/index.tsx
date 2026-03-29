import { memo, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { CREATE_NEW_SESSION } from '@src/const/text';
import { useCreateChatSessionMutation } from '@src/redux/query/chatSessionRTK';
import { ChatSessionBodyField } from '@src/dataStruct/chatSession/body';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set_isLoading, setData_toastMessage, set_chatSessions } from '@src/redux/slice/OaSetting';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { Crud_Enum } from '../../type';

const CreateNewSession = () => {
    const dispatch = useDispatch<AppDispatch>();

    const zaloOa: ZaloOaField | undefined = useSelector((state: RootState) => state.OaSettingSlice.zaloOa);

    const [label, setLabel] = useState<string>('');
    const [code, setCode] = useState<string>('');

    const [createChatSession] = useCreateChatSessionMutation();

    const handleLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLabel(value);
    };

    const handleCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCode(value);
    };

    const handleCreate = () => {
        const label1 = label.trim();
        const code1 = code.trim();
        if (label1.length === 0) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Nhãn không được để trống !',
                })
            );
            return;
        }
        if (code1.length === 0) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Mã không được để trống !',
                })
            );
            return;
        }

        const chatSessionBody: ChatSessionBodyField = {
            label: label1,
            code: code1,
            isReady: false,
            selectedAccountId: -1,
            zaloOaId: zaloOa?.id || -1,
            accountId: -1,
        };

        dispatch(set_isLoading(true));
        createChatSession(chatSessionBody)
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    dispatch(set_chatSessions({ chatSessions: [resData.data], crud_type: Crud_Enum.CREATE }));
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: resData.message,
                        })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: resData?.message,
                        })
                    );
                }
            })
            .catch((err) => console.error(err))
            .finally(() => dispatch(set_isLoading(false)));
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
                        <input value={label} onChange={(e) => handleLabel(e)} placeholder="Nhãn" />
                        <input value={code} onChange={(e) => handleCode(e)} placeholder="Mã" />
                    </div>
                    <div className={style.btnContainer}>
                        <button className={style.btn} onClick={() => handleCreate()}>
                            Tạo phiên mới
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(CreateNewSession);
