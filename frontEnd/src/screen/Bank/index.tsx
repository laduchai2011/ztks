import style from './style.module.scss';
import { BANK } from '@src/const/text';
import MyLoading from './component/MyLoading';
import MyToastMessage from './component/MyToastMessage';
import AddBank from './component/AddBank';
import BankList from './component/BankList';
import EditBankDialog from './component/EditBankDialog';
import DeleteBankDialog from './component/DeleteBankDialog';

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
                <EditBankDialog />
                <DeleteBankDialog />
            </div>
        </div>
    );
};

export default Bank;
