import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { useLazyGetPostsQuery } from '@src/redux/query/postRTK';
import { RegisterPostField, PostField } from '@src/dataStruct/post';
import { set_isLoading, setData_toastMessage } from '@src/redux/slice/Home';
import { messageType_enum } from '@src/component/ToastMessage/type';
import OnePost from './component/OnePost';

const PostList = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [posts, setPosts] = useState<PostField[]>([]);
    const registerPostId = 4;

    const [getPosts] = useLazyGetPostsQuery();

    useEffect(() => {
        dispatch(set_isLoading(true));
        getPosts({ page: 1, size: 10, registerPostId: registerPostId })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setPosts(resData.data.items);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    }, [dispatch, getPosts]);

    const list_post = posts.map((item) => {
        return <OnePost data={item} key={item.id} />;
    });

    return <div className={style.parent}>{list_post}</div>;
};

export default memo(PostList);
