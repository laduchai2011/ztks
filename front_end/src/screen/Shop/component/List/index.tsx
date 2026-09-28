import { memo } from 'react';
import style from './style.module.scss';
import { IoMdAdd } from 'react-icons/io';
import ShopList from './component/ShopList';

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
        </div>
    );
};

export default memo(List);
