import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT, PHONE_NUMBER, CONTENT, TITLE, MONEY } from '@src/const/text';
import {
    set__data__toast_message,
    set__is_loading,
    set__edit_order_dialog,
    set__final__edit_order_dialog,
} from '@src/redux/slice/Order';
import { messageType_enum } from '@src/component/ToastMessage/type';
import TextEditor from '@src/component/TextEditor';
import { Account_Field } from '@src/data_struct/account';
import { Order_Field } from '@src/data_struct/order';
import { Update_Order_Body_Field } from '@src/data_struct/order/body';
import { isValidPhoneNumber } from '@src/utility/string';
import { formatMoney } from '@src/utility/string';
import { use_update_Order_Mutation } from '@src/redux/query/order_RTK';

const EditOrder = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const is_show: boolean = useSelector((state: RootState) => state.Order_Slice.edit_order_dialog.is_show);
    const order: Order_Field | undefined = useSelector((state: RootState) => state.Order_Slice.edit_order_dialog.order);

    const [new_order, set__new_order] = useState<Order_Field | undefined>(order);
    const [content, set__content] = useState<string>('');
    const [money, set__money] = useState<string>('');
    const [is_formatting_money, set__is_formatting_money] = useState(false);

    const [update_Order] = use_update_Order_Mutation();

    useEffect(() => {
        if (!order) return;
        set__new_order(order);
        set__money(order.money.toString());
    }, [order]);

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

    const handle_Close = () => {
        dispatch(set__edit_order_dialog({ is_show: false, order: undefined }));
    };

    const handle_Agree = () => {
        if (!account) return;
        if (!new_order) return;

        const label_t = new_order.label.trim();
        if (label_t.length === 0) {
            dispatch(
                set__data__toast_message({ type: messageType_enum.ERROR, message: 'Tiêu đề không được để trống !' })
            );
            return;
        }

        const phone_t = new_order.phone.trim();
        if (phone_t.length > 0 && !isValidPhoneNumber(phone_t)) {
            dispatch(
                set__data__toast_message({ type: messageType_enum.ERROR, message: 'Số điện thoại không hợp lệ !' })
            );
            return;
        }

        const order_body: Update_Order_Body_Field = {
            id: new_order.id,
            label: label_t,
            content: content,
            money: Number(money),
            phone: phone_t,
            account_id: account.id,
        };

        dispatch(set__is_loading(true));
        update_Order(order_body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__final__edit_order_dialog({ is_show: false, new_order: res_data.data }));
                    dispatch(
                        set__data__toast_message({ type: messageType_enum.SUCCESS, message: 'Cập nhật thành công !' })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Cập nhật không thành công !',
                        })
                    );
                }
            })
            .catch((err) => {
                dispatch(
                    set__data__toast_message({ type: messageType_enum.ERROR, message: 'Cập nhật không thành công !' })
                );
                console.error(err);
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    };

    const handle_Label = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!new_order) return;
        set__new_order({ ...new_order, label: e.target.value });
    };

    const handle_Content = (value: string) => {
        set__content(value);
    };

    const handle_Phone = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!new_order) return;
        set__new_order({ ...new_order, phone: e.target.value });
    };

    const handle_Money = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const raw = value.replace(/\D/g, '');
        set__money(raw);
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.uuidContainer}>{new_order?.uuid}</div>
                <div className={style.contentContainer}>
                    <div className={style.label}>
                        <div>{TITLE}</div>
                        <div>
                            <input value={new_order?.label || ''} onChange={(e) => handle_Label(e)} />
                        </div>
                    </div>
                    <div className={style.content}>
                        <div>{CONTENT}</div>
                        <div>
                            <TextEditor value={new_order?.content} onChange={(value) => handle_Content(value)} />
                        </div>
                    </div>
                    <div className={style.phone}>
                        <div>{PHONE_NUMBER}</div>
                        <div>
                            <input value={new_order?.phone || ''} onChange={(e) => handle_Phone(e)} />
                        </div>
                    </div>
                    <div className={style.money}>
                        <div>{MONEY}</div>
                        <div>
                            <input
                                value={is_formatting_money && money ? formatMoney(money) : money}
                                onChange={handle_Money}
                                onFocus={() => set__is_formatting_money(false)}
                                onBlur={() => set__is_formatting_money(true)}
                                placeholder="VND"
                            />
                        </div>
                    </div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handle_Agree()}>{AGREE}</button>
                    <button onClick={() => handle_Close()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(EditOrder);
