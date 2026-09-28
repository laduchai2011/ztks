import { memo } from 'react';
import style from './style.module.scss';
import { CiEdit } from 'react-icons/ci';

const ShopList = () => {
    return (
        <div className={style.parent}>
            <div className={style.oneRow}>
                <div className={style.infor1}>
                    <div className={style.index}>index</div>
                    <div className={style.icons}>
                        <CiEdit size={20} color="greenyellow" />
                    </div>
                </div>
                <div className={style.infor2}>
                    <div className={style.name}>name</div>
                    <div className={style.des}>description</div>
                    <div className={style.content}>content</div>
                    <div className={style.address}>address</div>
                    <div className={style.phone}>phone</div>
                </div>
            </div>
        </div>
    );
};

export default memo(ShopList);
