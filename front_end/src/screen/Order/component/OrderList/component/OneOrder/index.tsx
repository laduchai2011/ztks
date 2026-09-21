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
    set_editOrderDialog,
    setIsShow_payDialog,
    set_addOrderStatusDialog,
    setData_toastMessage,
    set_isLoading,
    setOrder_payDialog,
    setIsShow_voucherDialog,
    setOrder_voucherDialog,
} from '@src/redux/slice/Order';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { OrderField, OrderStatusField } from '@src/dataStruct/order';
import { VoucherField } from '@src/dataStruct/voucher';
import { formatMoney } from '@src/utility/string';
import { timeAgoSmart } from '@src/utility/time';
import { orderStatusType_enum, orderStatusType_type, defaultContents } from '@src/screen/Order/type';
import { useLazyGetAllOrderStatusQuery } from '@src/redux/query/orderRTK';
import { useLazyGetVoucherWithOrderIdQuery } from '@src/redux/query/voucherRTK';

const OneOrder: FC<{ index: number; data: OrderField }> = ({ index, data }) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const newOrderEdit: OrderField | undefined = useSelector(
        (state: RootState) => state.OrderSlice.editOrderDialog.newOrder
    );
    const newOrderStatus: OrderStatusField | undefined = useSelector(
        (state: RootState) => state.OrderSlice.addOrderStatusDialog.newOrderStatus
    );
    const newOrderPaid: OrderField | undefined = useSelector((state: RootState) => state.OrderSlice.payDialog.newOrder);
    const payText_element = useRef<HTMLDivElement | null>(null);
    const [order, setOrder] = useState<OrderField>(data);
    const [payText, setPayText] = useState<string>('Chưa thanh toán');
    const [orderStatus, setOrderStatus] = useState<OrderStatusField[]>([]);
    const [selectedVoucher, setSelectedVoucher] = useState<VoucherField | undefined>(undefined);
    const [finalMoney, setFinalMoney] = useState<number>(0);

    const [getAllOrderStatus] = useLazyGetAllOrderStatusQuery();
    const [getVoucherWithOrderId] = useLazyGetVoucherWithOrderIdQuery();

    useEffect(() => {
        if (!payText_element.current) return;
        const payTextElement = payText_element.current;
        if (order.isPay) {
            setPayText('Đã thanh toán');
            payTextElement.classList.add(style.paid);
        } else {
            setPayText('Chưa thanh toán');
            payTextElement.classList.remove(style.paid);
        }
    }, [order]);

    useEffect(() => {
        if (!newOrderEdit) return;
        setOrder((prev) => {
            if (newOrderEdit.id === prev.id) {
                return newOrderEdit;
            } else {
                return prev;
            }
        });
    }, [newOrderEdit]);

    useEffect(() => {
        if (!newOrderPaid) return;
        setOrder((prev) => {
            if (newOrderPaid.id === prev.id) {
                return newOrderPaid;
            } else {
                return prev;
            }
        });
    }, [newOrderPaid]);

    useEffect(() => {
        if (!newOrderStatus) return;
        if (newOrderStatus.orderId === order.id) {
            setOrderStatus((prev) => [newOrderStatus, ...prev]);
        }
    }, [newOrderStatus, order.id]);

    useEffect(() => {
        if (!order) return;
        if (selectedVoucher) {
            const final_money: number =
                order.money - selectedVoucher.money >= 0 ? order.money - selectedVoucher.money : 0;
            setFinalMoney(final_money);
        } else {
            setFinalMoney(order.money);
        }
    }, [selectedVoucher, order]);

    useEffect(() => {
        dispatch(set_isLoading(true));
        getAllOrderStatus({ orderId: order.id })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setOrderStatus(resData.data);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    }, [dispatch, getAllOrderStatus, order.id]);

    useEffect(() => {
        getVoucherWithOrderId({ orderId: order.id })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setSelectedVoucher(resData.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [order, getVoucherWithOrderId]);

    const handleOpenEdit = () => {
        dispatch(set_editOrderDialog({ isShow: true, order: order }));
    };

    const handleDelete = () => {
        dispatch(
            setData_toastMessage({
                type: messageType_enum.NORMAL,
                message: 'Tính năng chưa hoạt động !',
            })
        );
    };

    const handleGoToChat = () => {
        navigate(route_enum.MESSAGE1 + '/' + `${order.chatRoomId}`);
    };

    const handleOpenPay = () => {
        dispatch(setIsShow_payDialog(true));
        dispatch(setOrder_payDialog(order));
    };

    const handleOpenVoucherList = () => {
        dispatch(setIsShow_voucherDialog(true));
        dispatch(setOrder_voucherDialog(order));
    };

    const handleOpenOrderStatus = (option: orderStatusType_type) => {
        dispatch(set_addOrderStatusDialog({ isShow: true, order: order, defaultOrderStatusType: option }));
    };

    const list_orderStatus = orderStatus.map((item, index) => {
        if (item.type === orderStatusType_enum.FREEDOM) {
            return (
                <div key={index}>
                    <div>{item.content}</div>
                    <div></div>
                </div>
            );
        }
        if (item.type === orderStatusType_enum.DEFAULT) {
            let content: string = '';
            switch (item.content) {
                case defaultContents.NOT_PAY: {
                    content = NOT_PAY;
                    break;
                }
                case defaultContents.PAID: {
                    content = PAID;
                    break;
                }
                case defaultContents.NOT_SEND: {
                    content = NOT_SEND;
                    break;
                }
                case defaultContents.SENT: {
                    content = SENT;
                    break;
                }
                case defaultContents.RETURN: {
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
                    <CiEdit onClick={() => handleOpenEdit()} size={22} color="green" />
                    <MdDelete onClick={() => handleDelete()} size={22} color="red" />
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
                <div onClick={() => handleGoToChat()}>{CHAT}</div>
                <div>{order.chatRoomId}</div>
            </div>
            <div className={style.isPay}>
                <div>{PAY}</div>
                <div>{formatMoney(finalMoney)}</div>
                <div ref={payText_element}>{payText}</div>
                <div>{!order.isPay && <button onClick={() => handleOpenPay()}>{PAY}</button>}</div>
            </div>
            <div className={style.voucher}>
                <div className={style.text}>
                    {!selectedVoucher && <div className={style.not}>Chưa áp dụng voucher</div>}
                    {selectedVoucher && <div className={style.ed}>Đã áp dụng voucher</div>}
                </div>
                <div className={style.isUsed}>{selectedVoucher && <div>Voucher</div>}</div>
                <div className={style.list}>
                    <div onClick={() => handleOpenVoucherList()}>Danh sách</div>
                </div>
            </div>
            <div className={style.status}>
                <div>
                    <div>
                        <div>{FREEDOM}</div>
                        <IoAddCircle
                            onClick={() => handleOpenOrderStatus(orderStatusType_enum.FREEDOM)}
                            size={20}
                            color="greenyellow"
                        />
                    </div>
                    <div>
                        <div>{DEFAULT}</div>
                        <IoAddCircle
                            onClick={() => handleOpenOrderStatus(orderStatusType_enum.DEFAULT)}
                            size={20}
                            color="greenyellow"
                        />
                    </div>
                </div>
                {list_orderStatus}
            </div>
            <div className={style.time}>{timeAgoSmart(data.createTime)}</div>
        </div>
    );
};

export default memo(OneOrder);
