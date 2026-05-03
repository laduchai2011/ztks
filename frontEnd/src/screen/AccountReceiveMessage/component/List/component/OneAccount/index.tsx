import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { set_isLoading, setData_toastMessage, set_accountReceiveMessage } from '@src/redux/slice/AccountReceiveMessage';
import { avatarnull } from '@src/utility/string';
import { AccountField, AccountReceiveMessageField } from '@src/dataStruct/account';
import { useUpdateAccountReceiveMessageMutation } from '@src/redux/query/accountRTK';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { messageType_enum } from '@src/component/ToastMessage/type';

const OneAccount: FC<{ index: number; data: AccountField }> = ({ index, data }) => {
    const dispatch = useDispatch<AppDispatch>();
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const selectedOa: ZaloOaField | undefined = useSelector(
        (state: RootState) => state.AccountReceiveMessageSlice.selectedOa
    );
    const accountReceiveMessage: AccountReceiveMessageField | undefined = useSelector(
        (state: RootState) => state.AccountReceiveMessageSlice.accountReceiveMessage
    );
    const [selected, setSelected] = useState<boolean>(false);

    const [updateAccountReceiveMessage] = useUpdateAccountReceiveMessageMutation();

    useEffect(() => {
        if (data.id === accountReceiveMessage?.accountIdReceiveMessage) {
            setSelected(true);
        } else {
            setSelected(false);
        }
    }, [data, accountReceiveMessage]);

    const handleSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const check = e.target.checked;
        if (!account) return;
        if (!selectedOa) return;

        dispatch(set_isLoading(true));
        updateAccountReceiveMessage({
            zaloOaId: selectedOa.id,
            accountId: account.id,
            accountIdReceiveMessage: check ? data.id : undefined,
        })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData?.data) {
                    dispatch(set_accountReceiveMessage(resData.data));
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: 'Thay đổi thanh công !',
                        })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Thay đổi thất bại !',
                        })
                    );
                }
            })
            .catch((err) => {
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
                console.error(err);
            })
            .finally(() => {
                setSelected(check);
                dispatch(set_isLoading(false));
            });
    };

    return (
        <div className={style.parent}>
            <div className={style.indexContainer}>
                <div>{index + 1}</div>
                <input type="checkbox" checked={selected} onChange={(e) => handleSelect(e)} />
            </div>
            <div className={style.inforContainer}>
                <div className={style.avatarContainer}>
                    <img src={data.avatar ?? avatarnull} alt="avatar" />
                </div>
                <div className={style.nameContainer}>{`${data.firstName} ${data.lastName}`}</div>
            </div>
        </div>
    );
};

export default memo(OneAccount);
