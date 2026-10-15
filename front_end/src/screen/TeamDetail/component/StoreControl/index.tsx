import { memo } from 'react';
import style from './style.module.scss';
import ShopList from './component/ShopList';
import DepotList from './component/DepotList';
import StoreList from './component/StoreList';
// import SelectedShop from './component/SelectedShop';
// import SelectedDepot from './component/SelectedDepot';
// import SelectedStore from './component/SelectedStore';

const StoreControl = () => {
    return (
        <div className={style.parent}>
            <ShopList />
            <DepotList />
            <StoreList />
            {/* <SelectedShop />
            <SelectedDepot />
            <SelectedStore /> */}
        </div>
    );
};

export default memo(StoreControl);
