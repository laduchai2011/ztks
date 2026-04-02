import { FC, memo } from 'react';
import style from './style.module.scss';
import { formatMoney } from '@src/utility/string';
import { WalletField } from '@src/dataStruct/wallet';

const Overview: FC<{ wallet: WalletField }> = ({ wallet }) => {
    return (
        <div className={style.parent}>
            <div className={style.money}>{formatMoney(wallet.amount)}</div>
            <div className={style.transfer}>
                <div>Rút tiền</div>
            </div>
        </div>
    );
};

export default memo(Overview);
