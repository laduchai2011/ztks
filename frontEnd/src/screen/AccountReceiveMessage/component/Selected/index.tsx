import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { avatarnull } from '@src/utility/string';
import { AccountField, AccountReceiveMessageField } from '@src/dataStruct/account';
import { useGetAccountWithIdQuery } from '@src/redux/query/accountRTK';

const Selected = () => {
    const accountReceiveMessage: AccountReceiveMessageField | undefined = useSelector(
        (state: RootState) => state.AccountReceiveMessageSlice.accountReceiveMessage
    );
    const [accountWId, setAccountWId] = useState<AccountField | undefined>(undefined);

    const {
        data: data_account_wid,
        // isFetching,
        isLoading: isLoading_account_wid,
        isError: isError_account_wid,
        error: error_account_wid,
    } = useGetAccountWithIdQuery(
        { id: accountReceiveMessage?.accountIdReceiveMessage || -1 },
        { skip: accountReceiveMessage === undefined }
    );
    useEffect(() => {
        if (isError_account_wid && error_account_wid) {
            console.error(error_account_wid);
        }
    }, [isError_account_wid, error_account_wid]);
    useEffect(() => {
        // dispatch(set_isLoading(isLoading_account));
    }, [isLoading_account_wid]);
    useEffect(() => {
        const resData = data_account_wid;
        if (resData?.isSuccess && resData.data) {
            setAccountWId(resData.data);
        }
    }, [data_account_wid]);

    return (
        <div className={style.parent}>
            {accountReceiveMessage?.accountIdReceiveMessage ? (
                <div className={style.main}>
                    <div className={style.avatarContainer}>
                        <img src={accountWId?.avatar || avatarnull} alt="avatar" />
                    </div>
                    <div className={style.nameContainer}>{`${accountWId?.firstName} ${accountWId?.lastName}`}</div>
                </div>
            ) : (
                <div>Chưa có tài khoản nào được chọn</div>
            )}
        </div>
    );
};

export default memo(Selected);
