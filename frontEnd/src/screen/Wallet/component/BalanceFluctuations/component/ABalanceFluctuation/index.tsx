import { FC, memo } from 'react';
import style from './style.module.scss';
import { BalanceFluctuationField } from '@src/dataStruct/wallet';

const ABalanceFluctuation: FC<{ balanceFluctuation: BalanceFluctuationField }> = ({ balanceFluctuation }) => {
    const payHookId = balanceFluctuation.payHookId;

    const handleAmountColor = () => {
        const amount = balanceFluctuation.amount;
        if (amount > 0) {
            return style.iColor;
        } else {
            return style.dColor;
        }
    };

    return (
        <div className={style.parent}>
            <div className={`${style.amount} ${handleAmountColor()}`}>amount</div>
            <div className={style.type}>{balanceFluctuation.type}</div>
            {payHookId && <div className={style.hook}>{payHookId}</div>}
        </div>
    );
};

export default memo(ABalanceFluctuation);
