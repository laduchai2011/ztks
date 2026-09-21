import { memo, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { LEAVE } from '@src/const/text';
import { setData_toastMessage, set_isLoading } from '@src/redux/slice/Leave';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { useLeaveAdminMutation } from '@src/redux/query/accountRTK';
import { AccountField } from '@src/dataStruct/account';

const LeaveAdmin = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);

    const [isLeave, setIsLeave] = useState<boolean>(false);

    const [leaveAdmin] = useLeaveAdminMutation();

    const handleLeave = () => {
        if (!account) return;

        dispatch(set_isLoading(true));
        leaveAdmin({ accountId: account.id })
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
            <div className={style.header}>Bạn có thể rời khỏi quản lý này nếu thực hiện rời bỏ trên</div>
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

export default memo(LeaveAdmin);
