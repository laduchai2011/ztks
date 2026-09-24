import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT, CHOOSE } from '@src/const/text';
import {
    set__data__toast_message,
    set__is_loading,
    set__is_show__take_money_dialog,
    set__new_require_take_money__take_money_dialog,
    set__required_take_money__take_money_dialog,
} from '@src/redux/slice/Wallet';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { useLazy_get_All_Banks_Query, useLazy_get_Bank_With_Id_Query } from '@src/redux/query/bank_RTK';
import {
    use_create_Require_Take_Money_Mutation,
    use_edit_Require_Take_Money_Mutation,
} from '@src/redux/query/wallet_RTK';
import { Bank_Field } from '@src/data_struct/bank';
import { Require_Take_Money_Field, Wallet_Field, Wallet_Enum } from '@src/data_struct/wallet';
import { isPositiveInteger, formatMoney } from '@src/utility/string';

const TakeMoneyDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const is_show: boolean = useSelector((state: RootState) => state.Wallet_Slice.take_money_dialog.is_show);
    const wallet: Wallet_Field | undefined = useSelector(
        (state: RootState) => state.Wallet_Slice.take_money_dialog.wallet
    );
    const require_take_money: Require_Take_Money_Field | undefined = useSelector(
        (state: RootState) => state.Wallet_Slice.take_money_dialog.required_take_money
    );

    const [title, set__title] = useState<string>('Tạo yêu cầu rút tiền mới');
    const [amount, set__amount] = useState<string>('');
    const [is_formatting_money, set__is_formatting_money] = useState(false);
    const [amount_text, set__amount_text] = useState<string>('');
    const [all_banks, set__all_banks] = useState<Bank_Field[]>([]);
    const [selected_bank, set__selected_bank] = useState<Bank_Field | undefined>(undefined);

    const [get_All_Banks] = useLazy_get_All_Banks_Query();
    const [get_Bank_With_Id] = useLazy_get_Bank_With_Id_Query();
    const [create_Require_Take_Money] = use_create_Require_Take_Money_Mutation();
    const [edit_Require_Take_Money] = use_edit_Require_Take_Money_Mutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show) {
            parentElement.classList.add(style.display);
            const timeout2 = setTimeout(() => {
                parentElement.classList.add(style.opacity);
                clearTimeout(timeout2);
            }, 50);
        } else {
            parentElement.classList.remove(style.opacity);

            const timeout2 = setTimeout(() => {
                parentElement.classList.remove(style.display);
                clearTimeout(timeout2);
            }, 550);
        }
    }, [is_show]);

    useEffect(() => {
        if (!wallet) return;
        if (require_take_money) {
            set__title(`Chỉnh sửa yêu cầu rút tiền trên ví ${wallet.type}`);
            set__amount(require_take_money.amount.toString());
        } else {
            set__title(`Tạo yêu cầu rút tiền mới trên ví ${wallet.type}`);
            set__amount('');
        }
    }, [require_take_money, wallet]);

    useEffect(() => {
        dispatch(set__is_loading(true));
        get_All_Banks({ account_id: '' })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__all_banks(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    }, [get_All_Banks, dispatch]);

    useEffect(() => {
        if (!require_take_money) return;

        dispatch(set__is_loading(true));
        get_Bank_With_Id({ id: require_take_money.bank_id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__selected_bank(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    }, [get_Bank_With_Id, dispatch, require_take_money]);

    const handle_Amount_Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const raw = value.replace(/\D/g, '');
        set__amount(raw);
        set__amount_text('');
    };

    const handle_Select_Bank = (item: Bank_Field) => {
        set__selected_bank(item);
    };

    const handle_Close = () => {
        dispatch(set__is_show__take_money_dialog(false));
    };

    const handle_Agree = () => {
        if (!wallet) return;

        if (wallet.type === Wallet_Enum.ONE) {
            dispatch(
                set__data__toast_message({
                    message: `Không thể rút tiền từ ví ${wallet.type}`,
                    type: messageType_enum.WARN,
                })
            );
            return;
        }

        if (!isPositiveInteger(amount)) {
            set__amount_text('Tiền phải là số nguyên dương');
            return;
        }

        if (Number(amount.trim()) < 5000) {
            set__amount_text(`Tiền bạn yêu cầu không thể nhỏ hơn ${formatMoney(5000)}`);
            return;
        }

        if (Number(amount.trim()) > wallet.amount) {
            set__amount_text('Tiền bạn yêu cầu lớn hơn trong ví của bạn');
            return;
        }

        if (!selected_bank) {
            dispatch(
                set__data__toast_message({
                    message: 'Chưa ngân hàng nào được chọn',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }

        let txt: string = '';
        if (require_take_money) {
            txt = 'Chỉnh sửa';
            dispatch(set__is_loading(true));
            edit_Require_Take_Money({
                require_take_money_id: require_take_money.id,
                amount: Number(amount.trim()),
                bank_id: selected_bank.id,
                wallet_id: wallet.id,
                account_id: '',
            })
                .then((res) => {
                    const res_data = res.data;
                    if (res_data?.is_success && res_data.data) {
                        dispatch(set__new_require_take_money__take_money_dialog(res_data.data));
                        dispatch(
                            set__data__toast_message({
                                message: `${txt} thành công`,
                                type: messageType_enum.SUCCESS,
                            })
                        );
                    } else {
                        dispatch(
                            set__data__toast_message({
                                message: `${txt} không thành công`,
                                type: messageType_enum.ERROR,
                            })
                        );
                    }
                })
                .catch((err) => {
                    dispatch(
                        set__data__toast_message({
                            message: 'Đã có lỗi xảy ra',
                            type: messageType_enum.ERROR,
                        })
                    );
                    console.error(err);
                })
                .finally(() => {
                    dispatch(set__is_loading(false));
                });
        } else {
            txt = 'Tạo';
            dispatch(set__is_loading(true));
            create_Require_Take_Money({
                amount: Number(amount.trim()),
                bank_id: selected_bank.id,
                wallet_id: wallet.id,
                account_id: '',
            })
                .then((res) => {
                    const res_data = res.data;
                    if (res_data?.is_success && res_data.data) {
                        dispatch(set__new_require_take_money__take_money_dialog(res_data.data));
                        dispatch(set__required_take_money__take_money_dialog(res_data.data));
                        dispatch(
                            set__data__toast_message({
                                message: `${txt} thành công`,
                                type: messageType_enum.SUCCESS,
                            })
                        );
                    } else {
                        dispatch(
                            set__data__toast_message({
                                message: `${txt} không thành công`,
                                type: messageType_enum.ERROR,
                            })
                        );
                    }
                })
                .catch((err) => {
                    dispatch(
                        set__data__toast_message({
                            message: 'Đã có lỗi xảy ra',
                            type: messageType_enum.ERROR,
                        })
                    );
                    console.error(err);
                })
                .finally(() => {
                    dispatch(set__is_loading(false));
                });
        }
    };

    const list_bank = all_banks.map((item, index) => {
        return (
            <div className={style.oneBank} key={index} onClick={() => handle_Select_Bank(item)}>
                <div>
                    <div>{item.bank_code}</div>
                    <div>{item.account_number}</div>
                    <div>{item.account_name}</div>
                </div>
                <div>
                    <div>{CHOOSE}</div>
                </div>
            </div>
        );
    });

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.title}>{title}</div>
                    <div className={style.inputContainer}>
                        <div className={style.inputBox}>
                            <input
                                value={is_formatting_money && amount ? formatMoney(amount) : amount}
                                onChange={(e) => handle_Amount_Change(e)}
                                onFocus={() => set__is_formatting_money(false)}
                                onBlur={() => set__is_formatting_money(true)}
                                placeholder="Nhập số tiền cần rút"
                            />
                        </div>
                        {amount_text && <div className={style.amountText}>{amount_text}</div>}
                    </div>
                    {selected_bank && (
                        <div className={style.selectedBank}>
                            <div>{selected_bank.bank_code}</div>
                            <div>{selected_bank.account_number}</div>
                            <div>{selected_bank.account_name}</div>
                        </div>
                    )}
                    <div className={style.bankList}>{list_bank}</div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handle_Agree()}>{AGREE}</button>
                    <button onClick={() => handle_Close()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(TakeMoneyDialog);
