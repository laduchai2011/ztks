import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';
import CreateCheckInOut from './component/CreateCheckInOut';
import CheckList from './component/CheckList';
import { IoChevronBack } from 'react-icons/io5';
import { route_enum } from '@src/router/type';
import { setData_toastMessage } from '@src/redux/slice/DashBoard';

const CheckInOut = () => {
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
            dispatch(
                setData_toastMessage({
                    type: undefined,
                    message: '',
                })
            );
        };
    }, [dispatch]);

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>
                    <div>Check In/Out</div>
                    <IoChevronBack onClick={() => handleBack()} size={20} color="white" />
                </div>
                <CreateCheckInOut />
                <CheckList />
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
            </div>
        </div>
    );
};

export default CheckInOut;
