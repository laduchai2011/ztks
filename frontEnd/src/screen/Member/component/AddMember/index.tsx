import { memo, useState } from 'react';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { ADD } from '@src/const/text';
import { useLazyGetAccountWithIdQuery, useAddMemberV1Mutation } from '@src/redux/query/accountRTK';
import { set_isLoading, setData_toastMessage, setData_newMember } from '@src/redux/slice/Member';
import { messageType_enum } from '@src/component/ToastMessage/type';

const AddMember = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [accountId, setAccountId] = useState<string>('');

    const [addMemberV1] = useAddMemberV1Mutation();
    const [getAccountWithId] = useLazyGetAccountWithIdQuery();

    const handleAccountId = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setAccountId(value);
    };

    const handleAdd = () => {
        const accountId_t = accountId.trim();

        if (accountId_t.length === 0) return;
        if (isNaN(Number(accountId_t))) {
            return;
        }

        dispatch(set_isLoading(true));
        addMemberV1({ accountId: Number(accountId_t), addedById: -1 })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    handleGetAccountWithId(resData.data.accountId);
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: 'Tạo thành công !',
                        })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.NORMAL,
                            message: 'Tạo thất bại !',
                        })
                    );
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
            .finally(() => dispatch(set_isLoading(false)));
    };

    const handleGetAccountWithId = (id: number) => {
        dispatch(set_isLoading(true));
        getAccountWithId({ id: id })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    dispatch(setData_newMember(resData.data));
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
            .finally(() => dispatch(set_isLoading(false)));
    };

    return (
        <div className={style.parent}>
            <input value={accountId} onChange={(e) => handleAccountId(e)} placeholder="Nhập id người dùng !" />
            <div onClick={() => handleAdd()}>{ADD}</div>
        </div>
    );
};

export default memo(AddMember);
