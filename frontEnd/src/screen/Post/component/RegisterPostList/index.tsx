import { memo, useEffect, useState, useRef } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { CiSettings } from 'react-icons/ci';
import { SEE_MORE } from '@src/const/text';
import { useLazyGetRegisterPostsQuery } from '@src/redux/query/postRTK';
import { AccountField } from '@src/dataStruct/account';
import { RegisterPostField } from '@src/dataStruct/post';
import { set_isLoading, setData_toastMessage, set_selectedRegisterPost } from '@src/redux/slice/Post';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { route_enum } from '@src/router/type';

const RegisterPostList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const list_element = useRef<HTMLDivElement | null>(null);
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);

    const [isShow, setIsShow] = useState<boolean>(false);
    const size = 3;
    const [selectedRegisterPost, setSelectedRegisterPost] = useState<RegisterPostField | undefined>(undefined);
    const [registerPosts, setRegisterPosts] = useState<RegisterPostField[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);

    const [getRegisterPosts] = useLazyGetRegisterPostsQuery();

    useEffect(() => {
        if (!list_element.current) return;
        const listElement = list_element.current;
        if (isShow) {
            listElement.classList.add(style.show);
        } else {
            listElement.classList.remove(style.show);
        }
    }, [isShow]);

    const handleIsShow = (_isShow: boolean) => {
        setIsShow(_isShow);
    };

    useEffect(() => {
        if (!account) return;
        dispatch(set_isLoading(true));
        getRegisterPosts({ page: page, size: size, isDelete: false, accountId: account.id })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    if (page === 1) {
                        setRegisterPosts(resData.data.items);
                    } else {
                        setRegisterPosts((prev) => [...prev, ...(resData.data?.items || [])]);
                    }

                    setHasMore(resData.data.items.length === size);
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
    }, [account, getRegisterPosts, dispatch, page]);

    const handleGoToRegisterPost = () => {
        navigate(route_enum.REGISTER_POST);
    };

    const handleSeeMore = () => {
        setPage((prev) => prev + 1);
    };

    const handleSelect = (item: RegisterPostField) => {
        setSelectedRegisterPost(item);
    };

    useEffect(() => {
        dispatch(set_selectedRegisterPost(selectedRegisterPost));
    }, [selectedRegisterPost, dispatch]);

    const list = registerPosts.map((item, index) => {
        return (
            <div className={style.oneRow} onClick={() => handleSelect(item)} key={index}>
                {item.name}
            </div>
        );
    });

    return (
        <div className={style.parent}>
            <div className={style.selected}>
                <div>
                    <CiSettings onClick={() => handleGoToRegisterPost()} />
                    <span>{selectedRegisterPost?.id}</span>
                </div>
                <div>{selectedRegisterPost?.name ?? 'Rỗng'}</div>
                <div>
                    {isShow && <FiChevronUp onClick={() => handleIsShow(false)} size={20} />}
                    {!isShow && <FiChevronDown onClick={() => handleIsShow(true)} size={20} />}
                </div>
            </div>
            <div className={style.listContainer} ref={list_element}>
                <div className={style.list}>{list}</div>
                <div className={style.btn}>
                    <div className={style.seeMore}>
                        {hasMore && <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(RegisterPostList);
