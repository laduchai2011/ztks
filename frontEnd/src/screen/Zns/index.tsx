import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { route_enum, select_enum } from '@src/router/type';
import Header from '../Header';
import ZnsList from './component/ZnsList';
import CreateZns from './component/CreateZns';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';

const Zns = () => {
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
                <div className={style.header}>ZNS</div>
                <CreateZns />
                <ZnsList />
                <div className={style.headerTab}>
                    <Header selected={select_enum.ZNS} />
                </div>
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
            </div>
        </div>
    );
};

export default Zns;
