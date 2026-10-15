import { memo } from 'react';
import style from './style.module.scss';
import { IoIosAddCircleOutline } from 'react-icons/io';
import OneStore from './component/OneStore';
import { SEE_MORE } from '@src/const/text';

const StoreList = () => {
    return (
        <div className={style.parent}>
            <div className={style.header}>
                <IoIosAddCircleOutline size={20} color="green" />
                <div>Danh sách gian hàng</div>
            </div>
            <div className={style.list}>
                <OneStore />
                <OneStore />
                <OneStore />
                <OneStore />
                <OneStore />
                <OneStore />
                <OneStore />
                <OneStore />
                <OneStore />
                <OneStore />
                <OneStore />
                <OneStore />
                <OneStore />
                <OneStore />
                <OneStore />
            </div>
            <div className={style.see_more}>{SEE_MORE}</div>
        </div>
    );
};

export default memo(StoreList);
