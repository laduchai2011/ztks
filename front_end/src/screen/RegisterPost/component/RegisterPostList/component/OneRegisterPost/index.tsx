import { memo, FC, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { MdDeleteOutline, MdOutlineUpgrade } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import { Register_Post_Field, Register_Post_Type_Enum } from '@src/data_struct/post';
import { detailTime } from '@src/utility/time';
import {
    set__data__toast_message,
    set__is_show__edit_register_post_dialog,
    set__register_post__edit_register_post_dialog,
    set__new_register_post__edit_register_post_dialog,
    set__is_show__delete_register_post_dialog,
    set__register_post__delete_register_post_dialog,
    set__new_register_post__delete_register_post_dialog,
} from '@src/redux/slice/Register_Post';
import { messageType_enum } from '@src/component/ToastMessage/type';

const OneRegisterPost: FC<{ data: Register_Post_Field }> = ({ data }) => {
    const dispatch = useDispatch<AppDispatch>();
    const new_register_post_e: Register_Post_Field | undefined = useSelector(
        (state: RootState) => state.Register_Post_Slice.edit_register_post_dialog.new_register_post
    );
    const new_register_post_d: Register_Post_Field | undefined = useSelector(
        (state: RootState) => state.Register_Post_Slice.delete_register_post_dialog.new_register_post
    );

    const [register_post, set__register_post] = useState<Register_Post_Field>(data);

    useEffect(() => {
        if (!new_register_post_e) return;
        if (new_register_post_e.id === register_post.id) {
            set__register_post(new_register_post_e);
        }
        dispatch(set__new_register_post__edit_register_post_dialog(undefined));
    }, [dispatch, new_register_post_e, register_post]);

    useEffect(() => {
        if (!new_register_post_d) return;
        if (new_register_post_d.id === register_post.id) {
            set__register_post(new_register_post_d);
        }
        dispatch(set__new_register_post__delete_register_post_dialog(undefined));
    }, [dispatch, new_register_post_d, register_post]);

    const handle_Upgrade = () => {
        dispatch(
            set__data__toast_message({
                type: messageType_enum.NORMAL,
                message: 'Tính năng sắp ra mắt !',
            })
        );
    };

    const handle_Open_Edit = () => {
        dispatch(set__is_show__edit_register_post_dialog(true));
        dispatch(set__register_post__edit_register_post_dialog(register_post));
    };

    const handle_Open_Delete = () => {
        dispatch(set__is_show__delete_register_post_dialog(true));
        dispatch(set__register_post__delete_register_post_dialog(register_post));
    };

    return (
        <div className={style.parent}>
            <div className={style.name}>{register_post.name}</div>
            <div className={style.infor}>
                <div className={style.type}>
                    {register_post.type === Register_Post_Type_Enum.FREE && <div className={style.free}>Miễn phí</div>}
                    {register_post.type === Register_Post_Type_Enum.UPGRADE && (
                        <div className={style.upgrade}>Nâng cấp</div>
                    )}
                </div>
                <div className={style.time}>
                    {register_post.type === Register_Post_Type_Enum.FREE && <div>Không giới hạn</div>}
                    {register_post.type === Register_Post_Type_Enum.UPGRADE && (
                        <div>{detailTime(register_post.expiry_time ?? '')}</div>
                    )}
                </div>
            </div>
            <div className={style.status}>
                {register_post.is_delete && <div className={style.ed}>Đã xóa</div>}
                {!register_post.is_delete && <div className={style.not}>Hoạt động</div>}
            </div>
            <div className={style.icons}>
                <MdOutlineUpgrade onClick={() => handle_Upgrade()} size={18} />
                <CiEdit onClick={() => handle_Open_Edit()} size={18} color="green" />
                <MdDeleteOutline onClick={() => handle_Open_Delete()} size={18} color="red" />
            </div>
        </div>
    );
};

export default memo(OneRegisterPost);
