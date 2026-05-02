import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { LEAVE } from '@src/const/text';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';
import LeaveAllChatSession from './component/LeaveAllChatSession';
import LeaveAllAccountReceiveMessage from './component/LeaveAllAccountReceiveMessage';
import LeaveAllChatRoom from './component/LeaveAllChatRoom';
import { setData_toastMessage } from '@src/redux/slice/Leave';
import { route_enum } from '@src/router/type';

const Leave = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const myId = sessionStorage.getItem('myId');

    useEffect(() => {
        if (myId === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, myId]);

    useEffect(() => {
        dispatch(
            setData_toastMessage({
                type: undefined,
                message: '',
            })
        );
    }, [dispatch]);

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>{LEAVE}</div>
                <LeaveAllChatSession />
                <LeaveAllAccountReceiveMessage />
                <LeaveAllChatRoom />
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
            </div>
        </div>
    );
};

export default Leave;
