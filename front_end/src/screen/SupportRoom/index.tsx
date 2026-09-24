import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { SUPPORT_ROOM } from '@src/const/text';
import Header from '../Header';
import OaList from './component/OaList';
import RoomList from './component/RoomList';
import { IoChevronBack } from 'react-icons/io5';
import { select_enum } from '@src/router/type';
import { route_enum } from '@src/router/type';
import { set__data__toast_message } from '@src/redux/slice/Support_Room';

const SupportRoom = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const my_id = sessionStorage.getItem('myId');

    useEffect(() => {
        if (my_id === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, my_id]);

    useEffect(() => {
        return () => {
            dispatch(set__data__toast_message({ type: undefined, message: '' }));
        };
    }, [dispatch]);

    const handle_Back = () => {
        navigate(-1);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>
                    <div>{SUPPORT_ROOM}</div>
                    <IoChevronBack onClick={() => handle_Back()} size={20} color="white" />
                </div>
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
