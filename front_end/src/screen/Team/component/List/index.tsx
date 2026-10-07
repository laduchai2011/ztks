import { memo } from 'react';
import style from './style.module.scss';
import OneTeam from './component/OneTeam';

const List = () => {
    return (
        <div className={style.parent}>
            <div>
                <OneTeam />
            </div>
            <div>
                <OneTeam />
            </div>
            <div>
                <OneTeam />
            </div>
            <div>
                <OneTeam />
            </div>
            <div>
                <OneTeam />
            </div>
            <div>
                <OneTeam />
            </div>
            <div>
                <OneTeam />
            </div>
            <div>
                <OneTeam />
            </div>
            <div>
                <OneTeam />
            </div>
            <div>
                <OneTeam />
            </div>
        </div>
    );
};

export default memo(List);
