import { memo, useCallback, useState, useId, useRef } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { CiImageOn } from 'react-icons/ci';
import OneImage from './component/OneImage';
import { CREATE_POST } from '@src/const/text';
import TextEditor from '@src/component/TextEditor';
import { use_create_Post_Mutation } from '@src/redux/query/post_RTK';
import { Account_Field } from '@src/data_struct/account';
import { set__is_loading, set__data__toast_message, add__post_list } from '@src/redux/slice/Post';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { Register_Post_Field, Post_Type_Enum, Post_Type_Type, Register_Post_Type_Enum } from '@src/data_struct/post';
import { Create_Post_Body_Field } from '@src/data_struct/post/body';
import { isPositiveInteger } from '@src/utility/string';
import { uploadImage } from '../../handle';

const CreatePost = () => {
    const dispatch = useDispatch<AppDispatch>();

    const imageInput_element = useRef<HTMLInputElement | null>(null);

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const selected_register_post: Register_Post_Field | undefined = useSelector(
        (state: RootState) => state.Post_Slice.selected_register_post
    );

    const [is_show_parent, set__is_show_parent] = useState(false);
    const [is_display_btn, set__is_display_btn] = useState(true);
    const [is_show_btn, set__is_show_btn] = useState(true);
    const [is_display_icon, set__is_display_icon] = useState(false);
    const [is_show_icon, set__is_show_icon] = useState(false);
    const [name, set__name] = useState<string>('');
    const [title, set__title] = useState<string>('');
    const [type, set__type] = useState<Post_Type_Type>(Post_Type_Enum.FREE);
    const [index, set__index] = useState<string>('1');
    const [describe, set__describe] = useState<string>('');
    const [images, set__images] = useState<File[]>([]);
    const id_image_input = useId();

    const [create_Post] = use_create_Post_Mutation();

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

    const handle_Name = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__name(e.target.value);
    };

    const handle_Title = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__title(e.target.value);
    };

    const handle_Type = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as Post_Type_Type;
        set__type(value);
    };

    const handle_Index = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!isPositiveInteger(value)) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Thứ tự phải là 1 số nguyên dương !',
                })
            );
        }

        set__index(value);
    };

    const handle_Describe = (value: string) => {
        set__describe(value);
    };

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

        if (!selected_register_post) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Vui lòng chọn 1 đăng ký !',
                })
            );
            return;
        }

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

        const title_t = title.trim();
        if (title_t.length === 0) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Tiêu đề không được để trống !',
                })
            );
            return;
        }

        if (selected_register_post.type === Register_Post_Type_Enum.FREE && type === Post_Type_Enum.UPGRADE) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Bạn đang dùng gói miễn phí không thể tùy chọn nâng cấp !',
                })
            );
            return;
        }

        const index_t = index.trim();
        if (!isPositiveInteger(index_t)) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Thứ tự phải là 1 số nguyên dương !',
                })
            );
            return;
        }

        try {
            dispatch(set__is_loading(true));

            const r_images = await handle_Upload_Images(images, account);

            const create_post_body: Create_Post_Body_Field = {
                index: Number(index_t),
                name: name_t,
                type: type,
                title: title_t,
                describe: describe,
                images: JSON.stringify(r_images ?? []),
                is_active: true,
                register_post_id: selected_register_post.id,
                account_id: account.id,
            };

            const r_create = await create_Post(create_post_body);
            const res_data = r_create.data;
            if (res_data?.is_success && res_data.data) {
                dispatch(add__post_list(res_data.data));
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.SUCCESS,
                        message: 'Tạo bài đăng thành công !',
                    })
                );
            } else {
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Tạo bài đăng không thành công !',
                    })
                );
            }
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

        set__images((prev) => [...prev, ...(files || [])]);
    };

    const handle_Close_Image = useCallback((index: number) => {
        set__images((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const list_image = images.map((item, index) => {
        return <OneImage file={item} index={index} key={index} handle_Close_Image={handle_Close_Image} />;
    });

    const list_type = [Post_Type_Enum.FREE, Post_Type_Enum.UPGRADE].map((item, index) => {
        let text: string = '';

        switch (item) {
            case Post_Type_Enum.FREE: {
                text = 'Miễn phí';
                break;
            }
            case Post_Type_Enum.UPGRADE: {
                text = 'Nâng cấp';
                break;
            }
            default: {
                text = 'Miễn phí';
                break;
            }
        }

        return (
            <option value={item} key={index}>
                {text}
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
                    {CREATE_POST}
                </div>
                <IoCloseOutline
                    className={`${style.icon} ${is_display_icon ? style.display : ''} ${is_show_icon ? style.show : ''}`}
                    onClick={() => handle_H_Icon()}
                    size={25}
                />
            </div>
            <div className={style.content}>
                <div className={style.name}>
                    <input
                        value={name}
                        onChange={(e) => handle_Name(e)}
                        placeholder="Đặt tên dễ nhớ !"
                        maxLength={50}
                    />
                </div>
                <div className={style.title}>
                    <input value={title} onChange={(e) => handle_Title(e)} placeholder="Tiêu đề !" maxLength={255} />
                </div>
                <div className={style.type}>
                    <select value={type} onChange={(e) => handle_Type(e)}>
                        {list_type}
                    </select>
                </div>
                <div className={style.index}>
                    <div>
                        <div>Chọn thứ tự hiển thị bài viết</div>
                        <input value={index} onChange={(e) => handle_Index(e)} />
                    </div>
                </div>
                <div>
                    <TextEditor onChange={(value) => handle_Describe(value)} />
                </div>
                <div className={style.icons}>
                    <CiImageOn id={id_image_input} onClick={handle_Image_Icon_Click} size={25} color="green" />
                    <input
                        ref={imageInput_element}
                        onChange={handle_Image_Change}
                        type="file"
                        id={id_image_input}
                        accept="image/*"
                        multiple
                    />
                </div>
                <div className={style.images}>{list_image}</div>
                <div className={style.btnContainer}>
                    <div onClick={() => handle_Create()}>{CREATE_POST}</div>
                </div>
            </div>
        </div>
    );
};

export default memo(CreatePost);
