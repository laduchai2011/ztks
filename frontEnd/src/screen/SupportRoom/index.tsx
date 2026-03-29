import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { SUPPORT_ROOM } from '@src/const/text';
import Header from '../Header';
import OaList from './component/OaList';
import RoomList from './component/RoomList';
import { select_enum } from '@src/router/type';
import { route_enum } from '@src/router/type';

const SupportRoom = () => {
    const navigate = useNavigate();
    const myId = sessionStorage.getItem('myId');

    useEffect(() => {
        if (myId === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, myId]);

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>{SUPPORT_ROOM}</div>
                <OaList />
                <RoomList />
                <div className={style.headerTab}>
                    <Header selected={select_enum.SUPPORT_ROOM} />
                </div>
            </div>
        </div>
    );
};

export default SupportRoom;
