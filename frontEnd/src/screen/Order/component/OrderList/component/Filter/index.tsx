import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { PAY, MONEY, FROM, TO, SEARCH } from '@src/const/text';
import { SelectFilterEnum, SelectFilterType } from './type';
import { OrdersFilterBodyField } from '@src/dataStruct/order/body';
import { formatMoney } from '@src/utility/string';
import { BsPinFill } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';
import { isPositiveInteger } from '@src/utility/string';
import { setData_toastMessage } from '@src/redux/slice/Order';
import { messageType_enum } from '@src/component/ToastMessage/type';

const Filter: FC<{ handleGetOrders: (ordersFilterBody: OrdersFilterBodyField) => void }> = ({ handleGetOrders }) => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const [isPay, setIsPay] = useState<boolean>(true);
    const [isNotPay, setIsNotPay] = useState<boolean>(true);
    const [isDelete, setIsDelete] = useState<boolean>(true);
    const [isNotDelete, setIsNotDelete] = useState<boolean>(true);
    const [moneyFrom, setMoneyFrom] = useState<string>('');
    const [isFormattingMoneyFrom, setIsFormattingMoneyFrom] = useState(false);
    const [moneyTo, setMoneyTo] = useState<string>('');
    const [isFormattingMoneyTo, setIsFormattingMoneyTo] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<SelectFilterType>(SelectFilterEnum.ChatRoomId);
    const chatRoomId = location.state?.chatRoomId;
    const [chatRoomId1, setChatRoomId1] = useState<string>('');
    const [phoneNumber, setPhoneNumber] = useState<string>('');
    const [orderUuid, setOrderUuid] = useState<string>('');

    useEffect(() => {
        if (chatRoomId) {
            setSelectedOption(SelectFilterEnum.ChatRoomId);
            setSelectedValue(chatRoomId);
            setChatRoomId1(chatRoomId);
        }
    }, [chatRoomId]);

    const handleSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as SelectFilterType;
        setSelectedOption(value);
    };

    const handleSelectedValue = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSelectedValue(value);
    };

    const handleCloseChatRoomId1 = () => {
        setChatRoomId1('');
    };

    const handleClosePhoneNumber = () => {
        setPhoneNumber('');
    };

    const handleCloseOrderUuid = () => {
        setOrderUuid('');
    };

    const handleIsPay = () => {
        setIsPay(!isPay);
    };

    const handleIsNotPay = () => {
        setIsNotPay(!isNotPay);
    };

    const handleIsDelete = () => {
        setIsDelete(!isDelete);
    };

    const handleIsNotDelete = () => {
        setIsNotDelete(!isNotDelete);
    };

    const handleMoneyFrom = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const raw = value.replace(/\D/g, '');
        setMoneyFrom(raw);
    };

    const handleMoneyFromTo = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const raw = value.replace(/\D/g, '');
        setMoneyTo(raw);
    };

    const handlePin = () => {
        const inputValue = selectedValue.trim();

        switch (selectedOption) {
            case SelectFilterEnum.ChatRoomId: {
                setChatRoomId1(inputValue);
                break;
            }
            case SelectFilterEnum.OrderUuid: {
                setOrderUuid(inputValue);
                break;
            }
            case SelectFilterEnum.PhoneNumber: {
                setPhoneNumber(inputValue);
                break;
            }
            default: {
                //statements;
                break;
            }
        }
    };

    const handleSearch = () => {
        if (chatRoomId1.trim().length === 0) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Vui lòng thêm Id phòng hội thoại !',
                })
            );
            return;
        }

        if (!isPositiveInteger(chatRoomId1)) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Id phòng chat phải là 1 số nguyên dương !',
                })
            );
            return;
        }

        if (selectedValue.length === 0) return;

        const filterBody: OrdersFilterBodyField = {
            page: 1,
            size: 5,
            chatRoomId: Number(chatRoomId1),
            accountId: -1,
        };

        const newFilterBody = { ...filterBody };

        if (isPay && isNotPay) {
            newFilterBody.isPay = undefined;
        } else if (isPay) {
            newFilterBody.isPay = true;
        } else if (isNotPay) {
            newFilterBody.isPay = false;
        }

        if (moneyFrom.length > 0) {
            newFilterBody.moneyFrom = Number(moneyFrom);
        }

        if (moneyTo.length > 0) {
            newFilterBody.moneyTo = Number(moneyTo);
        }

        if (phoneNumber.trim().length > 0) {
            newFilterBody.phone = phoneNumber.trim();
        }

        if (orderUuid.trim().length > 0) {
            newFilterBody.uuid = phoneNumber.trim();
        }

        if (isDelete && isNotDelete) {
            newFilterBody.isDelete = undefined;
        } else if (isDelete) {
            newFilterBody.isDelete = true;
        } else if (isNotDelete) {
            newFilterBody.isDelete = false;
        }

        handleGetOrders(newFilterBody);
    };

    return (
        <div className={style.parent}>
            <div className={style.searchInput}>
                <select onChange={(e) => handleSelected(e)} value={selectedOption}>
                    <option value={SelectFilterEnum.ChatRoomId}>Mã phòng chat</option>
                    <option value={SelectFilterEnum.OrderUuid}>Mã đơn hàng</option>
                    <option value={SelectFilterEnum.PhoneNumber}>Số điện thoại</option>
                </select>
                <input value={selectedValue} onChange={(e) => handleSelectedValue(e)} placeholder="Mã" />
                <BsPinFill onClick={() => handlePin()} />
            </div>
            <div className={style.selectedValue}>
                {chatRoomId1.trim().length > 0 && (
                    <div>
                        <div>{`Phòng chat (${chatRoomId1})`}</div>
                        <IoIosClose onClick={() => handleCloseChatRoomId1()} />
                    </div>
                )}
                {phoneNumber.trim().length > 0 && (
                    <div>
                        <div>{`Sđt (${phoneNumber})`}</div>
                        <IoIosClose onClick={() => handleClosePhoneNumber()} />
                    </div>
                )}
                {orderUuid.trim().length > 0 && (
                    <div>
                        <div>{`Đơn hàng (${orderUuid})`}</div>
                        <IoIosClose onClick={() => handleCloseOrderUuid()} />
                    </div>
                )}
            </div>
            <div className={style.checks}>
                <div>
                    <input type="checkbox" checked={isPay} onChange={() => handleIsPay()} />
                    <div>{PAY}</div>
                </div>
                <div>
                    <input type="checkbox" checked={isNotPay} onChange={() => handleIsNotPay()} />
                    <div>{PAY}</div>
                </div>
                <div>
                    <input type="checkbox" checked={isDelete} onChange={() => handleIsDelete()} />
                    <div>Đã xóa</div>
                </div>
                <div>
                    <input type="checkbox" checked={isNotDelete} onChange={() => handleIsNotDelete()} />
                    <div>Chưa xóa</div>
                </div>
            </div>
            <div className={style.money}>
                <div>{MONEY}</div>
                <div className={style.txt}>{FROM}</div>
                <input
                    value={isFormattingMoneyFrom && moneyFrom ? formatMoney(moneyFrom) : moneyFrom}
                    onChange={handleMoneyFrom}
                    onFocus={() => setIsFormattingMoneyFrom(false)}
                    onBlur={() => setIsFormattingMoneyFrom(true)}
                    placeholder="VND"
                />
                <div className={style.txt}>{TO}</div>
                <input
                    value={isFormattingMoneyTo && moneyTo ? formatMoney(moneyTo) : moneyTo}
                    onChange={handleMoneyFromTo}
                    onFocus={() => setIsFormattingMoneyTo(false)}
                    onBlur={() => setIsFormattingMoneyTo(true)}
                    placeholder="VND"
                />
            </div>
            <div className={style.searchContainer}>
                <div onClick={() => handleSearch()}>{SEARCH}</div>
            </div>
        </div>
    );
};

export default memo(Filter);
