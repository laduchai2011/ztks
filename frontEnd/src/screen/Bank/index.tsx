import style from './style.module.scss';
import { BANK } from '@src/const/text';
import MyLoading from './component/MyLoading';
import MyToastMessage from './component/MyToastMessage';

const Bank = () => {
    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>{BANK}</div>
                <div>Bank</div>
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
            </div>
        </div>
    );
};

export default Bank;
