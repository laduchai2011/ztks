import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import {
    CLOSE,
    AGREE,
    EXIT,
    ORDER_STATUS,
    DEFAULT,
    FREEDOM,
    NOT_PAY,
    PAID,
    NOT_SEND,
    SENT,
    RETURN,
} from '@src/const/text';
import {
    set__data__toast_message,
    set__is_loading,
    set__add_order_status_dialog,
    set__final__add_order_status_dialog,
} from '@src/redux/slice/Order';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { Account_Field } from '@src/data_struct/account';
import { Order_Field } from '@src/data_struct/order';
import { Create_Order_Status_Body_Field } from '@src/data_struct/order/body';
import {
    Order_Status_Type_Type,
    Order_Status_Type_Enum,
    Default_Contents_Enum,
    Default_Contents_Type,
} from '../../type';
import { use_create_Order_Status_Mutation } from '@src/redux/query/order_RTK';

const AddOrderStatusDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const options_element = useRef<HTMLDivElement | null>(null);

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const is_show: boolean = useSelector((state: RootState) => state.Order_Slice.add_order_status_dialog.is_show);
    const order: Order_Field | undefined = useSelector(
        (state: RootState) => state.Order_Slice.add_order_status_dialog.order
    );
    const default_order_status_type: Order_Status_Type_Type | undefined = useSelector(
        (state: RootState) => state.Order_Slice.add_order_status_dialog.default_order_status_type
    );

    const [order_status_type, set__order_status_type] = useState<Order_Status_Type_Type>(
        Order_Status_Type_Enum.FREEDOM
    );
    const [selected_default_content, set__selected_default_content] = useState<Default_Contents_Type>(
        Default_Contents_Enum.NOT_PAY
    );
    const [new_freedom_content, set__new_freedom_content] = useState<string>('');
    const [create_order_status_body, set__create_order_status_body] = useState<Create_Order_Status_Body_Field>({
        type: '',
        content: '',
        order_id: '',
        account_id: '',
    });

    const [create_Order_Status] = use_create_Order_Status_Mutation();

    useEffect(() => {
        if (!account) return;
        set__create_order_status_body((prev) => ({
            ...prev,
            account_id: account.id,
        }));
    }, [account]);

    useEffect(() => {
        if (!order) return;
        set__create_order_status_body((prev) => ({
            ...prev,
            orderId: order.id,
        }));
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

    useEffect(() => {
        if (default_order_status_type) {
            set__order_status_type(default_order_status_type);
        } else {
            set__order_status_type(Order_Status_Type_Enum.FREEDOM);
        }
    }, [default_order_status_type]);

    useEffect(() => {
        if (!options_element.current) return;
        const optionsElement = options_element.current;
        const freedomElement = optionsElement.children[0];
        const defaultElement = optionsElement.children[1];

        switch (order_status_type) {
            case Order_Status_Type_Enum.FREEDOM: {
                freedomElement.classList.add(style.selected);
                defaultElement.classList.remove(style.selected);
                break;
            }
            case Order_Status_Type_Enum.DEFAULT: {
                freedomElement.classList.remove(style.selected);
                defaultElement.classList.add(style.selected);
                break;
            }
            default: {
                freedomElement.classList.add(style.selected);
                defaultElement.classList.remove(style.selected);
                break;
            }
        }

        set__create_order_status_body((prev) => ({
            ...prev,
            type: order_status_type,
        }));
    }, [order_status_type]);

    const handle_Order_Status_Type = (order_status_type: Order_Status_Type_Type) => {
        set__order_status_type(order_status_type);
    };

    const hand_Selected_Default_Content = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as Default_Contents_Type;
        set__selected_default_content(value);
    };

    const handle_New_Freedom_Content = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__new_freedom_content(value);
    };

    const handle_Close = () => {
        dispatch(set__add_order_status_dialog({ is_show: false, order: undefined }));
    };

    const handle_Agree = () => {
        const create_order_status_body_cp = { ...create_order_status_body };

        if (create_order_status_body_cp.type === Order_Status_Type_Enum.DEFAULT) {
            create_order_status_body_cp.content = selected_default_content;
        } else if (create_order_status_body_cp.type === Order_Status_Type_Enum.FREEDOM) {
            create_order_status_body_cp.content = new_freedom_content.trim();
        } else {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.NORMAL,
                    message: 'Kiểu trạng thái khôg hợp lệ !',
                })
            );
            return;
        }

        dispatch(set__is_loading(true));
        create_Order_Status(create_order_status_body_cp)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__final__add_order_status_dialog({ is_show: false, new_order_status: res_data.data }));
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Thêm trạng thái không thành công !',
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
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.label}>
                        <div>{ORDER_STATUS}</div>
                    </div>
                    <div className={style.optionContainer}>
                        <div className={style.options} ref={options_element}>
                            <div onClick={() => handle_Order_Status_Type(Order_Status_Type_Enum.FREEDOM)}>
                                {FREEDOM}
                            </div>
                            <div onClick={() => handle_Order_Status_Type(Order_Status_Type_Enum.DEFAULT)}>
                                {DEFAULT}
                            </div>
                        </div>
                    </div>
                    <div className={style.selectedContentContainer}>
                        {order_status_type === Order_Status_Type_Enum.DEFAULT && (
                            <div className={style.defaultSelection}>
                                <div>Lựa chọn trạng thái mặc định</div>
                                <div>
                                    <select
                                        value={selected_default_content}
                                        onChange={(e) => hand_Selected_Default_Content(e)}
                                    >
                                        <option value={Default_Contents_Enum.NOT_PAY}>{NOT_PAY}</option>
                                        <option value={Default_Contents_Enum.PAID}>{PAID}</option>
                                        <option value={Default_Contents_Enum.NOT_SEND}>{NOT_SEND}</option>
                                        <option value={Default_Contents_Enum.SENT}>{SENT}</option>
                                        <option value={Default_Contents_Enum.RETURN}>{RETURN}</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        {order_status_type === Order_Status_Type_Enum.FREEDOM && (
                            <div className={style.freedomSelection}>
                                <div>Điền trạng thái tùy chỉnh của bạn</div>
                                <div>
                                    <input
                                        value={new_freedom_content}
                                        onChange={(e) => handle_New_Freedom_Content(e)}
                                        placeholder="Trạng thái mới"
                                    />
                                </div>
                            </div>
                        )}
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

export default memo(AddOrderStatusDialog);
