import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { Balance_Fluctuation_Field } from '@src/data_struct/wallet';
import ABalanceFluctuation from './component/ABalanceFluctuation';
import { detailTime } from '@src/utility/time';

const ACluster: FC<{ balance_fluctuations: Balance_Fluctuation_Field[] }> = ({ balance_fluctuations }) => {
    const [this_day, set__this_day] = useState<string>('');

    useEffect(() => {
        if (balance_fluctuations.length === 0) return;

        const value = detailTime(balance_fluctuations[0].create_time);
        const date = value.split(' ')[1];
        set__this_day(date);
    }, [balance_fluctuations]);

    const list_balanceFluctuation = balance_fluctuations.map((item, index) => {
        return <ABalanceFluctuation key={index} balance_fluctuation={item} />;
    });
    return (
        <div className={style.parent}>
            <div>{this_day}</div>
            <div>{list_balanceFluctuation}</div>
        </div>
    );
};

export default memo(ACluster);
