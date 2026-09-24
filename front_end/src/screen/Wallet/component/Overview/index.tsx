import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { formatMoney } from '@src/utility/string';
import { Wallet_Field, Require_Take_Money_Field } from '@src/data_struct/wallet';
import { Account_Field } from '@src/data_struct/account';
import { useLazy_member_Get_Require_Take_Money_Of_Wallet_Query } from '@src/redux/query/wallet_RTK';
import {
    set__is_loading,
    set__data__toast_message,
    set__is_show__take_money_dialog,
    set__required_take_money__take_money_dialog,
    set__wallet__take_money_dialog,
    set__new_require_take_money__take_money_dialog,
} from '@src/redux/slice/Wallet';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { use_delete_Require_Take_Money_Mutation } from '@src/redux/query/wallet_RTK';
import { DELETE } from '@src/const/text';

const Overview: FC<{ wallet: Wallet_Field }> = ({ wallet }) => {
    const dispatch = useDispatch<AppDispatch>();

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const new_require_take_money: Require_Take_Money_Field | undefined = useSelector(
        (state: RootState) => state.Wallet_Slice.take_money_dialog.new_require_take_money
    );

    const [text_btn, set__text_btn] = useState<string>('Rút tiền');
    const [require_take_money, set__require_take_money] = useState<Require_Take_Money_Field | undefined>(undefined);

    const [get_Require_Take_Money] = useLazy_member_Get_Require_Take_Money_Of_Wallet_Query();
    const [delete_Require_Take_Money] = use_delete_Require_Take_Money_Mutation();

    useEffect(() => {
        if (!account) return;
        get_Require_Take_Money({ wallet_id: wallet.id, account_id: account.id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__require_take_money(res_data.data);
                } else {
                    set__require_take_money(undefined);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [get_Require_Take_Money, account, wallet]);

    useEffect(() => {
        if (require_take_money) {
            set__text_btn('Chỉnh sửa ');
        } else {
            set__text_btn('Tạo');
        }
    }, [require_take_money]);

    useEffect(() => {
        if (!new_require_take_money) return;
        set__require_take_money(new_require_take_money);
        dispatch(set__new_require_take_money__take_money_dialog(undefined));
    }, [dispatch, new_require_take_money]);

    const handle_Open_Require_Take_Money = () => {
        dispatch(set__is_show__take_money_dialog(true));
        dispatch(set__wallet__take_money_dialog(wallet));
        dispatch(set__required_take_money__take_money_dialog(require_take_money));
    };

    const handle_Del_Req_Take_Money = () => {
        if (!require_take_money) return;
        dispatch(set__is_loading(true));
        delete_Require_Take_Money({
            require_take_money_id: require_take_money.id,
            account_id: '',
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__require_take_money(undefined);
                    dispatch(
                        set__data__toast_message({
                            message: 'Xóa thành công',
                            type: messageType_enum.SUCCESS,
                        })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            message: 'Xóa không thành công',
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
    };

    return (
        <div className={style.parent}>
            <div className={style.money}>{formatMoney(wallet.amount)}</div>
            <div className={style.transfer}>
                <div className={style.title}>
                    <span className={style.text}>Yêu cầu rút tiền</span>
                    {require_take_money && (
                        <span className={style.btn} onClick={() => handle_Del_Req_Take_Money()}>
                            {DELETE}
                        </span>
                    )}
                </div>
                <div className={style.content}>
                    <div className={style.txt}>
                        {require_take_money && <div>Tiền muốn rút: {formatMoney(require_take_money.amount)}</div>}
                    </div>
                    <div className={style.btn} onClick={() => handle_Open_Require_Take_Money()}>
                        {text_btn}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Overview);
