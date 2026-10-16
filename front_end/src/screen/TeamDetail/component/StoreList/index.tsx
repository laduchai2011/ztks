import { memo } from 'react';
import style from './style.module.scss';
import TeamShopList from './component/TeamShopList';
import TeamShopDepotList from './component/TeamShopDepotList';
import TeamShopDepotStoreList from './component/TeamShopDepotStoreList';

const StoreControl = () => {
    return (
        <div className={style.parent}>
            <TeamShopList />
            <TeamShopDepotList />
            <TeamShopDepotStoreList />
        </div>
    );
};

export default memo(StoreControl);
