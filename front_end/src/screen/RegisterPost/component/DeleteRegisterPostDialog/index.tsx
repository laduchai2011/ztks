import { memo, useEffect, useRef } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT } from '@src/const/text';
import {
    set__data__toast_message,
    set__is_loading,
    set__is_show__delete_register_post_dialog,
    set__new_register_post__delete_register_post_dialog,
} from '@src/redux/slice/Register_Post';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { Register_Post_Field } from '@src/data_struct/post';
import { use_delete_Register_Post_Mutation } from '@src/redux/query/post_RTK';

const DeleteRegisterPostDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const is_show: boolean = useSelector(
        (state: RootState) => state.Register_Post_Slice.delete_register_post_dialog.is_show
    );
    const register_post: Register_Post_Field | undefined = useSelector(
        (state: RootState) => state.Register_Post_Slice.delete_register_post_dialog.register_post
    );

    const [delete_Register_Post] = use_delete_Register_Post_Mutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show) {
            parentElement.classList.add(style.display);
            const timeout2 = setTimeout(() => {
                parentElement.classList.add(style.opacity);
                clearTimeout(timeout2);
            }, 50);
        } else {
            parentElement.classList.remove(style.opacity);

            const timeout2 = setTimeout(() => {
                parentElement.classList.remove(style.display);
                clearTimeout(timeout2);
            }, 550);
        }
    }, [is_show]);

    const handle_Close = () => {
        dispatch(set__is_show__delete_register_post_dialog(false));
    };

    const handle_Agree = () => {
        if (!register_post) return;

        dispatch(set__is_loading(true));
        delete_Register_Post({ id: register_post.id, account_id: '' })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__new_register_post__delete_register_post_dialog(res_data.data));
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.SUCCESS,
                            message: 'Xóa thành công !',
                        })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Xóa thành công !',
                        })
                    );
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
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.content}>{register_post?.name}</div>
                    <div className={style.text}>Bạn có chắc chắn muốn xóa đăng ký này không ?</div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handle_Agree()}>{AGREE}</button>
                    <button onClick={() => handle_Close()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(DeleteRegisterPostDialog);
