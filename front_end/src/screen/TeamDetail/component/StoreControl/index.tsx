import { memo } from 'react';
import style from './style.module.scss';
import TeamShopList from './component/TeamShopList';
import TeamShopDepotList from './component/TeamShopDepotList';
import StoreList from './component/StoreList';
// import SelectedShop from './component/SelectedShop';
// import SelectedDepot from './component/SelectedDepot';
// import SelectedStore from './component/SelectedStore';

const StoreControl = () => {
    return (
        <div className={style.parent}>
            <TeamShopList />
            <TeamShopDepotList />
            <StoreList />
            {/* <SelectedShop />
            <SelectedDepot />
            <SelectedStore /> */}
        </div>
    );
};

export default memo(StoreControl);
