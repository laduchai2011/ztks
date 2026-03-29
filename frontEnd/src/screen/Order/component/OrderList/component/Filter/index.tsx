import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { PAY, MONEY, FROM, TO, SEARCH } from '@src/const/text';
import { SelectFilterEnum, SelectFilterType } from './type';
import { OrdersFilterBodyField } from '@src/dataStruct/order/body';
import { formatMoney } from '@src/utility/string';
import { ZaloOaField } from '@src/dataStruct/zalo';

const Filter: FC<{ handleGetOrders: (ordersFilterBody: OrdersFilterBodyField) => void }> = ({ handleGetOrders }) => {
    const location = useLocation();
    const selectedOa: ZaloOaField | undefined = useSelector((state: RootState) => state.OrderSlice.selectedOa);
    const [isPay, setIsPay] = useState<boolean>(true);
    const [isNotPay, setIsNotPay] = useState<boolean>(true);
    const [isOa, setIsOa] = useState<boolean>(true);
    const [moneyFrom, setMoneyFrom] = useState<string>('');
    const [isFormattingMoneyFrom, setIsFormattingMoneyFrom] = useState(false);
    const [moneyTo, setMoneyTo] = useState<string>('');
    const [isFormattingMoneyTo, setIsFormattingMoneyTo] = useState(false);
    const [selectedValue, setSelectedValue] = useState<string>('');
    const [selectedOption, setSelectedOption] = useState<SelectFilterType>(SelectFilterEnum.ChatRoomId);
    const chatRoomId = location.state?.chatRoomId;
    const filterBody: OrdersFilterBodyField = {
        page: 1,
        size: 5,
        zaloOaId: isOa ? selectedOa?.id : undefined,
        accountId: -1,
    };

    useEffect(() => {
        if (chatRoomId) {
            setSelectedOption(SelectFilterEnum.ChatRoomId);
            setSelectedValue(chatRoomId);
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

    const handleIsPay = () => {
        setIsPay(!isPay);
    };

    const handleIsNotPay = () => {
        setIsNotPay(!isNotPay);
    };

    const handleIsOa = () => {
        setIsOa(!isOa);
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

    const handleSearch = () => {
        const inputValue = selectedValue.trim();

        if (selectedValue.length === 0) return;

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

        switch (selectedOption) {
            case SelectFilterEnum.ChatRoomId: {
                newFilterBody.chatRoomId = Number(inputValue);
                break;
            }
            case SelectFilterEnum.OrderId: {
                newFilterBody.uuid = inputValue;
                break;
            }
            case SelectFilterEnum.PhoneNumber: {
                newFilterBody.phone = inputValue;
                break;
            }
            default: {
                //statements;
                break;
            }
        }
        handleGetOrders(newFilterBody);
    };

    return (
        <div className={style.parent}>
            <div className={style.chatRoomId}>
                <select onChange={(e) => handleSelected(e)} value={selectedOption}>
                    <option value={SelectFilterEnum.ChatRoomId}>Mã phòng chat</option>
                    <option value={SelectFilterEnum.OrderId}>Mã đơn hàng</option>
                    <option value={SelectFilterEnum.PhoneNumber}>Số điện thoại</option>
                </select>
                <input value={selectedValue} onChange={(e) => handleSelectedValue(e)} placeholder="Mã" />
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
                    <input type="checkbox" checked={isOa} onChange={() => handleIsOa()} />
                    <div>OA</div>
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
