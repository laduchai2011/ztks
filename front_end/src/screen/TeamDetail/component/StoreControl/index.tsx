import { memo } from 'react';
import style from './style.module.scss';
import SelectedShop from './component/SelectedShop';
import SelectedDepot from './component/SelectedDepot';
import SelectedStore from './component/SelectedStore';

const StoreControl = () => {
    return (
        <div className={style.parent}>
            <SelectedShop />
            <SelectedDepot />
            <SelectedStore />
        </div>
    );
};

export default memo(StoreControl);
