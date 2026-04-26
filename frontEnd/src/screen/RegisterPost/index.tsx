import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { REGISTER_POST } from '@src/const/text';
import MyLoading from './component/MyLoading';
import MyToastMessage from './component/MyToastMessage';
import { setData_toastMessage } from '@src/redux/slice/Post';
import { route_enum } from '@src/router/type';
import CreateRegisterPost from './component/CreateRegisterPost';
import Filter from './component/Filter';
import RegisterPostList from './component/RegisterPostList';
import EditRegisterPostDialog from './component/EditRegisterPostDialog';
import DeleteRegisterPostDialog from './component/DeleteRegisterPostDialog';

const RegisterPost = () => {
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
                <div className={style.header}>{REGISTER_POST}</div>
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
