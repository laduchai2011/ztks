import { memo } from 'react';
import style from './style.module.scss';
import { IoIosAddCircleOutline } from 'react-icons/io';
import OneTeamShopDepot from './component/OneTeamShopDepot';
import { SEE_MORE } from '@src/const/text';

const DepotList = () => {
    return (
        <div className={style.parent}>
            <div className={style.header}>
                <IoIosAddCircleOutline size={20} color="green" />
                <div>Danh sách kho</div>
            </div>
            <div className={style.list}>
                {/* <OneTeamShopDepot />
                <OneTeamShopDepot />
                <OneTeamShopDepot />
                <OneTeamShopDepot />
                <OneTeamShopDepot />
                <OneTeamShopDepot />
                <OneTeamShopDepot />
                <OneTeamShopDepot />
                <OneTeamShopDepot />
                <OneTeamShopDepot />
                <OneTeamShopDepot />
                <OneTeamShopDepot />
                <OneTeamShopDepot />
                <OneTeamShopDepot />
                <OneTeamShopDepot /> */}
            </div>
            <div className={style.see_more}>{SEE_MORE}</div>
        </div>
    );
};

export default memo(DepotList);
