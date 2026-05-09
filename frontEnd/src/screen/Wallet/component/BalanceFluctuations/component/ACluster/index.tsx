import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { BalanceFluctuationField } from '@src/dataStruct/wallet';
import ABalanceFluctuation from './component/ABalanceFluctuation';
import { detailTime } from '@src/utility/time';

const ACluster: FC<{ balanceFluctuations: BalanceFluctuationField[] }> = ({ balanceFluctuations }) => {
    const [thisDay, setThisDay] = useState<string>('');

    useEffect(() => {
        if (balanceFluctuations.length === 0) return;

        const value = detailTime(balanceFluctuations[0].createTime);
        const date = value.split(' ')[1];
        setThisDay(date);
    }, [balanceFluctuations]);

    const list_balanceFluctuation = balanceFluctuations.map((item, index) => {
        return <ABalanceFluctuation key={index} balanceFluctuation={item} />;
    });
    return (
        <div className={style.parent}>
            <div>{thisDay}</div>
            <div>{list_balanceFluctuation}</div>
        </div>
    );
};

export default memo(ACluster);
