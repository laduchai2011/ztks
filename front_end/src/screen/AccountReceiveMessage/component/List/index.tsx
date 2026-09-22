import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import {
    set__is_loading,
    set__data__toast_message,
    set__account_receive_message,
} from '@src/redux/slice/Account_Receive_Message';
import { messageType_enum } from '@src/component/ToastMessage/type';
import OneAccount from './component/OneAccount';
import {
    use_get_Account_Receive_Message_Query,
    use_create_Account_Receive_Message_Mutation,
    use_get_All_Members_Query,
} from '@src/redux/query/account_RTK';
import { Account_Field, Account_Receive_Message_Field } from '@src/data_struct/account';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import { ACTIVATE } from '@src/const/text';

const List = () => {
    const dispatch = useDispatch<AppDispatch>();
    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const selected_oa: Zalo_Oa_Field | undefined = useSelector(
        (state: RootState) => state.Account_Receive_Message_Slice.selected_oa
    );
    const account_receive_message: Account_Receive_Message_Field | undefined = useSelector(
        (state: RootState) => state.Account_Receive_Message_Slice.account_receive_message
    );

    const [all_members, set__all_members] = useState<Account_Field[]>([]);

    const [create_Account_Receive_Message] = use_create_Account_Receive_Message_Mutation();

    const {
        data: data__all_members,
        // isFetching,
        isLoading: is_loading__all_members,
        isError: is_error__all_members,
        error: error__all_members,
    } = use_get_All_Members_Query({ added_by_id: '' });
    useEffect(() => {
        if (is_error__all_members && error__all_members) {
            console.error(error__all_members);
        }
    }, [dispatch, is_error__all_members, error__all_members]);
    useEffect(() => {
        dispatch(set__is_loading(is_loading__all_members));
    }, [dispatch, is_loading__all_members]);
    useEffect(() => {
        const res_data = data__all_members;
        if (res_data?.is_success && res_data?.data) {
            set__all_members(res_data.data);
        }
    }, [data__all_members]);

    const {
        data: data__account_receive_message,
        // isFetching,
        isLoading: is_loading__account_receive_message,
        isError: is_error__account_receive_message,
        error: error__account_receive_message,
    } = use_get_Account_Receive_Message_Query(
        { zalo_oa_id: selected_oa?.id || '', account_id: account?.id || '' },
        { skip: selected_oa === undefined || account === undefined }
    );
    useEffect(() => {
        if (is_error__account_receive_message && error__account_receive_message) {
            console.error(error__account_receive_message);
        }
    }, [dispatch, is_error__account_receive_message, error__account_receive_message]);
    useEffect(() => {
        dispatch(set__is_loading(is_loading__account_receive_message));
    }, [dispatch, is_loading__account_receive_message]);
    useEffect(() => {
        const res_data = data__account_receive_message;
        if (res_data?.is_success && res_data.data) {
            dispatch(set__account_receive_message(res_data.data));
            // setAccountReceiveMessage(resData.data);
        }
    }, [dispatch, data__account_receive_message]);

    const handleActivate = () => {
        if (!account) return;
        if (!selected_oa) return;

        dispatch(set__is_loading(true));
        create_Account_Receive_Message({ zalo_oa_id: selected_oa.id, account_id: account.id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data?.data) {
                    dispatch(set__account_receive_message(res_data.data));
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Kích hoạt thất bại !',
                        })
                    );
                }
            })
            .catch((err) => {
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
                console.error(err);
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    };

    const list_account = all_members.map((item, index) => {
        return <OneAccount key={index} index={index} data={item} />;
    });

    return (
        <div className={style.parent}>
            <div className={style.header}>{`Số lượng thành viên ${all_members.length}`}</div>
            {account_receive_message && <div className={style.list}>{list_account}</div>}
            {!account_receive_message && (
                <div className={style.activateContainer}>
                    <div onClick={() => handleActivate()}>{ACTIVATE}</div>
                </div>
            )}
        </div>
    );
};

export default memo(List);
