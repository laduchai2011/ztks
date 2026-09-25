import { useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { WALLET } from '@src/const/text';
import BalanceFluctuations from './component/BalanceFluctuations';
import { route_enum } from '@src/router/type';
import MyLoading from './component/MyLoading';
import MyToastMessage from './component/MyToastMessage';
import Overview from './component/Overview';
import CurrentAgent from './component/CurrentAgent';
import AddRecommend from './component/AddRecommend';
import TakeMoneyDialog from './component/TakeMoneyDialog';
import { IoChevronBack } from 'react-icons/io5';
import { useLazy_get_My_Wallet_With_Type_Query } from '@src/redux/query/wallet_RTK';
import { Account_Field } from '@src/data_struct/account';
import { Wallet_Field, Wallet_Type, Wallet_Enum } from '@src/data_struct/wallet';
import { set__data__toast_message } from '@src/redux/slice/Wallet';

const Wallet = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const my_id = sessionStorage.getItem('myId');

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);

    const [selected_type, set__selected_type] = useState<Wallet_Type>(Wallet_Enum.ONE);
    const [selected_wallet, set__selected_wallet] = useState<Wallet_Field | undefined>(undefined);

    const [get_My_Wallet_With_Type] = useLazy_get_My_Wallet_With_Type_Query();

    useEffect(() => {
        if (my_id === null) {
            navigate(route_enum.SIGNIN);
        }

        return () => {
            dispatch(
                set__data__toast_message({
                    message: '',
                    type: undefined,
                })
            );
        };
    }, [navigate, my_id, dispatch]);

    const handle_Slected_Class = (type: Wallet_Type) => {
        if (type === selected_type) {
            return style.selected;
        }
    };

    const handle_Selected_Type = (type: Wallet_Type) => {
        set__selected_type(type);
    };

    useEffect(() => {
        if (!account) return;
        get_My_Wallet_With_Type({ type: selected_type, account_id: account.id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__selected_wallet(res_data.data);
                }
            })
            .catch((err) => {
                console.log('getAllWallets err: ', err);
            });
    }, [get_My_Wallet_With_Type, account, selected_type]);

    const handle_Back = () => {
        navigate(-1);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>
                    <div>{WALLET}</div>
                    <IoChevronBack onClick={() => handle_Back()} size={20} color="white" />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.types}>
                        <div
                            className={handle_Slected_Class(Wallet_Enum.ONE)}
                            onClick={() => handle_Selected_Type(Wallet_Enum.ONE)}
                        >{`${WALLET} 1`}</div>
                        <div
                            className={handle_Slected_Class(Wallet_Enum.TWO)}
                            onClick={() => handle_Selected_Type(Wallet_Enum.TWO)}
                        >{`${WALLET} 2`}</div>
                    </div>
                    {selected_wallet && <Overview wallet={selected_wallet} />}
                    {selected_wallet && <CurrentAgent wallet={selected_wallet} set__wallet={set__selected_wallet} />}
                    {selected_wallet && <AddRecommend wallet={selected_wallet} />}
                    {selected_wallet && <BalanceFluctuations wallet={selected_wallet} />}
                </div>
            </div>
            <div>
                <MyLoading />
                <MyToastMessage />
                <TakeMoneyDialog />
            </div>
        </div>
    );
};

export default Wallet;
