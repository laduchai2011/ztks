import { memo } from 'react';
import style from './style.module.scss';

const OneTeam = () => {
    return (
        <div className={style.parent}>
            <div className={style.name}>nane</div>
            <div className={style.type}>type</div>
        </div>
    );
};

export default memo(OneTeam);
