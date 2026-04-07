import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import CreateVoucher from './component/CreateVoucher';
import { route_enum, select_enum } from '@src/router/type';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';

const Voucher = () => {
    const navigate = useNavigate();
    const myId = sessionStorage.getItem('myId');

    useEffect(() => {
        if (myId === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, myId]);

    return (
        <div className={style.parent}>
            <Header selected={select_enum.VOUCHER} />
            <div className={style.main}>
                <CreateVoucher />
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
            </div>
        </div>
    );
};

export default Voucher;
