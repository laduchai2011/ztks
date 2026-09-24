import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { Wallet_Field, Balance_Fluctuation_Field } from '@src/data_struct/wallet';
import { SEE_MORE } from '@src/const/text';
import { useLazy_get_Balance_Fluctuations_Query } from '@src/redux/query/wallet_RTK';
import ACluster from './component/ACluster';
import { set__data__toast_message, set__is_loading } from '@src/redux/slice/Wallet';
import { messageType_enum } from '@src/component/ToastMessage/type';

const BalanceFluctuations: FC<{ wallet: Wallet_Field }> = ({ wallet }) => {
    const dispatch = useDispatch<AppDispatch>();

    const [clusters, set__clusters] = useState<Balance_Fluctuation_Field[][]>([]);
    const [has_more, set__has_more] = useState<boolean>(true);
    const [page, set__page] = useState<number>(1);

    const [get_Balance_Fluctuations] = useLazy_get_Balance_Fluctuations_Query();

    useEffect(() => {
        set__clusters([]);
        set__has_more(true);
    }, [wallet]);

    useEffect(() => {
        get_Balance_Fluctuations({ page: page, size: 1, wallet_id: wallet.id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    if (page === 1) {
                        set__clusters([res_data.data]);
                    } else {
                        set__clusters((prev) => [...prev, res_data.data ?? []]);
                    }
                    set__has_more(true);
                } else {
                    set__has_more(false);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(set__data__toast_message({ type: messageType_enum.ERROR, message: 'Đã có lỗi xảy ra !' }));
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    }, [dispatch, get_Balance_Fluctuations, wallet, page]);

    const handle_See_More = () => {
        if (!has_more) return;
        set__page((prev) => prev + 1);
    };

    const list_cluster = clusters.map((item, index) => {
        return <ACluster key={index} balance_fluctuations={item} />;
    });

    return (
        <div className={style.parent}>
            <div className={style.list}>
                <div className={style.cluster}>{list_cluster}</div>
            </div>
            <div className={style.btnContainer}>
                {has_more && <div onClick={() => handle_See_More()}>{SEE_MORE}</div>}
            </div>
        </div>
    );
};

export default memo(BalanceFluctuations);
