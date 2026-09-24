import { memo, useEffect, useRef, useId, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT } from '@src/const/text';
import { set__is_show__edit_infor_dialog, set__data__toast_message, set__is_loading } from '@src/redux/slice/Profile';
import { messageType_enum } from '@src/component/ToastMessage/type';
import axiosInstance from '@src/api/axiosInstance';
import { My_Response_Field } from '@src/data_struct/response';
import { Edit_Infor_Account_Body_Field } from '@src/data_struct/account/body';
import { Account_Field } from '@src/data_struct/account';
import { uploadImage } from '../../handle';
import { set__account } from '@src/redux/slice/App';

const EditInforDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const is_show: boolean = useSelector((state: RootState) => state.Profile_Slice.edit_infor_dialog.is_show);

    const [image, set__image] = useState<File | null>(null);
    const [preview, set__preview] = useState<string | null>(null);
    const id_image_input = useId();
    const imageInput_element = useRef<HTMLInputElement | null>(null);
    const [first_name, set__first_name] = useState<string>('');
    const [last_name, set__last_name] = useState<string>('');

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
        if (!account) return;
        set__first_name(account.first_name);
        set__last_name(account.last_name);
    }, [account]);

    useEffect(() => {
        if (!image) return;
        const object_url = URL.createObjectURL(image);
        set__preview(object_url);

        return () => {
            URL.revokeObjectURL(object_url);
            set__preview(null);
        };
    }, [image]);

    const handle_Click_Image = () => {
        imageInput_element.current?.click();
    };

    const handle_Image_Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Đã có lỗi xảy ra',
                })
            );
            return;
        }
        set__image(files[0]);
    };

    const handle_Del_Image = () => {
        set__image(null);
    };

    const handle_Close = () => {
        dispatch(set__is_show__edit_infor_dialog(false));
    };

    const handle_Edit_Infor_Account = async (edit_infor_account_body: Edit_Infor_Account_Body_Field) => {
        try {
            const response = await axiosInstance.post<My_Response_Field<Account_Field>>(
                '/service__account/mutate/edit_infor_account',
                edit_infor_account_body
            );
            return response.data;
        } catch (error) {
            console.error('Error editing account information:', error);
            throw error;
        }
    };

    const handle_Agree = async () => {
        if (!account) return;
        const first_name_final = first_name.trim();
        const last_name_final = last_name.trim();

        try {
            dispatch(set__is_loading(true));
            const avatar_url: string = '';
            if (image) {
                const res_data_image = await uploadImage(image, account.id);
                if (!res_data_image) {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Đăng tải hình ảnh thất bại !',
                        })
                    );
                    return;
                }
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.SUCCESS,
                        message: 'Đăng tải hình ảnh thành công !',
                    })
                );

                const file_name = res_data_image.file_name;

                if (first_name_final.length === 0 && last_name_final.length === 0 && avatar_url.length === 0) {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.NORMAL,
                            message: 'Không có gì thay đổi',
                        })
                    );
                    return;
                }

                const edit_infor_account_body: Edit_Infor_Account_Body_Field = {
                    id: account.id,
                    first_name: first_name_final.length > 0 ? first_name_final : account.first_name,
                    last_name: last_name_final.length > 0 ? last_name_final : account.last_name,
                    avatar: file_name,
                };

                const res_data_account = await handle_Edit_Infor_Account(edit_infor_account_body);
                if (res_data_account?.is_success && res_data_account.data) {
                    dispatch(set__account(res_data_account.data));
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.SUCCESS,
                            message: 'Chỉnh sửa thông tin thành công !',
                        })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Chỉnh sửa thông tin thất bại !',
                        })
                    );
                }
            }
        } catch (error) {
            console.error('Error uploading image ( EditInforDialog ):', error);
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Đã có lỗi xảy ',
                })
            );
            return;
        } finally {
            dispatch(set__is_loading(false));
        }
    };

    const handle_First_Name_Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__first_name(e.target.value);
    };

    const handle_Last_Name_Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__last_name(e.target.value);
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.header}>Chọn tên và ảnh đại diện mới</div>
                    <div className={style.avatarContainer}>
                        <div className={style.box}>
                            {image && <IoMdClose onClick={() => handle_Del_Image()} title={CLOSE} />}
                            {!image && (
                                <div className={style.btn} id={id_image_input} onClick={handle_Click_Image}>
                                    Chọn ảnh đại diện
                                </div>
                            )}
                            <input
                                ref={imageInput_element}
                                onChange={handle_Image_Change}
                                type="file"
                                id={id_image_input}
                                accept="image/*"
                            />
                            {preview && <img className={style.avatar} src={preview} alt="avatar" />}
                        </div>
                    </div>
                    <div className={style.nameContainer}>
                        <input value={first_name} onChange={(e) => handle_First_Name_Change(e)} placeholder="Tên đầu" />
                        <input value={last_name} onChange={(e) => handle_Last_Name_Change(e)} placeholder="Tên cuối" />
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

export default memo(EditInforDialog);
