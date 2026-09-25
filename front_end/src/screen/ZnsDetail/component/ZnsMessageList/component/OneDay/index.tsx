import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { Zns_Message_Field, Zns_Message_Enum } from '@src/data_struct/zalo';
import { formatMoney } from '@src/utility/string';
import { detailTime } from '@src/utility/time';

const OneDay: FC<{ messages: Zns_Message_Field[] }> = ({ messages }) => {
    const [this_day, set__this_day] = useState<string>('');
    const [money_total, set__money_total] = useState<string>('');

    useEffect(() => {
        if (messages.length === 0) return;

        const value = detailTime(messages[0].create_time);
        const date = value.split(' ')[1];
        set__this_day(date);

        let _money_total: number = 0;
        for (let i: number = 0; i < messages.length; i++) {
            _money_total = _money_total + messages[0].cost;
        }
        set__money_total(formatMoney(_money_total));
    }, [messages]);

    const handle_Money_Color = (item: Zns_Message_Field) => {
        if (item.type === Zns_Message_Enum.PHONE) {
            return style.red;
        } else {
            return style.blue;
        }
    };

    const message_list = messages.map((item, index) => {
        return (
            <div className={style.oneMessage} key={index}>
                <div className={`${style.cost} ${handle_Money_Color(item)}`}>{formatMoney(item.cost)}</div>
                <div>
                    <div>{item.type}</div>
                    <div>{detailTime(item.create_time)}</div>
                </div>
            </div>
        );
    });

    return (
        <div className={style.parent}>
            <div className={style.total}>
                <div>{this_day}</div>
                <div>{money_total}</div>
            </div>
            <div className={style.rows}>{message_list}</div>
        </div>
    );
};

export default memo(OneDay);
