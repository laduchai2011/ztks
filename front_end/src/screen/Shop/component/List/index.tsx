import { memo } from 'react';
import style from './style.module.scss';
import { IoMdAdd } from 'react-icons/io';
import ShopList from './component/ShopList';
import DepotList from './component/DepotList';
import StoreList from './component/StoreList';

const List = () => {
    return (
        <div className={style.parent}>
            <div className={style.block}>
                <div className={style.header}>
                    <div>Danh sách cửa hàng</div>
                    <IoMdAdd size={25} color="green" />
                </div>
                <div>
                    <ShopList />
                </div>
            </div>
            <div className={style.block}>
                <div className={style.header}>
                    <div>Danh sách kho</div>
                    <IoMdAdd size={25} color="green" />
                </div>
                <div>
                    <DepotList />
                </div>
            </div>
            <div className={style.block}>
                <div className={style.header}>
                    <div>Gian hàng</div>
                    <IoMdAdd size={25} color="green" />
                </div>
                <div>
                    <StoreList />
                </div>
            </div>
        </div>
    );
};

export default memo(List);
