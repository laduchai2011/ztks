import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT, EDIT_REGISTER_POST } from '@src/const/text';
import {
    set__data__toast_message,
    set__is_loading,
    set__is_show__edit_register_post_dialog,
    set__new_register_post__edit_register_post_dialog,
} from '@src/redux/slice/Register_Post';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { Account_Information_Field } from '@src/data_struct/account';
import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Register_Post_Field } from '@src/data_struct/post';
import { use_edit_Register_Post_Mutation } from '@src/redux/query/post_RTK';
import { useLazy_get_Zalo_Oa_List_With_2_Fk_Query } from '@src/redux/query/zalo_RTK';

const EditRegisterPostDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const zalo_app: Zalo_App_Field | undefined = useSelector((state: RootState) => state.App_Slice.zalo_app);
    const is_show: boolean = useSelector(
        (state: RootState) => state.Register_Post_Slice.edit_register_post_dialog.is_show
    );
    const register_post: Register_Post_Field | undefined = useSelector(
        (state: RootState) => state.Register_Post_Slice.edit_register_post_dialog.register_post
    );
    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );

    const [name, set__name] = useState<string>('');
    const [selected_zalo_oa, set__selected_zalo_oa] = useState<Zalo_Oa_Field | undefined>(undefined);
    const [zalo_oa_list, set__zalo_oa_list] = useState<Zalo_Oa_Field[]>([]);

    const [get_Zalo_Oa_List_With_2_Fk] = useLazy_get_Zalo_Oa_List_With_2_Fk_Query();
    const [edit_Register_Post] = use_edit_Register_Post_Mutation();

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

    useEffect(() => {
        if (!register_post) return;

        const zalo_oa_id = register_post.zalo_oa_id;

        for (let i: number = 0; i < zalo_oa_list.length; i++) {
            if (zalo_oa_id === zalo_oa_list[i].id) {
                set__selected_zalo_oa(zalo_oa_list[i]);
                break;
            }
        }

        set__name(register_post.name);
    }, [register_post, zalo_oa_list]);

    const handle_Name = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__name(e.target.value);
    };

    const handle_Close = () => {
        dispatch(set__is_show__edit_register_post_dialog(false));
    };

    const handle_Agree = () => {
        if (!register_post) return;

        const name_t = name.trim();
        if (name_t.length === 0) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Tên không được để trống !',
                })
            );
            return;
        }

        if (!selected_zalo_oa) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Vui lòng chọn oa !',
                })
            );
            return;
        }

        dispatch(set__is_loading(true));
        edit_Register_Post({
            id: register_post.id,
            name: name_t,
            zalo_oa_id: selected_zalo_oa.id,
            account_id: '',
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__new_register_post__edit_register_post_dialog(res_data.data));
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.SUCCESS,
                            message: 'Chỉnh sửa thành công !',
                        })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Chỉnh sửa không thành công !',
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

    const handle_Selection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value.trim();

        const selected = zalo_oa_list.find((item) => item.id === id);
        set__selected_zalo_oa(selected);
    };

    useEffect(() => {
        if (!account_information || !zalo_app) return;
        dispatch(set__is_loading(true));
        get_Zalo_Oa_List_With_2_Fk({
            page: 1,
            size: 50,
            zalo_app_id: zalo_app.id,
            account_id: account_information.added_by_id || '',
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__zalo_oa_list(res_data.data.items);
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
    }, [dispatch, account_information, get_Zalo_Oa_List_With_2_Fk, zalo_app]);

    const list_oa = zalo_oa_list.map((item) => {
        return (
            <option value={item.id} key={item.id}>
                {item.oa_name}
            </option>
        );
    });

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.content}>
                        <div>{EDIT_REGISTER_POST}</div>
                        <div>
                            <input value={name} onChange={(e) => handle_Name(e)} placeholder="Đặt tên dễ nhớ !" />
                        </div>
                        <div>
                            <div>
                                <div>Chọn OA</div>
                                <select value={selected_zalo_oa?.id ?? ''} onChange={(e) => handle_Selection(e)}>
                                    <option value="">-- Rỗng --</option>
                                    {list_oa}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handle_Agree()}>{AGREE}</button>
                    <button onClick={() => handle_Close()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(EditRegisterPostDialog);
