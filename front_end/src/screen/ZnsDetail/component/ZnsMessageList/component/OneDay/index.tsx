import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { ZnsMessageField, ZnsMessageEnum } from '@src/dataStruct/zalo';
import { formatMoney } from '@src/utility/string';
import { detailTime } from '@src/utility/time';

const OneDay: FC<{ messages: ZnsMessageField[] }> = ({ messages }) => {
    const [thisDay, setThisDay] = useState<string>('');
    const [moneyTotal, setMoneyTotal] = useState<string>('');

    useEffect(() => {
        if (messages.length === 0) return;

        const value = detailTime(messages[0].createTime);
        const date = value.split(' ')[1];
        setThisDay(date);

        let moneyTotal_: number = 0;
        for (let i: number = 0; i < messages.length; i++) {
            moneyTotal_ = moneyTotal_ + messages[0].cost;
        }
        setMoneyTotal(formatMoney(moneyTotal_));
    }, [messages]);

    const handleMoneyColor = (item: ZnsMessageField) => {
        if (item.type === ZnsMessageEnum.PHONE) {
            return style.red;
        } else {
            return style.blue;
        }
    };

    const message_list = messages.map((item, index) => {
        return (
            <div className={style.oneMessage} key={index}>
                <div className={`${style.cost} ${handleMoneyColor(item)}`}>{formatMoney(item.cost)}</div>
                <div>
                    <div>{item.type}</div>
                    <div>{detailTime(item.createTime)}</div>
                </div>
            </div>
        );
    });

    return (
        <div className={style.parent}>
            <div className={style.total}>
                <div>{thisDay}</div>
                <div>{moneyTotal}</div>
            </div>
            <div className={style.rows}>{message_list}</div>
        </div>
    );
};

export default memo(OneDay);
