import { memo, useState, useRef, useId, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoIosAddCircle } from 'react-icons/io';
import { GrSubtractCircle } from 'react-icons/gr';
import { IoCloseOutline } from 'react-icons/io5';
import { CiImageOn } from 'react-icons/ci';
import { CREATE_TEMPLATE } from '@src/const/text';
import { use_create_Zns_Template_Mutation } from '@src/redux/query/zalo_RTK';
import { Create_Zns_Template_Body_Field } from '@src/data_struct/zalo/body';
import {
    set__data__toast_message,
    set__is_loading,
    set__data__add_new_zns_template,
    set__new_zns_template,
} from '@src/redux/slice/Zns';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Account_Field } from '@src/data_struct/account';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { uploadImage } from '../../handle';
import { isPositiveInteger } from '@src/utility/string';

const CreateTemplate = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const selected_oa: Zalo_Oa_Field | undefined = useSelector((state: RootState) => state.Zns_Slice.selected_oa);

    const imageInput_element = useRef<HTMLInputElement | null>(null);
    const id_image_input = useId();
    const [image, set__image] = useState<File | undefined>(undefined);
    const [pre_view, set__pre_view] = useState<string | undefined>(undefined);

    const [is_show_parent, set__is_show_parent] = useState(false);
    const [is_display_btn, set__is_display_btn] = useState(true);
    const [is_show_btn, set__is_show_btn] = useState(true);
    const [is_display_icon, set__is_display_icon] = useState(false);
    const [is_show_icon, set__is_show_icon] = useState(false);
    const [tem_id, set__tem_id] = useState<string>('');
    const [phone_cost, set__phone_cost] = useState<string>('');
    const [uid_cost, set__uid_cost] = useState<string>('');
    const [parameters, set__parameters] = useState<string[]>(['']);

    const [create_Zns_Template] = use_create_Zns_Template_Mutation();

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

    const handle_Tem_Id = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__tem_id(value);
    };

    const handle_Phone_Cost = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__phone_cost(value);
    };

    const handle_Uid_Cost = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__uid_cost(value);
    };

    const handle_Add_Parameter = () => {
        set__parameters((prev) => [...prev, '']);
    };

    const handle_Sub_Parameter = (index: number) => {
        const new_parameters = [...parameters];
        new_parameters.splice(index, 1);
        set__parameters(new_parameters);
    };

    const handle_Value_Parameter = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        const new_parameters = [...parameters];
        new_parameters[index] = value;
        set__parameters(new_parameters);
    };

    const handle_Image_Icon_Click = () => {
        imageInput_element.current?.click();
    };

    const handle_Image_Change = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files) return;

        const file = files[0];

        set__image(file);
    };

    useEffect(() => {
        if (!image) return;
        const _pre_view = URL.createObjectURL(image);
        set__pre_view(_pre_view);

        return () => {
            URL.revokeObjectURL(_pre_view);
            set__pre_view(undefined);
        };
    }, [image]);

    const handle_Upload_Images = async (images: File[], account: Account_Field) => {
        try {
            dispatch(set__is_loading(true));
            const file_names: string[] = [];

            for (let i: number = 0; i < images.length; i++) {
                const res_data_image = await uploadImage(images[i], account.id);
                if (!res_data_image) {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Đăng tải hình ảnh thất bại !',
                        })
                    );
                    break;
                }

                const file_name = res_data_image.file_name;
                file_names.push(file_name);
            }

            return file_names;
        } catch (error) {
            console.error(error);
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Đã có lỗi xảy ra !',
                })
            );
        } finally {
            dispatch(set__is_loading(false));
        }
    };

    const handle_Create = async () => {
        if (!account) return;
        if (!selected_oa) return;

        const tem_id_t = tem_id.trim();
        if (tem_id_t.length === 0) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Định danh mẫu không được để trống !',
                })
            );
            return;
        }

        const phone_cost_t = phone_cost.trim();
        if (!isPositiveInteger(phone_cost_t)) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Chi phí số điện thoại phải là 1 số nguyên dương !',
                })
            );
            return;
        }

        const uid_cost_t = uid_cost.trim();
        if (!isPositiveInteger(uid_cost_t)) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Chi phí uid phải là 1 số nguyên dương !',
                })
            );
            return;
        }

        const parameters_t: string[] = [];
        for (let i: number = 0; i < parameters.length; i++) {
            const parameter_t = parameters[i].trim();
            if (parameter_t.length === 0) {
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Không được để trống các trường !',
                    })
                );
                return;
            }
            parameters_t.push(parameter_t);
        }

        if (!image) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Bắt buộc phải có hình ảnh minh họa !',
                })
            );
            return;
        }

        const r_images = await handle_Upload_Images([image], account);

        if (!r_images) {
            dispatch(
                set__data__toast_message({ type: messageType_enum.ERROR, message: 'Đăng tải hình ảnh thất bại !' })
            );
            return;
        }

        const create_zns_template_body: Create_Zns_Template_Body_Field = {
            tem_id: tem_id_t,
            images: JSON.stringify(r_images),
            data_fields: JSON.stringify(parameters_t),
            phone_cost: Number(phone_cost_t),
            uid_cost: Number(uid_cost_t),
            zalo_oa_id: selected_oa.id,
            account_id: account.id,
        };

        dispatch(set__is_loading(true));
        create_Zns_Template(create_zns_template_body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__new_zns_template(res_data.data));
                    dispatch(set__data__add_new_zns_template(res_data.data));
                    dispatch(
                        set__data__toast_message({ type: messageType_enum.SUCCESS, message: 'Tạo mẫu thành công !' })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: res_data?.message ?? 'Tạo mẫu không thành công !',
                        })
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(set__data__toast_message({ type: messageType_enum.ERROR, message: 'Đã có lỗi xảy ra !' }));
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    };

    const paramter_list = parameters.map((item, index) => {
        return (
            <div className={style.inputContainer} key={index}>
                <div>{`Tham số ${index + 1}`}</div>
                <input value={item} onChange={(e) => handle_Value_Parameter(e, index)} />
                <GrSubtractCircle onClick={() => handle_Sub_Parameter(index)} />
            </div>
        );
    });

    return (
        <div className={`${style.parent} ${is_show_parent ? style.show : ''}`}>
            <div className={style.header}>
                <div
                    className={`${style.btn} ${is_display_btn ? style.display : ''} ${is_show_btn ? style.show : ''}`}
                    onClick={() => handle_H_Btn()}
                >
                    {CREATE_TEMPLATE}
                </div>
                <IoCloseOutline
                    className={`${style.icon} ${is_display_icon ? style.display : ''} ${is_show_icon ? style.show : ''}`}
                    onClick={() => handle_H_Icon()}
                    size={25}
                />
            </div>
            <div className={style.content}>
                <div className={style.fieldContainer}>
                    <div className={style.inputContainer}>
                        <div>Định danh mẫu</div>
                        <input value={tem_id} onChange={(e) => handle_Tem_Id(e)} />
                    </div>
                </div>
                <div className={style.fieldContainer}>
                    <div className={style.inputContainer}>
                        <div>Chi phí quá sđt</div>
                        <input value={phone_cost} onChange={(e) => handle_Phone_Cost(e)} placeholder="VND" />
                    </div>
                </div>
                <div className={style.fieldContainer}>
                    <div className={style.inputContainer}>
                        <div>Chi phí qua uid</div>
                        <input value={uid_cost} onChange={(e) => handle_Uid_Cost(e)} placeholder="VND" />
                    </div>
                </div>
                <div className={style.fieldContainer}>{paramter_list}</div>
                <div className={style.iconContainer}>
                    <input
                        ref={imageInput_element}
                        onChange={handle_Image_Change}
                        type="file"
                        id={id_image_input}
                        accept="image/*"
                    />
                    <CiImageOn id={id_image_input} onClick={handle_Image_Icon_Click} size={25} color="green" />
                    <IoIosAddCircle onClick={() => handle_Add_Parameter()} size={25} color="gray" />
                </div>
                <div className={style.imgContainer}>{pre_view && <img src={pre_view} alt="" />}</div>
                <div className={style.btnContainer}>
                    <div className={style.btn} onClick={() => handle_Create()}>
                        {CREATE_TEMPLATE}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(CreateTemplate);
