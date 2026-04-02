import { useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { WALLET } from '@src/const/text';
import BalanceFluctuations from './component/BalanceFluctuations';
import { route_enum } from '@src/router/type';
import Overview from './component/Overview';
import { useLazyGetMyWalletWithTypeQuery } from '@src/redux/query/walletRTK';
import { AccountField } from '@src/dataStruct/account';
import { WalletField, WalletType, WalletEnum } from '@src/dataStruct/wallet';

const Wallet = () => {
    const navigate = useNavigate();
    const myId = sessionStorage.getItem('myId');
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);

    const [selectedType, setSelectedType] = useState<WalletType>(WalletEnum.ONE);
    const [selectedWallet, setSelectedWallet] = useState<WalletField | undefined>(undefined);

    const [getMyWalletWithType] = useLazyGetMyWalletWithTypeQuery();

    useEffect(() => {
        if (myId === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, myId]);

    const handleSlectedClass = (type: WalletType) => {
        if (type === selectedType) {
            return style.selected;
        }
    };

    const handleSelectedType = (type: WalletType) => {
        setSelectedType(type);
    };

    useEffect(() => {
        if (!account) return;
        getMyWalletWithType({ type: selectedType, accountId: account.id })
            .then((res) => {
                const resData = res.data;

                if (resData?.isSuccess && resData.data) {
                    setSelectedWallet(resData.data);
                }
            })
            .catch((err) => {
                console.log('getAllWallets err: ', err);
            });
    }, [getMyWalletWithType, account, selectedType]);

    useEffect(() => {
        // console.log('selectedWallet', selectedWallet);
    }, [selectedWallet]);

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>{WALLET}</div>
                <div className={style.contentContainer}>
                    <div className={style.types}>
                        <div
                            className={handleSlectedClass(WalletEnum.ONE)}
                            onClick={() => handleSelectedType(WalletEnum.ONE)}
                        >{`${WALLET} 1`}</div>
                        <div
                            className={handleSlectedClass(WalletEnum.TWO)}
                            onClick={() => handleSelectedType(WalletEnum.TWO)}
                        >{`${WALLET} 2`}</div>
                    </div>
                    {selectedWallet && <Overview wallet={selectedWallet} />}
                    {selectedWallet && <BalanceFluctuations wallet={selectedWallet} />}
                </div>
            </div>
        </div>
    );
};

export default Wallet;
