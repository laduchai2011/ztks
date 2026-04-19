import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import { route_enum, select_enum } from '@src/router/type';

const Home = () => {
    const navigate = useNavigate();
    const myId = sessionStorage.getItem('myId');

    useEffect(() => {
        if (myId === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, myId]);

    const bank = 'TCB';
    const account = '19033101290022';

    const qrUrl = `https://img.vietqr.io/image/${bank}-${account}-compact2.png?amount=10000&addInfo=takeMoney&accountName=NGUYEN%20VAN%20A`;

    return (
        <div className={style.parent}>
            <Header selected={select_enum.HOME} />
            <div className={style.main}>dasdas</div>
            <div>
                <img src={qrUrl} alt="QR Code" />
            </div>
        </div>
    );
};

export default Home;
