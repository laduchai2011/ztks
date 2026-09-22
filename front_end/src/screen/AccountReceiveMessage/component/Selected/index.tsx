import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { avatarnull } from '@src/utility/string';
import { Account_Field, Account_Receive_Message_Field } from '@src/data_struct/account';
import { use_get_Account_With_Id_Query } from '@src/redux/query/account_RTK';
import { handleSrcImage } from '@src/utility/string';

const Selected = () => {
    const account_receive_message: Account_Receive_Message_Field | undefined = useSelector(
        (state: RootState) => state.Account_Receive_Message_Slice.account_receive_message
    );
    const [accountWId, set__accountWId] = useState<Account_Field | undefined>(undefined);

    const avatarUrl = accountWId?.avatar ? handleSrcImage(accountWId.avatar) : avatarnull;

    const {
        data: data__account_wid,
        // isFetching,
        isLoading: is_loading__account_wid,
        isError: is_error__account_wid,
        error: error__account_wid,
    } = use_get_Account_With_Id_Query(
        { id: account_receive_message?.account_id_receive_message || '' },
        { skip: account_receive_message === undefined }
    );
    useEffect(() => {
        if (is_error__account_wid && error__account_wid) {
            console.error(error__account_wid);
        }
    }, [is_error__account_wid, error__account_wid]);
    useEffect(() => {
        // dispatch(set_isLoading(isLoading_account));
    }, [is_loading__account_wid]);
    useEffect(() => {
        const res_data = data__account_wid;
        if (res_data?.is_success && res_data.data) {
            set__accountWId(res_data.data);
        }
    }, [data__account_wid]);

    return (
        <div className={style.parent}>
            {account_receive_message?.account_id_receive_message ? (
                <div className={style.main}>
                    <div className={style.avatarContainer}>
                        <img src={avatarUrl} alt="avatar" />
                    </div>
                    <div className={style.nameContainer}>{`${accountWId?.first_name} ${accountWId?.last_name}`}</div>
                </div>
            ) : (
                <div>Chưa có tài khoản nào được chọn</div>
            )}
        </div>
    );
};

export default memo(Selected);
