import { memo, useState } from 'react';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { ADD } from '@src/const/text';
import { useLazy_get_Account_With_Id_Query, use_add_Member_V1_Mutation } from '@src/redux/query/account_RTK';
import { set__is_loading, set__data__toast_message, set__data__new_member } from '@src/redux/slice/Member';
import { messageType_enum } from '@src/component/ToastMessage/type';

const AddMember = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [account_id, set__account_id] = useState<string>('');

    const [add_Member_V1] = use_add_Member_V1_Mutation();
    const [get_Account_With_Id] = useLazy_get_Account_With_Id_Query();

    const handle_Account_Id = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__account_id(value);
    };

    const handle_Get_Account_With_Id = (id: string) => {
        dispatch(set__is_loading(true));
        get_Account_With_Id({ id: id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__data__new_member(res_data.data));
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
            .finally(() => dispatch(set__is_loading(false)));
    };

    const handle_Add = () => {
        const account_id_t = account_id.trim();

        if (account_id_t.length === 0) return;
        if (isNaN(Number(account_id_t))) {
            return;
        }

        dispatch(set__is_loading(true));
        add_Member_V1({ account_id: account_id_t, added_by_id: '' })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    handle_Get_Account_With_Id(res_data.data.account_id);
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.SUCCESS,
                            message: 'Tạo thành công !',
                        })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.NORMAL,
                            message: 'Tạo thất bại !',
                        })
                    );
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
            .finally(() => dispatch(set__is_loading(false)));
    };

    return (
        <div className={style.parent}>
            <input value={account_id} onChange={(e) => handle_Account_Id(e)} placeholder="Nhập id người dùng !" />
            <div onClick={() => handle_Add()}>{ADD}</div>
        </div>
    );
};

export default memo(AddMember);
