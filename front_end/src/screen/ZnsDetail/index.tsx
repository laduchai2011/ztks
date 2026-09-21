import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { route_enum } from '@src/router/type';
import { setData_toastMessage } from '@src/redux/slice/Zns';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';
import OverView from './component/OverView';
import ZnsMessageList from './component/ZnsMessageList';
import { IoChevronBack } from 'react-icons/io5';

const ZnsDetail = () => {
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

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>
                    <div>ZNS chi tiết</div>
                    <IoChevronBack onClick={() => handleBack()} size={20} color="white" />
                </div>
                <OverView />
                <ZnsMessageList />
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
            </div>
        </div>
    );
};

export default ZnsDetail;
