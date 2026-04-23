import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import { route_enum, select_enum } from '@src/router/type';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';
import Filter from './component/Filter';
import List from './component/List';

const RequireTakeMoney = () => {
    const navigate = useNavigate();
    const myId = sessionStorage.getItem('myId');

    useEffect(() => {
        if (myId === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, myId]);

    return (
        <div className={style.parent}>
            <Header selected={select_enum.REQUIRE_TAKE_MONEY} />
            <div className={style.main}>
                <Filter />
                <List />
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
            </div>
        </div>
    );
};

export default RequireTakeMoney;
