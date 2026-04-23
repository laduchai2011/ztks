import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { DayPicker, DateRange } from 'react-day-picker';
import { vi } from 'date-fns/locale';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { MONEY, FROM, TO, RECEIVED, SEARCH } from '@src/const/text';
import { formatMoney } from '@src/utility/string';
import { AccountField } from '@src/dataStruct/account';
import { MemberZtksGetRequiresTakeMoneyBodyField } from '@src/dataStruct/wallet/body';
import { DateTime } from 'luxon';

const Filter = () => {
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const [fromDay, setFromDay] = useState<Date | undefined>(undefined);
    const [toDay, setToDay] = useState<Date | undefined>(undefined);
    const [isShowFromDay, setIsShowFromDay] = useState<boolean>(false);
    const [isShowToDay, setIsShowToDay] = useState<boolean>(false);
    const [isReceive, setIsReceive] = useState<boolean>(false);
    const [isDo, setIsDo] = useState<boolean>(false);
    const [isNotDo, setIsNotDo] = useState<boolean>(false);
    const [moneyFrom, setMoneyFrom] = useState<string>('');
    const [isFormattingMoneyFrom, setIsFormattingMoneyFrom] = useState(false);
    const [moneyTo, setMoneyTo] = useState<string>('');
    const [isFormattingMoneyTo, setIsFormattingMoneyTo] = useState(false);
    const filterBody: MemberZtksGetRequiresTakeMoneyBodyField = {
        page: 1,
        size: 5,
    };

    useEffect(() => {
        console.log(fromDay, isReceive);
    }, [fromDay, isReceive]);

    const handleIsReceive = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsReceive(e.target.checked);
    };

    const handleIsDo = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsDo(e.target.checked);
    };

    const handleIsNotDo = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsNotDo(e.target.checked);
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

    const handleIsShowFromDay = (isShow: boolean) => {
        setIsShowFromDay(isShow);
    };

    const handleIsShowToDay = (isShow: boolean) => {
        setIsShowToDay(isShow);
    };

    const handleSearch = () => {
        if (!account) return;

        const newFilterBody = { ...filterBody };

        if (isReceive) {
            newFilterBody.memberZtksId = account.id;
        }

        if (isDo) {
            newFilterBody.isDo = true;
        }

        if (isNotDo) {
            newFilterBody.isDo = false;
        }

        if (moneyFrom.length > 0) {
            newFilterBody.moneyFrom = Number(moneyFrom);
        }

        if (moneyTo.length > 0) {
            newFilterBody.moneyTo = Number(moneyTo);
        }

        if (fromDay) {
            newFilterBody.doFromDate = DateTime.fromJSDate(fromDay).toFormat('yyyy-MM-dd HH:mm:ss');
        }

        // if (range?.to) {
        //     newFilterBody.doToDate = DateTime.fromJSDate(range.to).toFormat('yyyy-MM-dd HH:mm:ss');
        // }

        console.log('newFilterBody', newFilterBody);
    };

    return (
        <div className={style.parent}>
            <div className={style.checkContainer}>
                <div className={style.oneCheck}>
                    <input checked={isReceive} onChange={(e) => handleIsReceive(e)} type="checkbox" />
                    <div>{RECEIVED}</div>
                </div>
                <div className={style.oneCheck}>
                    <input checked={isDo} onChange={(e) => handleIsDo(e)} type="checkbox" />
                    <div>Đã chuyển khoản</div>
                </div>
                <div className={style.oneCheck}>
                    <input checked={isNotDo} onChange={(e) => handleIsNotDo(e)} type="checkbox" />
                    <div>Chưa chuyển khoản</div>
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
            <div className={style.timeContainer}>
                <div className={style.show}>
                    <div>{`Từ ngày: ${fromDay}`}</div>
                    <div>
                        {!isShowFromDay && <FiChevronDown onClick={() => handleIsShowFromDay(true)} size={20} />}
                        {isShowFromDay && <FiChevronUp onClick={() => handleIsShowFromDay(false)} size={20} />}
                    </div>
                </div>
                {isShowFromDay && (
                    <DayPicker
                        className={style.box}
                        locale={vi}
                        mode="single"
                        selected={fromDay}
                        onSelect={setFromDay}
                        // disabled={{ before: new Date() }}
                    />
                )}
            </div>
            <div className={style.timeContainer}>
                <div className={style.show}>
                    <div>{`Đến ngày: ${toDay}`}</div>
                    <div>
                        {!isShowToDay && <FiChevronDown onClick={() => handleIsShowToDay(true)} size={20} />}
                        {isShowToDay && <FiChevronUp onClick={() => handleIsShowToDay(false)} size={20} />}
                    </div>
                </div>
                {isShowToDay && (
                    <DayPicker
                        className={style.box}
                        locale={vi}
                        mode="single"
                        selected={toDay}
                        onSelect={setToDay}
                        // disabled={{ before: new Date() }}
                    />
                )}
            </div>
            <div className={style.searchBtn}>
                <div onClick={() => handleSearch()}>{SEARCH}</div>
            </div>
        </div>
    );
};

export default memo(Filter);
