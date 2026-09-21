import { memo, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { LEAVE } from '@src/const/text';
import { setData_toastMessage, set_isLoading } from '@src/redux/slice/Leave';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { useLeaveAllChatSessionMutation } from '@src/redux/query/chatSessionRTK';
import { AccountField } from '@src/dataStruct/account';

const LeaveAllChatSession = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);

    const [isLeave, setIsLeave] = useState<boolean>(false);

    const [leaveAllChatSession] = useLeaveAllChatSessionMutation();

    const handleLeave = () => {
        if (!account) return;

        dispatch(set_isLoading(true));
        leaveAllChatSession({ accountId: account.id })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setIsLeave(resData.data);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    };

    return (
        <div className={style.parent}>
            <div className={style.header}>Bạn cần rời khỏi các phiên hội thoại</div>
            <div className={style.buttonContainer}>
                {!isLeave && (
                    <div className={style.btn} onClick={() => handleLeave()}>
                        {LEAVE}
                    </div>
                )}
                {isLeave && <div className={style.txt}>Đã rời</div>}
            </div>
        </div>
    );
};

export default memo(LeaveAllChatSession);
