import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { ACCOUNT_RECEIVE_MESSAGE } from '@src/const/text';
import OaList from './component/OaList';
import Selected from './component/Selected';
import List from './component/List';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';
import { route_enum } from '@src/router/type';
import { setData_toastMessage } from '@src/redux/slice/AccountReceiveMessage';

const AccountReceiveMessage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const myId = sessionStorage.getItem('myId');

    useEffect(() => {
        if (myId === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, myId]);

    useEffect(() => {
        return () => {
            dispatch(setData_toastMessage({ type: undefined, message: '' }));
        };
    }, [dispatch]);

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
