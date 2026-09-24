import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import {
    set__data__toast_message,
    set__is_loading,
    set__new_register_post_of_create,
} from '@src/redux/slice/Register_Post';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { useLazy_get_Register_Posts_Query } from '@src/redux/query/post_RTK';
import { Register_Post_Field } from '@src/data_struct/post';
import { Get_Register_Posts_Body_Field } from '@src/data_struct/post/body';
import OneRegisterPost from './component/OneRegisterPost';
import { SEE_MORE } from '@src/const/text';

const RegisterPostList = () => {
    const dispatch = useDispatch<AppDispatch>();

    const get_register_posts_body: Get_Register_Posts_Body_Field | undefined = useSelector(
        (state: RootState) => state.Register_Post_Slice.get_register_posts_body
    );
    const new_register_post_of_create: Register_Post_Field | undefined = useSelector(
        (state: RootState) => state.Register_Post_Slice.new_register_post_of_create
    );

    const [register_posts, set__register_posts] = useState<Register_Post_Field[]>([]);
    const [has_more, set__has_more] = useState<boolean>(false);
    const [filter, set__filter] = useState<Get_Register_Posts_Body_Field | undefined>(undefined);

    const [get_Register_Posts] = useLazy_get_Register_Posts_Query();

    useEffect(() => {
        if (!get_register_posts_body) return;
        set__filter(get_register_posts_body);
        dispatch(set__is_loading(true));
        get_Register_Posts(get_register_posts_body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__register_posts(res_data.data.items);
                    set__has_more(res_data.data.items.length === get_register_posts_body.size);
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
    }, [get_Register_Posts, get_register_posts_body, dispatch]);

    useEffect(() => {
        if (!new_register_post_of_create) return;
        set__register_posts((prev) => [new_register_post_of_create, ...prev]);
        dispatch(set__new_register_post_of_create(undefined));
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }, [dispatch, new_register_post_of_create]);

    const handle_See_More = () => {
        if (!filter) return;
        const filter_cp = { ...filter };
        filter_cp.page = filter_cp.page + 1;
        get_Register_Posts(filter_cp)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__register_posts((prev) => [...prev, ...(res_data.data?.items || [])]);
                    set__has_more(res_data.data.items.length === filter_cp.size);
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
                set__filter(filter_cp);
            });
    };

    const list = register_posts.map((item) => {
        return <OneRegisterPost data={item} key={item.id} />;
    });

    return (
        <div className={style.parent}>
            <div>{list}</div>
            <div className={style.seeMore}>{has_more && <div onClick={() => handle_See_More()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(RegisterPostList);
