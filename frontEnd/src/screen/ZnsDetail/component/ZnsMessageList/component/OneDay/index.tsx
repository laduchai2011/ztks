import { FC, memo } from 'react';
import style from './style.module.scss';
import { ZnsMessageField } from '@src/dataStruct/zalo';

const OneDay: FC<{ messages: ZnsMessageField[] }> = ({ messages }) => {
    const message_list = messages.map((item, index) => {
        return (
            <div className={style.oneMessage} key={index}>
                <div>{item.cost}</div>
                <div>
                    <div>{item.type}</div>
                    <div>{item.createTime}</div>
                </div>
            </div>
        );
    });

    return (
        <div className={style.parent}>
            <div className={style.total}>
                <div>time</div>
                <div>money</div>
            </div>
            <div className={style.rows}>{message_list}</div>
        </div>
    );
};

export default memo(OneDay);
