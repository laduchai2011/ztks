import style from './style.module.scss';
import Header from '../Header';
import { select_enum } from '@src/router/type';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';
import Filter from './component/Filter';
import List from './component/List';
import VoucherList from './component/VoucherList';

const Order = () => {
    return (
        <div className={style.parent}>
            <div className={style.main}>
                <Header selected={select_enum.ORDER} />
                <Filter />
                <List />
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
                <VoucherList />
            </div>
        </div>
    );
};

export default Order;
