import { memo, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { useLazyGetPostsQuery } from '@src/redux/query/postRTK';
import { RegisterPostField, PostField } from '@src/dataStruct/post';
import { set_isLoading, setData_toastMessage, set_postList } from '@src/redux/slice/Post';
import { messageType_enum } from '@src/component/ToastMessage/type';
import OnePost from './component/OnePost';

const PostList = () => {
    const dispatch = useDispatch<AppDispatch>();

    const postList: PostField[] = useSelector((state: RootState) => state.PostSlice.postList);
    const selectedRegisterPost: RegisterPostField | undefined = useSelector(
        (state: RootState) => state.PostSlice.selectedRegisterPost
    );

    const [getPosts] = useLazyGetPostsQuery();

    useEffect(() => {
        if (!selectedRegisterPost) return;
        dispatch(set_isLoading(true));
        getPosts({ page: 1, size: 10, registerPostId: selectedRegisterPost.id })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    dispatch(set_postList(resData.data.items));
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
    }, [dispatch, getPosts, selectedRegisterPost]);

    const list_post = postList.map((item) => {
        return <OnePost data={item} key={item.id} />;
    });

    return <div className={style.parent}>{list_post}</div>;
};

export default memo(PostList);
