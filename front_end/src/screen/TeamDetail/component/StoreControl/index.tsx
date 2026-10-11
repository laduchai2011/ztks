import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { FaLock, FaLockOpen } from 'react-icons/fa';

const StoreControl = () => {
    return (
        <div className={style.parent}>
            <div className={style.option}>
                <div className={style.text}>Cửa hàng</div>
                <div className={style.btn}>Chọn</div>
                <div className={style.icons}>
                    <FaLock size={20} color="red" />
                    <FaLockOpen size={20} color="gray" />
                </div>
                <div>sdsdgsdg</div>
            </div>
            <div className={style.option}>
                <div className={style.text}>Chọn kho</div>
                <div className={style.btn}>Chọn</div>
                <div className={style.icons}>
                    <FaLock size={20} color="red" />
                    <FaLockOpen size={20} color="gray" />
                </div>
                <div>sdsdgsdg</div>
            </div>
            <div className={style.option}>
                <div className={style.text}>Chọn gian</div>
                <div className={style.btn}>Chọn</div>
                <div className={style.icons}>
                    <FaLock size={20} color="red" />
                    <FaLockOpen size={20} color="gray" />
                </div>
                <div>sdsdgsdg</div>
            </div>
        </div>
    );
};

export default memo(StoreControl);
