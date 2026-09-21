import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { MEMBER } from '@src/const/text';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';
import AddMember from './component/AddMember';
import MemberList from './component/MemberList';
import { IoChevronBack } from 'react-icons/io5';
import { route_enum } from '@src/router/type';
import { setData_toastMessage } from '@src/redux/slice/Member';

const Member = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
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
                    <div>{MEMBER}</div>
                    <IoChevronBack onClick={() => handleBack()} size={20} color="white" />
                </div>
                <AddMember />
                <MemberList />
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
            </div>
        </div>
    );
};

export default Member;
