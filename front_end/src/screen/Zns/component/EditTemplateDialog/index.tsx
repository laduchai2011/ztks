import { memo, useEffect, useRef, useState, useId } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { GrSubtractCircle } from 'react-icons/gr';
import { CiImageOn } from 'react-icons/ci';
import { IoIosAddCircle } from 'react-icons/io';
import { CLOSE, AGREE, EXIT } from '@src/const/text';
import {
    set__data__toast_message,
    set__is_loading,
    set__is_show__edit_zns_template_dialog,
    set__new_zns_template__edit_zns_template_dialog,
} from '@src/redux/slice/Zns';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { Account_Field } from '@src/data_struct/account';
import { Zalo_Oa_Field, Zns_Template_Field } from '@src/data_struct/zalo';
import { Edit_Zns_Template_Body_Field } from '@src/data_struct/zalo/body';
import { use_edit_Zns_Template_Mutation } from '@src/redux/query/zalo_RTK';
import { handleSrcImage } from '@src/utility/string';
import { uploadImage } from '../../handle';
import { isPositiveInteger } from '@src/utility/string';

const EditTemplateDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const selected_oa: Zalo_Oa_Field | undefined = useSelector((state: RootState) => state.Zns_Slice.selected_oa);
    const is_show: boolean = useSelector((state: RootState) => state.Zns_Slice.edit_zns_template_dialog.is_show);
    const zns_template: Zns_Template_Field | undefined = useSelector(
        (state: RootState) => state.Zns_Slice.edit_zns_template_dialog.zns_template
    );

    const imageInput_element = useRef<HTMLInputElement | null>(null);
    const id_image_input = useId();
    const [image, set__image] = useState<File | undefined>(undefined);
    const [pre_view, set__pre_view] = useState<string | undefined>(undefined);
    const [tem_id, set__tem_id] = useState<string>('');
    const [phone_cost, set__phone_cost] = useState<string>('');
    const [uid_cost, set__uid_cost] = useState<string>('');
    const [parameters, set__parameters] = useState<string[]>(['']);
    const [zns_template1, set__zns_template1] = useState<Zns_Template_Field | undefined>(undefined);

    const [edit_Zns_Template] = use_edit_Zns_Template_Mutation();

    useEffect(() => {
        if (!zns_template) return;
        set__zns_template1(zns_template);
    }, [zns_template]);

    useEffect(() => {
        if (!zns_template1) return;
        set__tem_id(zns_template1.tem_id);
        set__phone_cost(zns_template1.phone_cost.toString());
        set__uid_cost(zns_template1.uid_cost.toString());
        set__parameters(JSON.parse(zns_template1.data_fields));
        set__pre_view(handleSrcImage(JSON.parse(zns_template1.images)[0]));
    }, [zns_template1]);

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

    const handle_Close = () => {
        dispatch(set__is_show__edit_zns_template_dialog(false));
    };

    const handle_Agree = async () => {
        if (!account) return;
        if (!selected_oa) return;
        if (!zns_template1) return;

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

        if (!pre_view) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Bắt buộc phải có hình ảnh minh họa !',
                })
            );
            return;
        }

        let r_images: string[] | undefined = undefined;
        if (image) {
            r_images = await handle_Upload_Images([image], account);
        }

        const final_images = r_images && r_images?.length > 0 ? JSON.stringify(r_images) : zns_template1.images;
        const edit_zns_template_body: Edit_Zns_Template_Body_Field = {
            id: zns_template1.id,
            tem_id: tem_id_t,
            images: final_images,
            data_fields: JSON.stringify(parameters_t),
            phone_cost: Number(phone_cost_t),
            uid_cost: Number(uid_cost_t),
            zalo_oa_id: selected_oa.id,
            account_id: account.id,
        };

        dispatch(set__is_loading(true));
        edit_Zns_Template(edit_zns_template_body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__new_zns_template__edit_zns_template_dialog(res_data.data));
                    dispatch(
                        set__data__toast_message({ type: messageType_enum.SUCCESS, message: 'Cập nhật thành công !' })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Cập nhật không thành công !',
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

    const handle_Add_Parameter = () => {
        set__parameters((prev) => [...prev, '']);
    };

    const handle_Value_Parameter = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        const new_parameters = [...parameters];
        new_parameters[index] = value;
        set__parameters(new_parameters);
    };

    const handle_Sub_Parameter = (index: number) => {
        const new_parameters = [...parameters];
        new_parameters.splice(index, 1);
        set__parameters(new_parameters);
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

    const handle_Image_Icon_Click = () => {
        imageInput_element.current?.click();
    };

    const handle_Image_Change = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files) return;

        const file = files[0];

        set__image(file);
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
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.fieldContainer}>
                        <div className={style.inputContainer}>
                            <div>Định danh mẫu</div>
                            <input value={tem_id} onChange={(e) => handle_Tem_Id(e)} />
                        </div>
                    </div>
                    <div className={style.fieldContainer}>
                        <div className={style.inputContainer}>
                            <div>Chi phí quá sđt</div>
                            <input value={phone_cost} onChange={(e) => handle_Phone_Cost(e)} />
                        </div>
                    </div>
                    <div className={style.fieldContainer}>
                        <div className={style.inputContainer}>
                            <div>Chi phí qua uid</div>
                            <input value={uid_cost} onChange={(e) => handle_Uid_Cost(e)} />
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
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handle_Agree()}>{AGREE}</button>
                    <button onClick={() => handle_Close()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(EditTemplateDialog);
