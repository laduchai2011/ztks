import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { CREATE_REGISTER_POST } from '@src/const/text';
import { useLazy_get_Zalo_Oa_List_With_2_Fk_Query } from '@src/redux/query/zalo_RTK';
import { use_create_Register_Post_Mutation } from '@src/redux/query/post_RTK';
import { Account_Information_Field } from '@src/data_struct/account';
import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import {
    set__is_loading,
    set__data__toast_message,
    set__new_register_post_of_create,
} from '@src/redux/slice/Register_Post';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { Register_Post_Type_Enum } from '@src/data_struct/post';

const CreateRegisterPost = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const zalo_app: Zalo_App_Field | undefined = useSelector((state: RootState) => state.App_Slice.zalo_app);

    const [is_show_parent, set__is_show_parent] = useState(false);
    const [is_display_btn, set__is_display_btn] = useState(true);
    const [is_show_btn, set__is_show_btn] = useState(true);
    const [is_display_icon, set__is_display_icon] = useState(false);
    const [is_show_icon, set__is_show_icon] = useState(false);
    const [selected_zalo_oa, set__selected_zalo_oa] = useState<Zalo_Oa_Field | undefined>(undefined);
    const [zalo_oa_list, set__zalo_oa_list] = useState<Zalo_Oa_Field[]>([]);
    const [name, set__name] = useState<string>('');

    const [get_Zalo_Oa_List_With_2_Fk] = useLazy_get_Zalo_Oa_List_With_2_Fk_Query();
    const [create_Register_Post] = use_create_Register_Post_Mutation();

    const handle_H_Btn = () => {
        set__is_show_parent(true);
        set__is_show_btn(false);
        setTimeout(() => {
            set__is_display_btn(false);
        }, 300);
        set__is_display_icon(true);
        setTimeout(() => {
            set__is_show_icon(true);
        }, 10);
    };

    const handle_H_Icon = () => {
        set__is_show_parent(false);
        set__is_show_icon(false);
        setTimeout(() => {
            set__is_display_icon(false);
        }, 300);
        set__is_display_btn(true);
        setTimeout(() => {
            set__is_show_btn(true);
        }, 10);
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

    const handle_Name = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__name(e.target.value);
    };

    const handle_Selection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = e.target.value.trim();

        const selected = zalo_oa_list.find((item) => item.id === id);
        set__selected_zalo_oa(selected);
    };

    const handle_Create = () => {
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
        create_Register_Post({
            name: name_t,
            type: Register_Post_Type_Enum.FREE,
            zalo_oa_id: selected_zalo_oa.id,
            account_id: '',
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__new_register_post_of_create(res_data.data));
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.SUCCESS,
                            message: 'Tạo thành công !',
                        })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Tạo không thành công !',
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

    const list_oa = zalo_oa_list.map((item) => {
        return (
            <option value={item.id} key={item.id}>
                {item.oa_name}
            </option>
        );
    });

    return (
        <div className={`${style.parent} ${is_show_parent ? style.show : ''}`}>
            <div className={style.header}>
                <div
                    className={`${style.btn} ${is_display_btn ? style.display : ''} ${is_show_btn ? style.show : ''}`}
                    onClick={() => handle_H_Btn()}
                >
                    {CREATE_REGISTER_POST}
                </div>
                <IoCloseOutline
                    className={`${style.icon} ${is_display_icon ? style.display : ''} ${is_show_icon ? style.show : ''}`}
                    onClick={() => handle_H_Icon()}
                    size={25}
                />
            </div>
            <div className={style.content}>
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
                <div>
                    <div onClick={() => handle_Create()}>{CREATE_REGISTER_POST}</div>
                </div>
            </div>
        </div>
    );
};

export default memo(CreateRegisterPost);
