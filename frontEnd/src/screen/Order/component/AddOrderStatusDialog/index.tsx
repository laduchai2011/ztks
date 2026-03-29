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
    setData_toastMessage,
    set_isLoading,
    set_addOrderStatusDialog,
    setFinal_addOrderStatusDialog,
} from '@src/redux/slice/Order';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { AccountField } from '@src/dataStruct/account';
import { OrderField } from '@src/dataStruct/order';
import { CreateOrderStatusBodyField } from '@src/dataStruct/order/body';
import { orderStatusType_type, orderStatusType_enum, defaultContents, defaultContent_type } from '../../type';
import { useCreateOrderStatusMutation } from '@src/redux/query/orderRTK';

const AddOrderStatusDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const options_element = useRef<HTMLDivElement | null>(null);
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const isShow: boolean = useSelector((state: RootState) => state.OrderSlice.addOrderStatusDialog.isShow);
    const order: OrderField | undefined = useSelector(
        (state: RootState) => state.OrderSlice.addOrderStatusDialog.order
    );
    const defaultOrderStatusType: orderStatusType_type | undefined = useSelector(
        (state: RootState) => state.OrderSlice.addOrderStatusDialog.defaultOrderStatusType
    );

    const [orderStatusType, setOrderStatusType] = useState<orderStatusType_type>(orderStatusType_enum.FREEDOM);
    const [selectedDefaultContent, setSelectedDefaultContent] = useState<defaultContent_type>(defaultContents.NOT_PAY);
    const [newFreedomContent, setNewFreedomContent] = useState<string>('');
    const [createOrderStatusBody, setCreateOrderStatusBody] = useState<CreateOrderStatusBodyField>({
        type: '',
        content: '',
        orderId: -1,
        accountId: -1,
    });

    const [createOrderStatus] = useCreateOrderStatusMutation();

    // useEffect(() => {
    //     console.log('createOrderStatusBody', createOrderStatusBody);
    // }, [createOrderStatusBody]);

    useEffect(() => {
        if (!account) return;
        setCreateOrderStatusBody((prev) => ({
            ...prev,
            accountId: account.id,
        }));
    }, [account]);

    useEffect(() => {
        if (!order) return;
        setCreateOrderStatusBody((prev) => ({
            ...prev,
            orderId: order.id,
        }));
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

    useEffect(() => {
        if (defaultOrderStatusType) {
            setOrderStatusType(defaultOrderStatusType);
        } else {
            setOrderStatusType(orderStatusType_enum.FREEDOM);
        }
    }, [defaultOrderStatusType]);

    useEffect(() => {
        if (!options_element.current) return;
        const optionsElement = options_element.current;
        const freedomElement = optionsElement.children[0];
        const defaultElement = optionsElement.children[1];

        switch (orderStatusType) {
            case orderStatusType_enum.FREEDOM: {
                freedomElement.classList.add(style.selected);
                defaultElement.classList.remove(style.selected);
                break;
            }
            case orderStatusType_enum.DEFAULT: {
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

        setCreateOrderStatusBody((prev) => ({
            ...prev,
            type: orderStatusType,
        }));
    }, [orderStatusType]);

    const handleOrderStatusType = (orderStatusType: orderStatusType_type) => {
        setOrderStatusType(orderStatusType);
    };

    const handSelectedDefaultContent = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as defaultContent_type;
        setSelectedDefaultContent(value);
    };

    const handleNewFreedomContent = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNewFreedomContent(value);
    };

    const handleClose = () => {
        dispatch(set_addOrderStatusDialog({ isShow: false, order: undefined }));
    };

    const handleAgree = () => {
        const createOrderStatusBody_cp = { ...createOrderStatusBody };
        if (createOrderStatusBody_cp.type === orderStatusType_enum.DEFAULT) {
            createOrderStatusBody_cp.content = selectedDefaultContent;
        } else if (createOrderStatusBody_cp.type === orderStatusType_enum.FREEDOM) {
            createOrderStatusBody_cp.content = newFreedomContent.trim();
        } else {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.NORMAL,
                    message: 'Kiểu trạng thái khôg hợp lệ !',
                })
            );
            return;
        }

        dispatch(set_isLoading(true));
        createOrderStatus(createOrderStatusBody_cp)
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    dispatch(setFinal_addOrderStatusDialog({ isShow: false, newOrderStatus: resData.data }));
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Thêm trạng thái không thành công !',
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
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.label}>
                        <div>{ORDER_STATUS}</div>
                    </div>
                    <div className={style.optionContainer}>
                        <div className={style.options} ref={options_element}>
                            <div onClick={() => handleOrderStatusType(orderStatusType_enum.FREEDOM)}>{FREEDOM}</div>
                            <div onClick={() => handleOrderStatusType(orderStatusType_enum.DEFAULT)}>{DEFAULT}</div>
                        </div>
                    </div>
                    <div className={style.selectedContentContainer}>
                        {orderStatusType === orderStatusType_enum.DEFAULT && (
                            <div className={style.defaultSelection}>
                                <div>Lựa chọn trạng thái mặc định</div>
                                <div>
                                    <select
                                        value={selectedDefaultContent}
                                        onChange={(e) => handSelectedDefaultContent(e)}
                                    >
                                        <option value={defaultContents.NOT_PAY}>{NOT_PAY}</option>
                                        <option value={defaultContents.PAID}>{PAID}</option>
                                        <option value={defaultContents.NOT_SEND}>{NOT_SEND}</option>
                                        <option value={defaultContents.SENT}>{SENT}</option>
                                        <option value={defaultContents.RETURN}>{RETURN}</option>
                                    </select>
                                </div>
                            </div>
                        )}
                        {orderStatusType === orderStatusType_enum.FREEDOM && (
                            <div className={style.freedomSelection}>
                                <div>Điền trạng thái tùy chỉnh của bạn</div>
                                <div>
                                    <input
                                        value={newFreedomContent}
                                        onChange={(e) => handleNewFreedomContent(e)}
                                        placeholder="Trạng thái mới"
                                    />
                                </div>
                            </div>
                        )}
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

export default memo(AddOrderStatusDialog);
