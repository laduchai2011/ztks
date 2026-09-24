import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { Balance_Fluctuation_Field, Balance_Fluctuation_Enum } from '@src/data_struct/wallet';
import { formatMoney } from '@src/utility/string';
import { detailTime } from '@src/utility/time';

const ABalanceFluctuation: FC<{ balance_fluctuation: Balance_Fluctuation_Field }> = ({ balance_fluctuation }) => {
    const pay_hook_id = balance_fluctuation.pay_hook_id;
    const [type_text, set__type_text] = useState<string>('');

    useEffect(() => {
        const type = balance_fluctuation.type;
        if (type === Balance_Fluctuation_Enum.PAY_ORDER) {
            set__type_text('Thanh toán đơn hàng');
        }
        if (type === Balance_Fluctuation_Enum.PAY_AGENT) {
            set__type_text('Thanh toán dịch vụ');
        }
        if (type === Balance_Fluctuation_Enum.RECOMMEND) {
            set__type_text('Giới thiệu thành công');
        }
        if (type === Balance_Fluctuation_Enum.VOUCHER) {
            set__type_text('Hoàn tiền voucher');
        }
        if (type === Balance_Fluctuation_Enum.COST1) {
            set__type_text('Khấu trừ 1%');
        }
        if (type === Balance_Fluctuation_Enum.TAKE_MONEY) {
            set__type_text('Rút tiền');
        }
        if (type === Balance_Fluctuation_Enum.COST_TAKE_MONEY5) {
            set__type_text('Phí rút tiền');
        }
    }, [balance_fluctuation]);

    const handle_Amount_Color = () => {
        const amount = balance_fluctuation.amount;
        if (amount > 0) {
            return style.iColor;
        } else {
            return style.dColor;
        }
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={`${style.amount} ${handle_Amount_Color()}`}>
                    {formatMoney(balance_fluctuation.amount)}
                </div>
                <div className={style.infor}>
                    <div className={style.type}>{type_text}</div>
                    {pay_hook_id && <div className={style.hook}>{pay_hook_id}</div>}
                </div>
            </div>
            <div className={style.timeAgo}>
                <div>{detailTime(balance_fluctuation.create_time)}</div>
            </div>
        </div>
    );
};

export default memo(ABalanceFluctuation);
