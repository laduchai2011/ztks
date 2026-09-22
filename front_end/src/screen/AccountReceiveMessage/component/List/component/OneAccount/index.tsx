import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import {
    set__is_loading,
    set__data__toast_message,
    set__account_receive_message,
} from '@src/redux/slice/Account_Receive_Message';
import { avatarnull } from '@src/utility/string';
import { Account_Field, Account_Receive_Message_Field } from '@src/data_struct/account';
import { use_update_Account_Receive_Message_Mutation } from '@src/redux/query/account_RTK';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { handleSrcImage } from '@src/utility/string';

const OneAccount: FC<{ index: number; data: Account_Field }> = ({ index, data }) => {
    const dispatch = useDispatch<AppDispatch>();
    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const selected_oa: Zalo_Oa_Field | undefined = useSelector(
        (state: RootState) => state.Account_Receive_Message_Slice.selected_oa
    );
    const account_receive_message: Account_Receive_Message_Field | undefined = useSelector(
        (state: RootState) => state.Account_Receive_Message_Slice.account_receive_message
    );
    const [selected, set__selected] = useState<boolean>(false);

    const [update_Account_Receive_Message] = use_update_Account_Receive_Message_Mutation();

    const avatarUrl = data.avatar ? handleSrcImage(data.avatar) : avatarnull;

    useEffect(() => {
        if (data.id === account_receive_message?.account_id_receive_message) {
            set__selected(true);
        } else {
            set__selected(false);
        }
    }, [data, account_receive_message]);

    const handle_Select = (e: React.ChangeEvent<HTMLInputElement>) => {
        const check = e.target.checked;
        if (!account) return;
        if (!selected_oa) return;

        dispatch(set__is_loading(true));
        update_Account_Receive_Message({
            zalo_oa_id: selected_oa.id,
            account_id: account.id,
            account_id_receive_message: check ? data.id : undefined,
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data?.data) {
                    dispatch(set__account_receive_message(res_data.data));
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.SUCCESS,
                            message: 'Thay đổi thành công !',
                        })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Thay đổi thất bại !',
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
                set__selected(check);
                dispatch(set__is_loading(false));
            });
    };

    return (
        <div className={style.parent}>
            <div className={style.indexContainer}>
                <div>{index + 1}</div>
                <input type="checkbox" checked={selected} onChange={(e) => handle_Select(e)} />
            </div>
            <div className={style.inforContainer}>
                <div className={style.avatarContainer}>
                    <img src={avatarUrl} alt="avatar" />
                </div>
                <div className={style.nameContainer}>{`${data.first_name} ${data.last_name}`}</div>
            </div>
        </div>
    );
};

export default memo(OneAccount);
