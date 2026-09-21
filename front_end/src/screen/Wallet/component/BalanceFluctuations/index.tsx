import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { WalletField, BalanceFluctuationField } from '@src/dataStruct/wallet';
import { SEE_MORE } from '@src/const/text';
import { useLazyGetBalanceFluctuationsQuery } from '@src/redux/query/walletRTK';
import ACluster from './component/ACluster';
import { setData_toastMessage, set_isLoading } from '@src/redux/slice/Wallet';
import { messageType_enum } from '@src/component/ToastMessage/type';

const BalanceFluctuations: FC<{ wallet: WalletField }> = ({ wallet }) => {
    const dispatch = useDispatch<AppDispatch>();
    const [clusters, setClusters] = useState<BalanceFluctuationField[][]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);

    const [getBalanceFluctuations] = useLazyGetBalanceFluctuationsQuery();

    useEffect(() => {
        setClusters([]);
        setHasMore(true);
    }, [wallet]);

    useEffect(() => {
        getBalanceFluctuations({ page: page, size: 1, walletId: wallet.id })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    if (page === 1) {
                        setClusters([resData.data]);
                    } else {
                        setClusters((prev) => [...prev, resData.data ?? []]);
                    }
                    setHasMore(true);
                } else {
                    setHasMore(false);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(setData_toastMessage({ type: messageType_enum.ERROR, message: 'Đã có lỗi xảy ra !' }));
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    }, [dispatch, getBalanceFluctuations, wallet, page]);

    const handleSeeMore = () => {
        if (!hasMore) return;
        setPage((prev) => prev + 1);
    };

    const list_cluster = clusters.map((item, index) => {
        return <ACluster key={index} balanceFluctuations={item} />;
    });

    return (
        <div className={style.parent}>
            <div className={style.list}>
                <div className={style.cluster}>{list_cluster}</div>
            </div>
            <div className={style.btnContainer}>{hasMore && <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(BalanceFluctuations);
