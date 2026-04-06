import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { BalanceFluctuationField, BalanceFluctuationEnum } from '@src/dataStruct/wallet';
import { formatMoney } from '@src/utility/string';

const ABalanceFluctuation: FC<{ balanceFluctuation: BalanceFluctuationField }> = ({ balanceFluctuation }) => {
    const payHookId = balanceFluctuation.payHookId;
    const [typeText, setTypeText] = useState<string>('');

    useEffect(() => {
        const type = balanceFluctuation.type;
        if (type === BalanceFluctuationEnum.PAY_ORDER) {
            setTypeText('Thanh toán đơn hàng');
        }
        if (type === BalanceFluctuationEnum.PAY_AGENT) {
            setTypeText('Thanh toán dịch vụ');
        }
        if (type === BalanceFluctuationEnum.RECOMMEND) {
            setTypeText('Giới thiệu thành công');
        }
    }, [balanceFluctuation]);

    const handleAmountColor = () => {
        const amount = balanceFluctuation.amount;
        if (amount > 0) {
            return style.iColor;
        } else {
            return style.dColor;
        }
    };

    const handleTime = () => {
        const iso = balanceFluctuation.createTime;

        const vnTime = new Date(iso).toLocaleString('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
        });

        return vnTime;
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={`${style.amount} ${handleAmountColor()}`}>{formatMoney(balanceFluctuation.amount)}</div>
                <div className={style.infor}>
                    <div className={style.type}>{typeText}</div>
                    {payHookId && <div className={style.hook}>{payHookId}</div>}
                </div>
            </div>
            <div className={style.timeAgo}>
                <div>{handleTime()}</div>
            </div>
        </div>
    );
};

export default memo(ABalanceFluctuation);
