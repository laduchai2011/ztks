import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { POST } from '@src/const/text';
import MyLoading from './component/MyLoading';
import MyToastMessage from './component/MyToastMessage';
import { setData_toastMessage } from '@src/redux/slice/Post';
import { route_enum } from '@src/router/type';
import RegisterPostList from './component/RegisterPostList';
import CreatePost from './component/CreatePost';
import EditPostDialog from './component/EditPostDialog';
import PostList from './component/PostList';

const Post = () => {
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
                <div className={style.header}>{POST}</div>
                <RegisterPostList />
                <CreatePost />
                <PostList />
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
                <EditPostDialog />
            </div>
        </div>
    );
};

export default Post;
