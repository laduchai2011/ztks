import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { HOME } from '@src/const/text';
import Header from '../Header';
import OaList from './component/OaList';
import { select_enum } from '@src/router/type';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';
import UserList from './component/UserList';
import { route_enum } from '@src/router/type';

const Home1 = () => {
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
                <div className={style.header}>{HOME}</div>
                <OaList />
                <UserList />
                <div className={style.headerTab}>
                    <Header selected={select_enum.HOME} />
                </div>
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
            </div>
        </div>
    );
};

export default Home1;
