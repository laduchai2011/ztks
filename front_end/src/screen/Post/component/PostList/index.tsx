import { memo, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { useLazy_get_Posts_Query } from '@src/redux/query/post_RTK';
import { Register_Post_Field, Post_Field } from '@src/data_struct/post';
import { set__is_loading, set__data__toast_message, set__post_list } from '@src/redux/slice/Post';
import { messageType_enum } from '@src/component/ToastMessage/type';
import OnePost from './component/OnePost';

const PostList = () => {
    const dispatch = useDispatch<AppDispatch>();

    const post_list: Post_Field[] = useSelector((state: RootState) => state.Post_Slice.post_list);
    const selected_register_post: Register_Post_Field | undefined = useSelector(
        (state: RootState) => state.Post_Slice.selected_register_post
    );

    const [get_Posts] = useLazy_get_Posts_Query();

    useEffect(() => {
        if (!selected_register_post) return;
        dispatch(set__is_loading(true));
        get_Posts({ page: 1, size: 10, register_post_id: selected_register_post.id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__post_list(res_data.data.items));
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    }, [dispatch, get_Posts, selected_register_post]);

    const list_post = post_list.map((item) => {
        return <OnePost data={item} key={item.id} />;
    });

    return <div className={style.parent}>{list_post}</div>;
};

export default memo(PostList);
