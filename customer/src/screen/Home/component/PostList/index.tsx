import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { useLazyGetPostsQuery } from '@src/redux/query/postRTK';
import { PostField, RegisterPostField } from '@src/dataStruct/post';
import { set_isLoading, setData_toastMessage, set_zaloOa } from '@src/redux/slice/Home';
import { messageType_enum } from '@src/component/ToastMessage/type';
import OnePost from './component/OnePost';
import { useLazyGetRegisterPostWithIdQuery } from '@src/redux/query/postRTK';
import { useLazyGetZaloOaWithIdQuery } from '@src/redux/query/zaloRTK';

const PostList = () => {
    const dispatch = useDispatch<AppDispatch>();

    const registerPostId: number | undefined = useSelector((state: RootState) => state.HomeSlice.registerPostId);

    const [posts, setPosts] = useState<PostField[]>([]);
    const [registerPost, setRegisterPost] = useState<RegisterPostField | undefined>(undefined);

    const [getPosts] = useLazyGetPostsQuery();
    const [getRegisterPostWithId] = useLazyGetRegisterPostWithIdQuery();
    const [getZaloOaWithId] = useLazyGetZaloOaWithIdQuery();

    useEffect(() => {
        if (!registerPostId) return;

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
    }, [dispatch, getPosts, registerPostId]);

    useEffect(() => {
        if (!registerPostId) return;

        getRegisterPostWithId({ id: registerPostId })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setRegisterPost(resData.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [getRegisterPostWithId, registerPostId]);

    useEffect(() => {
        if (!registerPost) return;

        getZaloOaWithId({ id: registerPost.zaloOaId, accountId: registerPost.accountId })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    dispatch(set_zaloOa(resData.data));
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [dispatch, getZaloOaWithId, registerPost]);

    const list_post = posts.map((item) => {
        return <OnePost data={item} key={item.id} />;
    });

    return <div className={style.parent}>{list_post}</div>;
};

export default memo(PostList);
