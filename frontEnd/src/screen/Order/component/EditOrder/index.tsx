import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT, PHONE_NUMBER, CONTENT, TITLE, MONEY } from '@src/const/text';
import {
    setData_toastMessage,
    set_isLoading,
    set_editOrderDialog,
    setFinal_editOrderDialog,
} from '@src/redux/slice/Order';
import { messageType_enum } from '@src/component/ToastMessage/type';
import TextEditor from '@src/component/TextEditor';
import { OrderField } from '@src/dataStruct/order';
import { isValidPhoneNumber } from '@src/utility/string';
import { formatMoney } from '@src/utility/string';
import { useUpdateOrderMutation } from '@src/redux/query/orderRTK';

const EditOrder = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const isShow: boolean = useSelector((state: RootState) => state.OrderSlice.editOrderDialog.isShow);
    const order: OrderField | undefined = useSelector((state: RootState) => state.OrderSlice.editOrderDialog.order);
    const [newOrder, setNewOrder] = useState<OrderField | undefined>(order);
    const [content, setContent] = useState<string>('');
    const [money, setMoney] = useState<string>('');
    const [isFormattingMoney, setIsFormattingMoney] = useState(false);
    const [updateOrder] = useUpdateOrderMutation();

    useEffect(() => {
        if (!order) return;
        setNewOrder(order);
        setMoney(order.money.toString());
    }, [order]);

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

    const handleClose = () => {
        dispatch(set_editOrderDialog({ isShow: false, order: undefined }));
    };

    const handleAgree = () => {
        if (!newOrder) return;

        const label_t = newOrder.label.trim();
        if (label_t.length === 0) {
            dispatch(setData_toastMessage({ type: messageType_enum.ERROR, message: 'Tiêu đề không được để trống !' }));
            return;
        }

        const phone_t = newOrder.phone.trim();
        if (phone_t.length > 0 && !isValidPhoneNumber(phone_t)) {
            dispatch(setData_toastMessage({ type: messageType_enum.ERROR, message: 'Số điện thoại không hợp lệ !' }));
            return;
        }

        const orderBody = { ...newOrder };
        orderBody.label = label_t;
        orderBody.phone = phone_t;
        orderBody.content = content;
        orderBody.money = Number(money);

        dispatch(set_isLoading(true));
        updateOrder(orderBody)
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    dispatch(setFinal_editOrderDialog({ isShow: false, newOrder: resData.data }));
                    dispatch(
                        setData_toastMessage({ type: messageType_enum.SUCCESS, message: 'Cập nhật thành công !' })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({ type: messageType_enum.ERROR, message: 'Cập nhật không thành công !' })
                    );
                }
            })
            .catch((err) => {
                dispatch(
                    setData_toastMessage({ type: messageType_enum.ERROR, message: 'Cập nhật không thành công !' })
                );
                console.error(err);
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    };

    const handleLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!newOrder) return;
        setNewOrder({ ...newOrder, label: e.target.value });
    };

    const handleContent = (value: string) => {
        setContent(value);
    };

    const handlePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!newOrder) return;
        setNewOrder({ ...newOrder, phone: e.target.value });
    };

    const handleMoney = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const raw = value.replace(/\D/g, '');
        setMoney(raw);
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.uuidContainer}>{newOrder?.uuid}</div>
                <div className={style.contentContainer}>
                    <div className={style.label}>
                        <div>{TITLE}</div>
                        <div>
                            <input value={newOrder?.label || ''} onChange={(e) => handleLabel(e)} />
                        </div>
                    </div>
                    <div className={style.content}>
                        <div>{CONTENT}</div>
                        <div>
                            <TextEditor value={newOrder?.content} onChange={(value) => handleContent(value)} />
                        </div>
                    </div>
                    <div className={style.phone}>
                        <div>{PHONE_NUMBER}</div>
                        <div>
                            <input value={newOrder?.phone || ''} onChange={(e) => handlePhone(e)} />
                        </div>
                    </div>
                    <div className={style.money}>
                        <div>{MONEY}</div>
                        <div>
                            <input
                                value={isFormattingMoney && money ? formatMoney(money) : money}
                                onChange={handleMoney}
                                onFocus={() => setIsFormattingMoney(false)}
                                onBlur={() => setIsFormattingMoney(true)}
                                placeholder="VND"
                            />
                        </div>
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

export default memo(EditOrder);
