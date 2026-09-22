import { memo, useState } from 'react';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { ADD_BANK } from '@src/const/text';
import { use_add_Bank_Mutation } from '@src/redux/query/bank_RTK';
import { set__data__toast_message, set__is_loading, set__new_bank__add_bank } from '@src/redux/slice/Bank';
import { messageType_enum } from '@src/component/ToastMessage/type';

const AddBank = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [is_show_parent, set__is_show_parent] = useState(false);
    const [is_display_btn, set__is_display_btn] = useState(true);
    const [is_show_btn, set__is_show_btn] = useState(true);
    const [is_display_icon, set__is_display_icon] = useState(false);
    const [is_show_icon, set__is_show_icon] = useState(false);

    const [bank_code, set__bank_code] = useState<string>('');
    const [account_number, set__account_number] = useState<string>('');
    const [account_name, set__account_name] = useState<string>('');

    const [add_Bank] = use_add_Bank_Mutation();

    const handle_H_Btn = () => {
        set__is_show_parent(true);
        set__is_show_btn(false);
        setTimeout(() => {
            set__is_display_btn(false);
        }, 300);
        set__is_display_icon(true);
        setTimeout(() => {
            set__is_show_icon(true);
        }, 10);
    };

    const handle_H_Icon = () => {
        set__is_show_parent(false);
        set__is_show_icon(false);
        setTimeout(() => {
            set__is_display_icon(false);
        }, 300);
        set__is_display_btn(true);
        setTimeout(() => {
            set__is_show_btn(true);
        }, 10);
    };

    const handle_Bank_Code = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__bank_code(e.target.value);
    };

    const handle_Account_Number = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__account_number(e.target.value);
    };

    const handle_Account_Name = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__account_name(e.target.value);
    };

    const handle_Create = () => {
        const bank_code_trim = bank_code.trim();
        const account_number_trim = account_number.trim();
        const account_name_trim = account_name.trim();

        if (bank_code_trim === '' || account_number_trim === '' || account_name_trim === '') {
            dispatch(
                set__data__toast_message({ type: messageType_enum.ERROR, message: 'Không được để trống trường nào !' })
            );
            return;
        }

        dispatch(set__is_loading(true));
        add_Bank({
            bank_code: bank_code_trim,
            account_number: account_number_trim,
            account_name: account_name_trim,
            account_id: '',
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(
                        set__data__toast_message({ type: messageType_enum.SUCCESS, message: 'Thêm thành công !' })
                    );
                    dispatch(set__new_bank__add_bank(res_data.data));
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(set__data__toast_message({ type: messageType_enum.ERROR, message: 'Đã có lỗi xảy ra !' }));
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    };

    return (
        <div className={`${style.parent} ${is_show_parent ? style.show : ''}`}>
            <div className={style.header}>
                <div
                    className={`${style.btn} ${is_display_btn ? style.display : ''} ${is_show_btn ? style.show : ''}`}
                    onClick={() => handle_H_Btn()}
                >
                    {ADD_BANK}
                </div>
                <IoCloseOutline
                    className={`${style.icon} ${is_display_icon ? style.display : ''} ${is_show_icon ? style.show : ''}`}
                    onClick={() => handle_H_Icon()}
                    size={25}
                />
            </div>
            <div className={style.content}>
                <div>
                    <input value={bank_code} onChange={(e) => handle_Bank_Code(e)} placeholder="Mã ngân hàng" />
                </div>
                <div>
                    <input
                        value={account_number}
                        onChange={(e) => handle_Account_Number(e)}
                        placeholder="Số tài khoản"
                    />
                </div>
                <div>
                    <input value={account_name} onChange={(e) => handle_Account_Name(e)} placeholder="Tên tài khoản" />
                </div>
                <div>
                    <div onClick={() => handle_Create()}>{ADD_BANK}</div>
                </div>
            </div>
        </div>
    );
};

export default memo(AddBank);
