import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { ORDER } from '@src/const/text';
import CreateOrder from './component/CreateOrder';
import OrderList from './component/OrderList';
import EditOrder from './component/EditOrder';
import Pay from './component/Pay';
import VoucherList from './component/VoucherList';
import AddOrderStatusDialog from './component/AddOrderStatusDialog';
import { select_enum } from '@src/router/type';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';
import Header from '../Header';
import { IoChevronBack } from 'react-icons/io5';
import { set__data__toast_message } from '@src/redux/slice/Order';
import { route_enum } from '@src/router/type';

const Order = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const my_id = sessionStorage.getItem('myId');

    useEffect(() => {
        if (my_id === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, my_id]);

    useEffect(() => {
        dispatch(
            set__data__toast_message({
                type: undefined,
                message: '',
            })
        );
    }, [dispatch]);

    const handle_Back = () => {
        navigate(-1);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>
                    <div>{ORDER}</div>
                    <IoChevronBack onClick={() => handle_Back()} size={20} color="white" />
                </div>
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
                <VoucherList />
            </div>
        </div>
    );
};

export default Order;
