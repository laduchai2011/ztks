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
import LeaveAdmin from './component/LeaveAdmin';
import { IoChevronBack } from 'react-icons/io5';
import { set__data__toast_message } from '@src/redux/slice/Leave';
import { route_enum } from '@src/router/type';

const Leave = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const my_id = sessionStorage.getItem('myId');

    useEffect(() => {
        if (my_id === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, my_id]);

    useEffect(() => {
        dispatch(
            set__data__toast_message({
                type: undefined,
                message: '',
            })
        );
    }, [dispatch]);

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>
                    <div>{LEAVE}</div>
                    <IoChevronBack onClick={() => handleBack()} size={20} color="white" />
                </div>
                <LeaveAllChatSession />
                <LeaveAllAccountReceiveMessage />
                <LeaveAllChatRoom />
                <LeaveAdmin />
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
            </div>
        </div>
    );
};

export default Leave;
