import { memo, useEffect, useState, useRef } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { FiChevronUp, FiChevronDown } from 'react-icons/fi';
import { CiSettings } from 'react-icons/ci';
import { SEE_MORE } from '@src/const/text';
import { useLazy_get_Register_Posts_Query } from '@src/redux/query/post_RTK';
import { Account_Field } from '@src/data_struct/account';
import { Register_Post_Field } from '@src/data_struct/post';
import { set__is_loading, set__data__toast_message, set__selected_register_post } from '@src/redux/slice/Post';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { route_enum } from '@src/router/type';

const RegisterPostList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const list_element = useRef<HTMLDivElement | null>(null);
    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);

    const [is_show, set__is_show] = useState<boolean>(false);
    const size = 1;
    const [selected_register_post1, set__selected_register_post1] = useState<Register_Post_Field | undefined>(
        undefined
    );
    const [register_posts, set__register_posts] = useState<Register_Post_Field[]>([]);
    const [has_more, set__has_more] = useState<boolean>(false);
    const [page, set__page] = useState<number>(1);

    const [get_Register_Posts] = useLazy_get_Register_Posts_Query();

    useEffect(() => {
        if (!list_element.current) return;
        const listElement = list_element.current;
        if (is_show) {
            listElement.classList.add(style.show);
        } else {
            listElement.classList.remove(style.show);
        }
    }, [is_show]);

    const handle_Is_Show = (_is_show: boolean) => {
        set__is_show(_is_show);
    };

    useEffect(() => {
        if (!account) return;
        dispatch(set__is_loading(true));
        get_Register_Posts({ page: page, size: size, is_delete: false, account_id: account.id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    if (page === 1) {
                        set__register_posts(res_data.data.items);
                    } else {
                        set__register_posts((prev) => [...prev, ...(res_data.data?.items || [])]);
                    }

                    set__has_more(res_data.data.items.length === size);
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
    }, [account, get_Register_Posts, dispatch, page]);

    const handle_Go_To_Register_Post = () => {
        navigate(route_enum.REGISTER_POST);
    };

    const handle_See_More = () => {
        set__page((prev) => prev + 1);
    };

    const handle_Select = (item: Register_Post_Field) => {
        set__selected_register_post1(item);
    };

    useEffect(() => {
        dispatch(set__selected_register_post(selected_register_post1));
    }, [selected_register_post1, dispatch]);

    const list = register_posts.map((item, index) => {
        return (
            <div className={style.oneRow} onClick={() => handle_Select(item)} key={index}>
                {item.name}
            </div>
        );
    });

    return (
        <div className={style.parent}>
            <div className={style.selected}>
                <div>
                    <CiSettings onClick={() => handle_Go_To_Register_Post()} />
                    <span>{selected_register_post1?.id}</span>
                </div>
                <div>{selected_register_post1?.name ?? 'Rỗng'}</div>
                <div>
                    {is_show && <FiChevronUp onClick={() => handle_Is_Show(false)} size={20} />}
                    {!is_show && <FiChevronDown onClick={() => handle_Is_Show(true)} size={20} />}
                </div>
            </div>
            <div className={style.listContainer} ref={list_element}>
                <div className={style.list}>{list}</div>
                <div className={style.btn}>
                    <div className={style.seeMore}>
                        {has_more && <div onClick={() => handle_See_More()}>{SEE_MORE}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(RegisterPostList);
