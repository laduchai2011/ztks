import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { REGISTER_POST } from '@src/const/text';
import MyLoading from './component/MyLoading';
import MyToastMessage from './component/MyToastMessage';
import { set__data__toast_message } from '@src/redux/slice/Post';
import { route_enum } from '@src/router/type';
import CreateRegisterPost from './component/CreateRegisterPost';
import Filter from './component/Filter';
import RegisterPostList from './component/RegisterPostList';
import EditRegisterPostDialog from './component/EditRegisterPostDialog';
import DeleteRegisterPostDialog from './component/DeleteRegisterPostDialog';
import { IoChevronBack } from 'react-icons/io5';

const RegisterPost = () => {
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
                    <div>{REGISTER_POST}</div>
                    <IoChevronBack onClick={() => handle_Back()} size={20} color="white" />
                </div>
                <CreateRegisterPost />
                <Filter />
                <RegisterPostList />
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
                <EditRegisterPostDialog />
                <DeleteRegisterPostDialog />
            </div>
        </div>
    );
};

export default RegisterPost;
