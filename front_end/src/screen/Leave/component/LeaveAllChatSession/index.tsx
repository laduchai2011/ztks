import { memo, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { LEAVE } from '@src/const/text';
import { set__data__toast_message, set__is_loading } from '@src/redux/slice/Leave';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { use_leave_All_Chat_Session_Mutation } from '@src/redux/query/chat_session_RTK';
import { Account_Field } from '@src/data_struct/account';

const LeaveAllChatSession = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);

    const [is_leave, set__is_leave] = useState<boolean>(false);

    const [leave_All_Chat_Session] = use_leave_All_Chat_Session_Mutation();

    const handle_Leave = () => {
        if (!account) return;

        dispatch(set__is_loading(true));
        leave_All_Chat_Session({ account_id: account.id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__is_leave(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    };

    return (
        <div className={style.parent}>
            <div className={style.header}>Bạn cần rời khỏi các phiên hội thoại</div>
            <div className={style.buttonContainer}>
                {!is_leave && (
                    <div className={style.btn} onClick={() => handle_Leave()}>
                        {LEAVE}
                    </div>
                )}
                {is_leave && <div className={style.txt}>Đã rời</div>}
            </div>
        </div>
    );
};

export default memo(LeaveAllChatSession);
