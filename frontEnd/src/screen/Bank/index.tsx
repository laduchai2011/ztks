import style from './style.module.scss';
import { BANK } from '@src/const/text';
import MyLoading from './component/MyLoading';
import MyToastMessage from './component/MyToastMessage';
import AddBank from './component/AddBank';
import BankList from './component/BankList';
import EditBank from './component/EditBank';

const Bank = () => {
    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>{BANK}</div>
                <AddBank />
                <BankList />
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
                <EditBank />
            </div>
        </div>
    );
};

export default Bank;
