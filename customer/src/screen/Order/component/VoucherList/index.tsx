import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT, VOUCHER_LIST, SEE_MORE } from '@src/const/text';
import {
    set_isLoading,
    setData_toastMessage,
    setIsShow_voucherDialog,
    setOrder_voucherDialog,
    setSelectedVoucher_voucherDialog,
} from '@src/redux/slice/Order';
import { OrderField } from '@src/dataStruct/order';
import { formatMoney } from '@src/utility/string';
import { CustomerField } from '@src/dataStruct/customer';
import { VoucherField } from '@src/dataStruct/voucher';
import { useLazyGetVouchersQuery } from '@src/redux/query/voucherRTK';
import { detailTime } from '@src/utility/time';
import { useCustomerUseVoucherMutation } from '@src/redux/query/voucherRTK';
import { messageType_enum } from '@src/component/ToastMessage/type';

const VoucherList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const customer: CustomerField | undefined = useSelector((state: RootState) => state.AppSlice.customer);
    const isShow: boolean = useSelector((state: RootState) => state.OrderSlice.voucherDialog.isShow);
    const order: OrderField | undefined = useSelector((state: RootState) => state.OrderSlice.voucherDialog.order);
    const selectedVoucher: VoucherField | undefined = useSelector(
        (state: RootState) => state.OrderSlice.voucherDialog.selectedVoucher
    );

    const [selectVoucher, setSelectVoucher] = useState<VoucherField | undefined>(undefined);
    const [vouchers, setVouchers] = useState<VoucherField[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const size = 5;
    const [page, setPage] = useState<number>(1);

    const [getVouchers] = useLazyGetVouchersQuery();
    const [customerUseVoucher] = useCustomerUseVoucherMutation();

    useEffect(() => {
        if (!order) return;
        if (order.phone.length === 0) return;

        dispatch(set_isLoading(true));
        getVouchers({ page: 1, size: size, isUsed: null, phone: order.phone })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setVouchers(resData.data.items);
                    setPage(2);
                    setHasMore(resData.data.items.length === size);
                } else {
                    setHasMore(false);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    }, [dispatch, order, getVouchers]);

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (isShow) {
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
    }, [isShow]);

    useEffect(() => {
        setSelectVoucher(selectedVoucher);
    }, [selectedVoucher]);

    const handleClose = () => {
        dispatch(setIsShow_voucherDialog(false));
        dispatch(setOrder_voucherDialog(undefined));
        dispatch(setSelectedVoucher_voucherDialog(undefined));
    };

    const handleSelectVoucher = (_vouchered: VoucherField) => {
        if (order?.isPay) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.WARN,
                    message: 'Đã thanh toán nên không thể thay đổi !',
                })
            );
        }

        if (_vouchered.isUsed) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.WARN,
                    message: 'Voucher này đã được sử dụng !',
                })
            );
        }

        const timeExpire = _vouchered.timeExpire;
        const isExpired = new Date(timeExpire) < new Date();

        if (isExpired) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.WARN,
                    message: 'Voucher đã hết hạn !',
                })
            );
        }

        setSelectVoucher(_vouchered);
    };

    const handleSeeMore = () => {
        if (!order) return;
        if (!hasMore) return;

        dispatch(set_isLoading(true));
        getVouchers({ page: page, size: size, isUsed: null, phone: order.phone })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setVouchers((prev) => [...prev, ...(resData.data?.items || [])]);
                    setPage((prev) => prev + 1);
                    setHasMore(resData.data.items.length === size);
                } else {
                    setHasMore(false);
                }
            })
            .catch((err) => console.error(err))
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    };

    const handleAgree = () => {
        if (!customer) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Bạn cần đăng nhập !',
                })
            );
            return;
        }

        if (!order || !selectVoucher) return;

        if (order.isPay) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Đã thanh toán nên không thể thay đổi !',
                })
            );
        }

        if (selectVoucher.isUsed) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Voucher này đã được sử dụng !',
                })
            );
            return;
        }

        const timeExpire = selectVoucher?.timeExpire;
        const isExpired = new Date(timeExpire) < new Date();

        if (isExpired) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Voucher đã hết hạn !',
                })
            );
            return;
        }

        customerUseVoucher({ orderId: order.id, voucherId: selectVoucher.id, customerId: customer?.id || -1 })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    dispatch(setSelectedVoucher_voucherDialog(resData.data));
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: 'Áp dụng voucher thành công !',
                        })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Áp dụng voucher thất bại !',
                        })
                    );
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
            });
    };

    const handleIsExpired = (selectVoucher: VoucherField) => {
        return new Date(selectVoucher.timeExpire) < new Date();
    };

    const list_voucher = vouchers.map((item, index) => {
        const stype_used = item.isUsed && item.orderId === order?.id ? style.used : '';
        const isExpired = new Date(item.timeExpire) < new Date();

        return (
            <div className={`${style.aVoucher} ${stype_used}`} key={index}>
                <input
                    checked={item.id === selectVoucher?.id}
                    type="checkbox"
                    onChange={() => handleSelectVoucher(item)}
                />
                <div className={style.index}>{index + 1}</div>
                <div className={style.voucherContent}>
                    <div>{formatMoney(item.money)}</div>
                    <div>{detailTime(item.timeExpire)}</div>
                </div>
                <div className={style.is}>
                    <div>
                        {!item.isUsed && <div className={style.not}>Chưa sử dụng</div>}
                        {item.isUsed && <div className={style.ed}>Đã sử dụng</div>}
                    </div>
                    <div>
                        {!isExpired && <div className={style.not}>Chưa hết hạn</div>}
                        {isExpired && <div className={style.ed}>Đã hết hạn</div>}
                    </div>
                </div>
            </div>
        );
    });

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.title}>{VOUCHER_LIST}</div>
                    <div className={style.selectedVoucher}>
                        {selectVoucher && (
                            <div className={style.aVoucher}>
                                <div className={style.voucherContent}>
                                    <div>{formatMoney(selectVoucher.money)}</div>
                                    <div>{detailTime(selectVoucher.timeExpire)}</div>
                                </div>
                                <div className={style.is}>
                                    <div>
                                        {!selectVoucher.isUsed && <div className={style.not}>Chưa sử dụng</div>}
                                        {selectVoucher.isUsed && <div className={style.ed}>Đã sử dụng</div>}
                                    </div>
                                    <div>
                                        {!handleIsExpired(selectVoucher) && (
                                            <div className={style.not}>Chưa hết hạn</div>
                                        )}
                                        {handleIsExpired(selectVoucher) && <div className={style.ed}>Đã hết hạn</div>}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={style.list}>{list_voucher}</div>
                    <div className={style.seeMore}>
                        {hasMore && <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>}
                    </div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handleAgree()}>{AGREE}</button>
                    <button onClick={() => handleClose()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(VoucherList);
