import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { setData_toastMessage, set_isLoading, set_newRegisterPostOfCreate } from '@src/redux/slice/RegisterPost';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { useLazyGetRegisterPostsQuery } from '@src/redux/query/postRTK';
import { RegisterPostField } from '@src/dataStruct/post';
import { GetRegisterPostsBodyField } from '@src/dataStruct/post/body';
import OneRegisterPost from './component/OneRegisterPost';
import { SEE_MORE } from '@src/const/text';

const RegisterPostList = () => {
    const dispatch = useDispatch<AppDispatch>();

    const getRegisterPostsBody: GetRegisterPostsBodyField | undefined = useSelector(
        (state: RootState) => state.RegisterPostSlice.getRegisterPostsBody
    );
    const newRegisterPostOfCreate: RegisterPostField | undefined = useSelector(
        (state: RootState) => state.RegisterPostSlice.newRegisterPostOfCreate
    );

    const [registerPosts, setRegisterPosts] = useState<RegisterPostField[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [filter, setFilter] = useState<GetRegisterPostsBodyField | undefined>(undefined);

    const [getRegisterPosts] = useLazyGetRegisterPostsQuery();

    useEffect(() => {
        if (!getRegisterPostsBody) return;
        setFilter(getRegisterPostsBody);
        dispatch(set_isLoading(true));
        getRegisterPosts(getRegisterPostsBody)
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setRegisterPosts(resData.data.items);
                    setHasMore(resData.data.items.length === getRegisterPostsBody.size);
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
    }, [getRegisterPosts, getRegisterPostsBody, dispatch]);

    useEffect(() => {
        if (!newRegisterPostOfCreate) return;
        setRegisterPosts((prev) => [newRegisterPostOfCreate, ...prev]);
        dispatch(set_newRegisterPostOfCreate(undefined));
        setTimeout(() => {
            window.location.reload();
        }, 500);
    }, [dispatch, newRegisterPostOfCreate]);

    const handleSeeMore = () => {
        if (!filter) return;
        const filter_cp = { ...filter };
        filter_cp.page = filter_cp.page + 1;
        getRegisterPosts(filter_cp)
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setRegisterPosts((prev) => [...prev, ...(resData.data?.items || [])]);
                    setHasMore(resData.data.items.length === filter_cp.size);
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
                setFilter(filter_cp);
            });
    };

    const list = registerPosts.map((item) => {
        return <OneRegisterPost data={item} key={item.id} />;
    });

    return (
        <div className={style.parent}>
            <div>{list}</div>
            <div className={style.seeMore}>{hasMore && <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(RegisterPostList);
