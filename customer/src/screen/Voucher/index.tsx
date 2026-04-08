import style from './style.module.scss';
import Header from '../Header';
import { select_enum } from '@src/router/type';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';
import Filter from './component/Filter';
import List from './component/List';

const Voucher = () => {
    return (
        <div className={style.parent}>
            <div className={style.main}>
                <Header selected={select_enum.VOUCHER} />
                <Filter />
                <List />
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
            </div>
        </div>
    );
};

export default Voucher;
