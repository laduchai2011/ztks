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
import { IoChevronBack } from 'react-icons/io5';
import { route_enum } from '@src/router/type';
import { set__data__toast_message } from '@src/redux/slice/Account_Receive_Message';

const AccountReceiveMessage = () => {
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
                    <div>{ACCOUNT_RECEIVE_MESSAGE}</div>
                    <IoChevronBack onClick={() => handle_Back()} size={20} color="white" />
                </div>
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
