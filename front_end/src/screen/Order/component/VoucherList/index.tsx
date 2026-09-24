import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT, VOUCHER_LIST } from '@src/const/text';
import { set__is_show__voucher_dialog } from '@src/redux/slice/Order';
import { Order_Field } from '@src/data_struct/order';
import { formatMoney } from '@src/utility/string';
import { Voucher_Field } from '@src/data_struct/voucher';
import { useLazy_get_Vouchers_Query, useLazy_get_Voucher_With_Order_Id_Query } from '@src/redux/query/voucher_RTK';
import { detailTime } from '@src/utility/time';

const VoucherList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const is_show: boolean = useSelector((state: RootState) => state.Order_Slice.voucher_dialog.is_show);
    const order: Order_Field | undefined = useSelector((state: RootState) => state.Order_Slice.voucher_dialog.order);

    const [selected_voucher, set__selected_voucher] = useState<Voucher_Field | undefined>(undefined);
    const [vouchers, set__vouchers] = useState<Voucher_Field[]>([]);
    const size = 5;
    const [page, set__page] = useState<number>(1);

    const [get_Vouchers] = useLazy_get_Vouchers_Query();
    const [get_Voucher_With_Order_Id] = useLazy_get_Voucher_With_Order_Id_Query();

    useEffect(() => {
        if (!order) return;
        if (order.phone.length === 0) return;

        get_Vouchers({ page: 1, size: size, is_used: null, phone: order.phone })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__vouchers(res_data.data.items);
                    set__page(2);
                }
            })
            .catch((err) => console.error(err));
    }, [order, get_Vouchers, page]);

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
        if (!order) return;
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

    const handle_Close = () => {
        dispatch(set__is_show__voucher_dialog(false));
    };

    const handle_Agree = () => {
        handle_Close();
    };

    const list_voucher = vouchers.map((item, index) => {
        const stype_used = item.is_used && item.order_id === order?.id ? style.used : '';
        const isExpired = new Date(item.time_expire) < new Date();

        return (
            <div className={`${style.aVoucher} ${stype_used}`} key={index}>
                <div className={style.index}>{index + 1}</div>
                <div className={style.voucherContent}>
                    <div>{formatMoney(item.money)}</div>
                    <div>{detailTime(item.time_expire)}</div>
                </div>
                <div className={style.is}>
                    <div>
                        {!item.is_used && <div className={style.not}>Chưa sử dụng</div>}
                        {item.is_used && <div className={style.ed}>Đã sử dụng</div>}
                    </div>
                    <div>
                        {!isExpired && <div className={style.not}>Chưa hết hạn</div>}
                        {isExpired && <div className={style.ed}>Đã hết hạn</div>}
                    </div>
                </div>
            </div>
        );
    });

    const handle_Is_Expired = (selected_voucher: Voucher_Field) => {
        if (!selected_voucher) return;
        return new Date(selected_voucher.time_expire) < new Date();
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.title}>{VOUCHER_LIST}</div>
                    <div className={style.selectedVoucher}>
                        {selected_voucher && (
                            <div className={style.aVoucher}>
                                <div className={style.voucherContent}>
                                    <div>{formatMoney(selected_voucher.money)}</div>
                                    <div>{detailTime(selected_voucher.time_expire)}</div>
                                </div>
                                <div className={style.is}>
                                    <div>
                                        {!selected_voucher.is_used && <div className={style.not}>Chưa sử dụng</div>}
                                        {selected_voucher.is_used && <div className={style.ed}>Đã sử dụng</div>}
                                    </div>
                                    <div>
                                        {!handle_Is_Expired(selected_voucher) && (
                                            <div className={style.not}>Chưa hết hạn</div>
                                        )}
                                        {handle_Is_Expired(selected_voucher) && (
                                            <div className={style.ed}>Đã hết hạn</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className={style.list}>{list_voucher}</div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handle_Agree()}>{AGREE}</button>
                    <button onClick={() => handle_Close()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(VoucherList);
