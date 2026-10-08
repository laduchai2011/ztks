import { memo, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { avatarnull } from '@src/utility/string';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { route_enum } from '@src/router/type';

const OneTeam = () => {
    const navigate = useNavigate();

    const [is_lock, set__is_lock] = useState(true);

    const handle_Lock = () => {
        set__is_lock(true);
    };

    const handle_Un_Lock = () => {
        set__is_lock(false);
    };

    const handle_Go_To_Team_Detail = () => {
        navigate(`${route_enum.TEAM_DETAIL}/1`);
    };

    return (
        <div className={style.parent} onClick={() => handle_Go_To_Team_Detail()}>
            <div className={style.name}>nane</div>
            <div className={style.type}>
                <div>type</div>
                <div>
                    {is_lock && <FaLock onClick={() => handle_Un_Lock()} color="red" />}
                    {!is_lock && <FaLockOpen onClick={() => handle_Lock()} color="gray" />}
                </div>
            </div>
            <div className={style.team_leader}>
                <img src={avatarnull} alt="avatar" />
                <div>team leader</div>
            </div>
        </div>
    );
};

export default memo(OneTeam);
