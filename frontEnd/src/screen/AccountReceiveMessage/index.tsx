import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { ACCOUNT_RECEIVE_MESSAGE } from '@src/const/text';
import OaList from './component/OaList';
import Selected from './component/Selected';
import List from './component/List';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';
import { route_enum } from '@src/router/type';

const AccountReceiveMessage = () => {
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
                <div className={style.header}>{ACCOUNT_RECEIVE_MESSAGE}</div>
                <OaList />
                <Selected />
                <List />
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
            </div>
        </div>
    );
};

export default AccountReceiveMessage;
