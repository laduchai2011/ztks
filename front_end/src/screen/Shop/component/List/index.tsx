import { memo } from 'react';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { IoMdAdd } from 'react-icons/io';
import ShopList from './component/ShopList';
import DepotList from './component/DepotList';
import StoreList from './component/StoreList';
import { set__is_show_create_shop, set__is_show_create_depot, set__is_show_create_store } from '@src/redux/slice/Shop';

const List = () => {
    const dispatch = useDispatch<AppDispatch>();

    const open_Add_Shop = () => {
        dispatch(set__is_show_create_shop(true));
    };

    const open_Add_Depot = () => {
        dispatch(set__is_show_create_depot(true));
    };

    const open_Add_Store = () => {
        dispatch(set__is_show_create_store(true));
    };

    return (
        <div className={style.parent}>
            <div className={style.block}>
                <div className={style.header}>
                    <div>Danh sách cửa hàng</div>
                    <IoMdAdd onClick={() => open_Add_Shop()} size={25} color="green" />
                </div>
                <div>
                    <ShopList />
                </div>
            </div>
            <div className={style.block}>
                <div className={style.header}>
                    <div>Danh sách kho</div>
                    <IoMdAdd onClick={() => open_Add_Depot()} size={25} color="green" />
                </div>
                <div>
                    <DepotList />
                </div>
            </div>
            <div className={style.block}>
                <div className={style.header}>
                    <div>Gian hàng</div>
                    <IoMdAdd onClick={() => open_Add_Store()} size={25} color="green" />
                </div>
                <div>
                    <StoreList />
                </div>
            </div>
        </div>
    );
};

export default memo(List);
