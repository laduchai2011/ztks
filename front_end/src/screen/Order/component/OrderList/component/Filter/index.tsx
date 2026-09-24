import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { PAY, MONEY, FROM, TO, SEARCH } from '@src/const/text';
import { Select_Filter_Enum, Select_Filter_Type } from './type';
import { Orders_Filter_Body_Field } from '@src/data_struct/order/body';
import { formatMoney } from '@src/utility/string';
import { BsPinFill } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';
import { isPositiveInteger } from '@src/utility/string';
import { set__data__toast_message } from '@src/redux/slice/Order';
import { messageType_enum } from '@src/component/ToastMessage/type';

const Filter: FC<{ handle_Get_Orders: (orders_filter_body: Orders_Filter_Body_Field) => void }> = ({
    handle_Get_Orders,
}) => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();

    const [is_pay, set__is_pay] = useState<boolean>(true);
    const [is_not_pay, set__is_not_pay] = useState<boolean>(true);
    const [is_delete, set__is_delete] = useState<boolean>(true);
    const [is_not_delete, set__is_not_delete] = useState<boolean>(true);
    const [money_from, set__money_from] = useState<string>('');
    const [is_formatting_money_from, set__is_formatting_money_from] = useState(false);
    const [money_to, set__money_to] = useState<string>('');
    const [is_formatting_money_to, set__is_formatting_money_to] = useState(false);
    const [selected_value, set__selected_value] = useState<string>('');
    const [selected_option, set__selected_option] = useState<Select_Filter_Type>(Select_Filter_Enum.Chat_Room_Id);
    const chat_room_id = location.state?.chat_room_id;
    const [chat_room_id1, set__chat_room_id1] = useState<string>('');
    const [phone_number, set__phone_number] = useState<string>('');
    const [order_uuid, set__order_uuid] = useState<string>('');

    useEffect(() => {
        if (chat_room_id) {
            set__selected_option(Select_Filter_Enum.Chat_Room_Id);
            set__selected_value(chat_room_id);
            set__chat_room_id1(chat_room_id);
        }
    }, [chat_room_id]);

    useEffect(() => {
        switch (selected_option) {
            case Select_Filter_Enum.Chat_Room_Id: {
                set__chat_room_id1(selected_value.trim());
                break;
            }
            case Select_Filter_Enum.Order_Uuid: {
                set__order_uuid(selected_value.trim());
                break;
            }
            case Select_Filter_Enum.Phone_Number: {
                set__phone_number(selected_value.trim());
                break;
            }
            default: {
                //statements;
                break;
            }
        }
    }, [selected_option, selected_value]);

    const handle_Selected = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as Select_Filter_Type;
        set__selected_option(value);
    };

    const handle_Selected_Value = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__selected_value(value);
    };

    const handle_Close_Chat_Room_Id1 = () => {
        set__chat_room_id1('');
    };

    const handle_Close_Phone_Number = () => {
        set__phone_number('');
    };

    const handle_Close_Order_Uuid = () => {
        set__order_uuid('');
    };

    const handle_Is_Pay = () => {
        set__is_pay(!is_pay);
    };

    const handle_Is_Not_Pay = () => {
        set__is_not_pay(!is_not_pay);
    };

    const handle_Is_Delete = () => {
        set__is_delete(!is_delete);
    };

    const handle_Is_Not_Delete = () => {
        set__is_not_delete(!is_not_delete);
    };

    const handle_Money_From = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const raw = value.replace(/\D/g, '');
        set__money_from(raw);
    };

    const handle_Money_From_To = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const raw = value.replace(/\D/g, '');
        set__money_to(raw);
    };

    const handle_Pin = () => {
        const input_value = selected_value.trim();

        switch (selected_option) {
            case Select_Filter_Enum.Chat_Room_Id: {
                set__chat_room_id1(input_value);
                break;
            }
            case Select_Filter_Enum.Order_Uuid: {
                set__order_uuid(input_value);
                break;
            }
            case Select_Filter_Enum.Phone_Number: {
                set__phone_number(input_value);
                break;
            }
            default: {
                //statements;
                break;
            }
        }
    };

    const handle_Search = () => {
        if (chat_room_id1.trim().length === 0) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Vui lòng thêm Id phòng hội thoại !',
                })
            );
            return;
        }

        if (!isPositiveInteger(chat_room_id1)) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Id phòng chat phải là 1 số nguyên dương !',
                })
            );
            return;
        }

        if (selected_value.length === 0) return;

        const filter_body: Orders_Filter_Body_Field = {
            page: 1,
            size: 5,
            chat_room_id: chat_room_id1,
            account_id: '',
        };

        const new_filter_body = { ...filter_body };

        if (is_pay && is_not_pay) {
            new_filter_body.is_pay = undefined;
        } else if (is_pay) {
            new_filter_body.is_pay = true;
        } else if (is_not_pay) {
            new_filter_body.is_pay = false;
        }

        if (money_from.length > 0) {
            new_filter_body.money_from = Number(money_from);
        }

        if (money_to.length > 0) {
            new_filter_body.money_to = Number(money_to);
        }

        if (phone_number.trim().length > 0) {
            new_filter_body.phone = phone_number.trim();
        }

        if (order_uuid.trim().length > 0) {
            new_filter_body.uuid = order_uuid.trim();
        }

        if (is_delete && is_not_delete) {
            new_filter_body.is_delete = undefined;
        } else if (is_delete) {
            new_filter_body.is_delete = true;
        } else if (is_not_delete) {
            new_filter_body.is_delete = false;
        }

        handle_Get_Orders(new_filter_body);
    };

    return (
        <div className={style.parent}>
            <div className={style.searchInput}>
                <select onChange={(e) => handle_Selected(e)} value={selected_option}>
                    <option value={Select_Filter_Enum.Chat_Room_Id}>Mã phòng chat</option>
                    <option value={Select_Filter_Enum.Order_Uuid}>Mã đơn hàng</option>
                    <option value={Select_Filter_Enum.Phone_Number}>Số điện thoại</option>
                </select>
                <input value={selected_value} onChange={(e) => handle_Selected_Value(e)} placeholder="Mã" />
                <BsPinFill onClick={() => handle_Pin()} />
            </div>
            <div className={style.selectedValue}>
                {chat_room_id1.trim().length > 0 && (
                    <div>
                        <div>{`Phòng chat (${chat_room_id1})`}</div>
                        <IoIosClose onClick={() => handle_Close_Chat_Room_Id1()} />
                    </div>
                )}
                {phone_number.trim().length > 0 && (
                    <div>
                        <div>{`Sđt (${phone_number})`}</div>
                        <IoIosClose onClick={() => handle_Close_Phone_Number()} />
                    </div>
                )}
                {order_uuid.trim().length > 0 && (
                    <div>
                        <div>{`Đơn hàng (${order_uuid})`}</div>
                        <IoIosClose onClick={() => handle_Close_Order_Uuid()} />
                    </div>
                )}
            </div>
            <div className={style.checks}>
                <div>
                    <input type="checkbox" checked={is_pay} onChange={() => handle_Is_Pay()} />
                    <div>{PAY}</div>
                </div>
                <div>
                    <input type="checkbox" checked={is_not_pay} onChange={() => handle_Is_Not_Pay()} />
                    <div>{PAY}</div>
                </div>
                <div>
                    <input type="checkbox" checked={is_delete} onChange={() => handle_Is_Delete()} />
                    <div>Đã xóa</div>
                </div>
                <div>
                    <input type="checkbox" checked={is_not_delete} onChange={() => handle_Is_Not_Delete()} />
                    <div>Chưa xóa</div>
                </div>
            </div>
            <div className={style.money}>
                <div>{MONEY}</div>
                <div className={style.txt}>{FROM}</div>
                <input
                    value={is_formatting_money_from && money_from ? formatMoney(money_from) : money_from}
                    onChange={handle_Money_From}
                    onFocus={() => set__is_formatting_money_from(false)}
                    onBlur={() => set__is_formatting_money_from(true)}
                    placeholder="VND"
                />
                <div className={style.txt}>{TO}</div>
                <input
                    value={is_formatting_money_to && money_to ? formatMoney(money_to) : money_to}
                    onChange={handle_Money_From_To}
                    onFocus={() => set__is_formatting_money_to(false)}
                    onBlur={() => set__is_formatting_money_to(true)}
                    placeholder="VND"
                />
            </div>
            <div className={style.searchContainer}>
                <div onClick={() => handle_Search()}>{SEARCH}</div>
            </div>
        </div>
    );
};

export default memo(Filter);
