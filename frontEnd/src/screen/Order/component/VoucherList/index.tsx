import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT, VOUCHER_LIST } from '@src/const/text';
import { setIsShow_voucherDialog } from '@src/redux/slice/Order';
import { OrderField } from '@src/dataStruct/order';
import { formatMoney } from '@src/utility/string';
import { AccountField } from '@src/dataStruct/account';
import { VoucherField } from '@src/dataStruct/voucher';
import { useLazyGetVouchersQuery, useLazyGetVoucherWithOrderIdQuery } from '@src/redux/query/voucherRTK';
import { detailTime } from '@src/utility/time';
import { useOrderSelectVoucherMutation } from '@src/redux/query/orderRTK';

const VoucherList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const isShow: boolean = useSelector((state: RootState) => state.OrderSlice.voucherDialog.isShow);
    const order: OrderField | undefined = useSelector((state: RootState) => state.OrderSlice.voucherDialog.order);

    const [selectedVoucher, setSelectedVoucher] = useState<VoucherField | undefined>(undefined);
    const [vouchers, setVouchers] = useState<VoucherField[]>([]);
    const size = 5;
    const [page, setPage] = useState<number>(1);

    const [getVouchers] = useLazyGetVouchersQuery();
    const [orderSelectVoucher] = useOrderSelectVoucherMutation();
    const [getVoucherWithOrderId] = useLazyGetVoucherWithOrderIdQuery();

    useEffect(() => {
        if (!order) return;
        if (order.phone.length === 0) return;

        getVouchers({ page: 1, size: size, isUsed: null, phone: order.phone })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setVouchers(resData.data.items);
                    setPage(2);
                }
            })
            .catch((err) => console.error(err));
    }, [order, getVouchers, page]);

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
        if (!order) return;
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

    const handleClose = () => {
        dispatch(setIsShow_voucherDialog(false));
    };

    const handleSelecVoucher = (_vouchered: VoucherField) => {
        setSelectedVoucher(_vouchered);
    };

    const handleAgree = () => {
        if (!order || !account || !selectedVoucher) return;
        orderSelectVoucher({ id: order.id, voucherId: selectedVoucher.id, accountId: account.id })
            .then((res) => {
                const resData = res.data;
                console.log('orderSelectVoucher', resData);
            })
            .catch((err) => {
                console.error(err);
            });
    };

    const list_voucher = vouchers.map((item, index) => {
        return (
            <div className={style.aVoucher} key={index}>
                <div className={style.voucherContent}>
                    <div>{formatMoney(item.money)}</div>
                    <div>{detailTime(item.timeExpire)}</div>
                </div>
                <div className={style.isUsed}>
                    {!item.isUsed && <div className={style.not}>Chưa sử dụng</div>}
                    {item.isUsed && <div className={style.ed}>Đã sử dụng</div>}
                </div>
                <input checked={item === selectedVoucher} type="checkbox" onChange={() => handleSelecVoucher(item)} />
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
                        {selectedVoucher && (
                            <div className={style.aVoucher}>
                                <div className={style.voucherContent}>
                                    <div>{formatMoney(selectedVoucher.money)}</div>
                                    <div>{detailTime(selectedVoucher.timeExpire)}</div>
                                </div>
                                <div className={style.isUsed}>
                                    {!selectedVoucher.isUsed && <div className={style.not}>Chưa sử dụng</div>}
                                    {selectedVoucher.isUsed && <div className={style.ed}>Đã sử dụng</div>}
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={style.list}>{list_voucher}</div>
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
