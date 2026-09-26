import { memo, useEffect, useState, useRef } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { CREATE_CHECK_IN_OUT } from '@src/const/text';
import { Check_In_Out_Type, Check_In_Out_Enum } from '@src/data_struct/check_in_out';
import { Create_Check_In_Out_Body_Field } from '@src/data_struct/check_in_out/body';
import { set__data__toast_message, set__is_loading, set__add_data__check_in_outs } from '@src/redux/slice/Check_In_Out';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { use_create_Check_In_Out_Mutation } from '@src/redux/query/check_in_out_RTK';
import { FaImage } from 'react-icons/fa';
import { uploadImage } from '../../handle';
import { Account_Field } from '@src/data_struct/account';

const CreateCheckInOut = () => {
    const dispatch = useDispatch<AppDispatch>();
    const image_element = useRef<HTMLInputElement>(null);
    const checkTypes_element = useRef<HTMLDivElement>(null);

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);

    const [create_Check_In_Out] = use_create_Check_In_Out_Mutation();

    const [is_show_parent, set__is_show_parent] = useState(false);
    const [is_display_btn, set__is_display_btn] = useState(true);
    const [is_show_btn, set__is_show_btn] = useState(true);
    const [is_display_icon, set__is_display_icon] = useState(false);
    const [is_show_icon, set__is_show_icon] = useState(false);

    const [note, set__note] = useState('');
    const [check_type, set__check_type] = useState<Check_In_Out_Type | null>(null);
    const [image, set__image] = useState<File | null>(null);
    const [preview, set__preview] = useState<string | null>(null);

    useEffect(() => {
        if (!checkTypes_element.current) return;
        const checkTypesElement = checkTypes_element.current;
        const checkTypeElements = checkTypesElement.children;

        switch (check_type) {
            case Check_In_Out_Enum.IN: {
                checkTypeElements[0].classList.add(style.selected);
                checkTypeElements[1].classList.remove(style.selected);
                break;
            }
            case Check_In_Out_Enum.OUT: {
                checkTypeElements[0].classList.remove(style.selected);
                checkTypeElements[1].classList.add(style.selected);
                break;
            }
            default: {
                //statements;
                break;
            }
        }
    }, [check_type]);

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

    const handle_Note = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__note(value);
    };

    const handle_Check_Type = (type: Check_In_Out_Type) => {
        set__check_type(type);
    };

    useEffect(() => {
        if (!image) return;
        const object_url = URL.createObjectURL(image);
        set__preview(object_url);

        return () => {
            URL.revokeObjectURL(object_url);
            set__preview(null);
        };
    }, [image]);
    const handle_Click_Image_Icon = () => {
        image_element.current?.click();
    };
    const handle_Capture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Đã có lỗi xảy ra',
                })
            );
            return;
        }

        set__image(file);
    };

    // const handleClickVideoIcon = () => {};

    const handle_Create = async () => {
        if (!account) return;

        if (!check_type) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Vui lòng chọn loại check in/out',
                })
            );
            return;
        }

        if (!image) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Chưa có hình ảnh',
                })
            );
            return;
        }

        dispatch(set__is_loading(true));
        const res_data_image = await uploadImage(image, account.id.toString());
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

        const create_note_body: Create_Check_In_Out_Body_Field = {
            type: check_type,
            note: note.trim(),
            image: file_name,
            video: null,
            account_id: '',
        };

        create_Check_In_Out(create_note_body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__add_data__check_in_outs(res_data.data));
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.SUCCESS,
                            message: 'Tạo ghi chú thành công !',
                        })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: res_data?.message ?? 'Tạo ghi chú không thành công !',
                        })
                    );
                }
            })
            .catch((err) => {
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Tạo ghi chú không thành công !',
                    })
                );
                console.error(err);
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    };

    return (
        <div className={`${style.parent} ${is_show_parent ? style.show : ''}`}>
            <div className={style.header}>
                <div
                    className={`${style.btn} ${is_display_btn ? style.display : ''} ${is_show_btn ? style.show : ''}`}
                    onClick={() => handle_H_Btn()}
                >
                    {CREATE_CHECK_IN_OUT}
                </div>
                <IoCloseOutline
                    className={`${style.icon} ${is_display_icon ? style.display : ''} ${is_show_icon ? style.show : ''}`}
                    onClick={() => handle_H_Icon()}
                    size={25}
                />
            </div>
            <div className={style.content}>
                <div>
                    <input value={note} onChange={(e) => handle_Note(e)} placeholder="Ghi chú" />
                </div>
                <div className={style.checkTypes} ref={checkTypes_element}>
                    <div onClick={() => handle_Check_Type(Check_In_Out_Enum.IN)}>Check in</div>
                    <div onClick={() => handle_Check_Type(Check_In_Out_Enum.OUT)}>Check out</div>
                </div>
                <div>
                    <FaImage onClick={() => handle_Click_Image_Icon()} size={25} color="greenyellow" />
                    <input type="file" ref={image_element} accept="image/*" capture="user" onChange={handle_Capture} />
                    {/* <PiVideoFill onClick={() => handleClickVideoIcon()} size={25} color="red" /> */}
                </div>
                <div className={style.preview}>
                    <div className={style.previewImage}>{preview && <img src={preview} alt="previewImage" />}</div>
                    <div></div>
                </div>
                <div>
                    <div onClick={() => handle_Create()}>{CREATE_CHECK_IN_OUT}</div>
                </div>
            </div>
        </div>
    );
};

export default memo(CreateCheckInOut);
