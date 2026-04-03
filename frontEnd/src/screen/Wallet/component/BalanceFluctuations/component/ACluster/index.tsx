import { FC, memo } from 'react';
import style from './style.module.scss';
import { BalanceFluctuationField } from '@src/dataStruct/wallet';
import ABalanceFluctuation from './component/ABalanceFluctuation';

const ACluster: FC<{ balanceFluctuations: BalanceFluctuationField[]; currentDate: string }> = ({
    balanceFluctuations,
    currentDate,
}) => {
    const list_balanceFluctuation = balanceFluctuations.map((item, index) => {
        return <ABalanceFluctuation key={index} balanceFluctuation={item} />;
    });
    return (
        <div className={style.parent}>
            <div>{currentDate}</div>
            <div>{list_balanceFluctuation}</div>
        </div>
    );
};

export default memo(ACluster);
