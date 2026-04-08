import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import { route_enum, select_enum } from '@src/router/type';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <Header selected={select_enum.HOME} />
            </div>
        </div>
    );
};

export default Home;
