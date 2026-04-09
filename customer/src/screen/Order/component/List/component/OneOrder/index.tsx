import { memo, FC, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import {
    PHONE_NUMBER,
    CONTENT,
    TITLE,
    PAY,
    FREEDOM,
    DEFAULT,
    NOT_PAY,
    PAID,
    NOT_SEND,
    SENT,
    RETURN,
} from '@src/const/text';
import {
    set_isLoading,
    setData_toastMessage,
    setIsShow_voucherDialog,
    setOrder_voucherDialog,
    setSelectedVoucher_voucherDialog,
} from '@src/redux/slice/Order';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { OrderField, OrderStatusField } from '@src/dataStruct/order';
import { VoucherField } from '@src/dataStruct/voucher';
import { formatMoney } from '@src/utility/string';
import { timeAgoSmart } from '@src/utility/time';
import { useLazyGetAllOrderStatusQuery } from '@src/redux/query/orderRTK';
import { useLazyGetVoucherWithOrderIdQuery } from '@src/redux/query/voucherRTK';
import { orderStatusType_enum, defaultContents } from '@src/screen/Order/type';

const OneOrder: FC<{ index: number; data: OrderField }> = ({ index, data }) => {
    const dispatch = useDispatch<AppDispatch>();
    const payText_element = useRef<HTMLDivElement | null>(null);

    const order: OrderField | undefined = useSelector((state: RootState) => state.OrderSlice.voucherDialog.order);
    const _selectedVoucher: VoucherField | undefined = useSelector(
        (state: RootState) => state.OrderSlice.voucherDialog.selectedVoucher
    );

    const [payText, setPayText] = useState<string>('Chưa thanh toán');
    const [orderStatus, setOrderStatus] = useState<OrderStatusField[]>([]);
    const [selectedVoucher, setSelectedVoucher] = useState<VoucherField | undefined>(undefined);

    const [getAllOrderStatus] = useLazyGetAllOrderStatusQuery();
    const [getVoucherWithOrderId] = useLazyGetVoucherWithOrderIdQuery();

    useEffect(() => {
        if (!payText_element.current) return;
        const payTextElement = payText_element.current;
        if (data.isPay) {
            setPayText('Đã thanh toán');
            payTextElement.classList.add(style.paid);
        } else {
            setPayText('Chưa thanh toán');
            payTextElement.classList.remove(style.paid);
        }
    }, [data]);

    useEffect(() => {
        if (order?.id === data.id) {
            setSelectedVoucher(_selectedVoucher);
        }
    }, [_selectedVoucher, order, data]);

    useEffect(() => {
        dispatch(set_isLoading(true));
        getAllOrderStatus({ orderId: data.id })
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
    }, [dispatch, getAllOrderStatus, data.id]);

    useEffect(() => {
        getVoucherWithOrderId({ orderId: data.id })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setSelectedVoucher(resData.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [data, getVoucherWithOrderId]);

    const handleOpenVoucherList = () => {
        dispatch(setIsShow_voucherDialog(true));
        dispatch(setOrder_voucherDialog(data));
        dispatch(setSelectedVoucher_voucherDialog(selectedVoucher));
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
                <div>{data.uuid}</div>
            </div>
            <div className={style.label}>
                <div>{TITLE}</div>
                <div>{data.label}</div>
            </div>
            <div className={style.content}>
                <div>{CONTENT}</div>
                <div dangerouslySetInnerHTML={{ __html: data.content }} />
            </div>
            <div className={style.phone}>
                <div>{PHONE_NUMBER}</div>
                <div>{data.phone}</div>
            </div>
            <div className={style.isPay}>
                <div>{PAY}</div>
                <div>{formatMoney(data.money)}</div>
                <div ref={payText_element}>{payText}</div>
            </div>
            <div className={style.voucher}>
                <div className={style.text}>
                    {!selectedVoucher && <div className={style.not}>Chưa áp dụng voucher</div>}
                    {selectedVoucher && <div className={style.ed}>Đã áp dụng voucher</div>}
                </div>
                <div className={style.isUsed}>
                    {selectedVoucher && <div onClick={() => handleOpenVoucherList()}>Voucher</div>}
                </div>
                <div className={style.list}>
                    <div onClick={() => handleOpenVoucherList()}>Danh sách</div>
                </div>
            </div>
            <div className={style.status}>
                <div>
                    <div>
                        <div>{FREEDOM}</div>
                    </div>
                    <div>
                        <div>{DEFAULT}</div>
                    </div>
                </div>
                {list_orderStatus}
            </div>
            <div className={style.time}>{timeAgoSmart(data.createTime)}</div>
        </div>
    );
};

export default memo(OneOrder);
