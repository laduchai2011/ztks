import { memo, FC, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { route_enum } from '@src/router/type';
import {
    PHONE_NUMBER,
    CONTENT,
    TITLE,
    PAY,
    CHAT,
    FREEDOM,
    DEFAULT,
    NOT_PAY,
    PAID,
    NOT_SEND,
    SENT,
    RETURN,
} from '@src/const/text';
import { CiEdit } from 'react-icons/ci';
import { MdDelete } from 'react-icons/md';
import { IoAddCircle } from 'react-icons/io5';
import {
    set__edit_order_dialog,
    set__is_show__pay_dialog,
    set__add_order_status_dialog,
    set__data__toast_message,
    set__is_loading,
    set__order__pay_dialog,
    set__is_show__voucher_dialog,
    set__order__voucher_dialog,
} from '@src/redux/slice/Order';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { Order_Field, Order_Status_Field } from '@src/data_struct/order';
import { Voucher_Field } from '@src/data_struct/voucher';
import { formatMoney } from '@src/utility/string';
import { timeAgoSmart } from '@src/utility/time';
import { Order_Status_Type_Enum, Order_Status_Type_Type, Default_Contents_Enum } from '@src/screen/Order/type';
import { useLazy_get_All_Order_Status_Query } from '@src/redux/query/order_RTK';
import { useLazy_get_Voucher_With_Order_Id_Query } from '@src/redux/query/voucher_RTK';

const OneOrder: FC<{ index: number; data: Order_Field }> = ({ index, data }) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const new_order_edit: Order_Field | undefined = useSelector(
        (state: RootState) => state.Order_Slice.edit_order_dialog.new_order
    );
    const new_order_status: Order_Status_Field | undefined = useSelector(
        (state: RootState) => state.Order_Slice.add_order_status_dialog.new_order_status
    );
    const new_order_paid: Order_Field | undefined = useSelector(
        (state: RootState) => state.Order_Slice.pay_dialog.new_order
    );

    const payText_element = useRef<HTMLDivElement | null>(null);

    const [order, set__order] = useState<Order_Field>(data);
    const [pay_text, set__pay_text] = useState<string>('Chưa thanh toán');
    const [order_status, set__order_status] = useState<Order_Status_Field[]>([]);
    const [selected_voucher, set__selected_voucher] = useState<Voucher_Field | undefined>(undefined);
    const [final_money, set__final_money] = useState<number>(0);

    const [get_All_Order_Status] = useLazy_get_All_Order_Status_Query();
    const [get_Voucher_With_Order_Id] = useLazy_get_Voucher_With_Order_Id_Query();

    useEffect(() => {
        if (!payText_element.current) return;
        const payTextElement = payText_element.current;
        if (order.is_pay) {
            set__pay_text('Đã thanh toán');
            payTextElement.classList.add(style.paid);
        } else {
            set__pay_text('Chưa thanh toán');
            payTextElement.classList.remove(style.paid);
        }
    }, [order]);

    useEffect(() => {
        if (!new_order_edit) return;
        set__order((prev) => {
            if (new_order_edit.id === prev.id) {
                return new_order_edit;
            } else {
                return prev;
            }
        });
    }, [new_order_edit]);

    useEffect(() => {
        if (!new_order_paid) return;
        set__order((prev) => {
            if (new_order_paid.id === prev.id) {
                return new_order_paid;
            } else {
                return prev;
            }
        });
    }, [new_order_paid]);

    useEffect(() => {
        if (!new_order_status) return;
        if (new_order_status.order_id === order.id) {
            set__order_status((prev) => [new_order_status, ...prev]);
        }
    }, [new_order_status, order.id]);

    useEffect(() => {
        if (!order) return;
        if (selected_voucher) {
            const final_money: number =
                order.money - selected_voucher.money >= 0 ? order.money - selected_voucher.money : 0;
            set__final_money(final_money);
        } else {
            set__final_money(order.money);
        }
    }, [selected_voucher, order]);

    useEffect(() => {
        dispatch(set__is_loading(true));
        get_All_Order_Status({ order_id: order.id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__order_status(res_data.data);
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
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    }, [dispatch, get_All_Order_Status, order.id]);

    useEffect(() => {
        get_Voucher_With_Order_Id({ order_id: order.id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__selected_voucher(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [order, get_Voucher_With_Order_Id]);

    const handle_Open_Edit = () => {
        dispatch(set__edit_order_dialog({ is_show: true, order: order }));
    };

    const handle_Delete = () => {
        dispatch(
            set__data__toast_message({
                type: messageType_enum.NORMAL,
                message: 'Tính năng chưa hoạt động !',
            })
        );
    };

    const handle_Go_To_Chat = () => {
        navigate(route_enum.MESSAGE1 + '/' + `${order.chat_room_id}`);
    };

    const handle_Open_Pay = () => {
        dispatch(set__is_show__pay_dialog(true));
        dispatch(set__order__pay_dialog(order));
    };

    const handle_Open_Voucher_List = () => {
        dispatch(set__is_show__voucher_dialog(true));
        dispatch(set__order__voucher_dialog(order));
    };

    const handle_Open_Order_Status = (option: Order_Status_Type_Type) => {
        dispatch(set__add_order_status_dialog({ is_show: true, order: order, default_order_status_type: option }));
    };

    const list_order_status = order_status.map((item, index) => {
        if (item.type === Order_Status_Type_Enum.FREEDOM) {
            return (
                <div key={index}>
                    <div>{item.content}</div>
                    <div></div>
                </div>
            );
        }
        if (item.type === Order_Status_Type_Enum.DEFAULT) {
            let content: string = '';
            switch (item.content) {
                case Default_Contents_Enum.NOT_PAY: {
                    content = NOT_PAY;
                    break;
                }
                case Default_Contents_Enum.PAID: {
                    content = PAID;
                    break;
                }
                case Default_Contents_Enum.NOT_SEND: {
                    content = NOT_SEND;
                    break;
                }
                case Default_Contents_Enum.SENT: {
                    content = SENT;
                    break;
                }
                case Default_Contents_Enum.RETURN: {
                    content = RETURN;
                    break;
                }
                default: {
                    break;
                }
            }
            return (
                <div key={index}>
                    <div></div>
                    <div>{content}</div>
                </div>
            );
        }

        return;
    });

    return (
        <div className={style.parent}>
            <div className={style.index}>
                <div>{index}</div>
                <div>{order.uuid}</div>
                <div>
                    <CiEdit onClick={() => handle_Open_Edit()} size={22} color="green" />
                    <MdDelete onClick={() => handle_Delete()} size={22} color="red" />
                </div>
            </div>
            <div className={style.label}>
                <div>{TITLE}</div>
                <div>{order.label}</div>
            </div>
            <div className={style.content}>
                <div>{CONTENT}</div>
                <div dangerouslySetInnerHTML={{ __html: order.content }} />
            </div>
            <div className={style.phone}>
                <div>{PHONE_NUMBER}</div>
                <div>{order.phone}</div>
            </div>
            <div className={style.chat}>
                <div onClick={() => handle_Go_To_Chat()}>{CHAT}</div>
                <div>{order.chat_room_id}</div>
            </div>
            <div className={style.isPay}>
                <div>{PAY}</div>
                <div>{formatMoney(final_money)}</div>
                <div ref={payText_element}>{pay_text}</div>
                <div>{!order.is_pay && <button onClick={() => handle_Open_Pay()}>{PAY}</button>}</div>
            </div>
            <div className={style.voucher}>
                <div className={style.text}>
                    {!selected_voucher && <div className={style.not}>Chưa áp dụng voucher</div>}
                    {selected_voucher && <div className={style.ed}>Đã áp dụng voucher</div>}
                </div>
                <div className={style.isUsed}>{selected_voucher && <div>Voucher</div>}</div>
                <div className={style.list}>
                    <div onClick={() => handle_Open_Voucher_List()}>Danh sách</div>
                </div>
            </div>
            <div className={style.status}>
                <div>
                    <div>
                        <div>{FREEDOM}</div>
                        <IoAddCircle
                            onClick={() => handle_Open_Order_Status(Order_Status_Type_Enum.FREEDOM)}
                            size={20}
                            color="greenyellow"
                        />
                    </div>
                    <div>
                        <div>{DEFAULT}</div>
                        <IoAddCircle
                            onClick={() => handle_Open_Order_Status(Order_Status_Type_Enum.DEFAULT)}
                            size={20}
                            color="greenyellow"
                        />
                    </div>
                </div>
                {list_order_status}
            </div>
            <div className={style.time}>{timeAgoSmart(data.create_time)}</div>
        </div>
    );
};

export default memo(OneOrder);
