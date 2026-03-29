import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { ORDER } from '@src/const/text';
import CreateOrder from './component/CreateOrder';
import OaList from './component/OaList';
import OrderList from './component/OrderList';
import EditOrder from './component/EditOrder';
import Pay from './component/Pay';
import AddOrderStatusDialog from './component/AddOrderStatusDialog';
import { select_enum } from '@src/router/type';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';
import Header from '../Header';
import { setData_toastMessage } from '@src/redux/slice/Order';
import { route_enum } from '@src/router/type';

const Order = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const myId = sessionStorage.getItem('myId');

    useEffect(() => {
        if (myId === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, myId]);

    useEffect(() => {
        dispatch(
            setData_toastMessage({
                type: undefined,
                message: '',
            })
        );
    }, [dispatch]);

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>{ORDER}</div>
                <OaList />
                <CreateOrder />
                <OrderList />
                <div className={style.headerTab}>
                    <Header selected={select_enum.ORDER} />
                </div>
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
                <EditOrder />
                <Pay />
                <AddOrderStatusDialog />
            </div>
        </div>
    );
};

export default Order;
