import { memo, useEffect, useRef, useState, useId, useCallback } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CiImageOn } from 'react-icons/ci';
import TextEditor from '@src/component/TextEditor';
import OneImageFile from './component/OneImageFile';
import OneImageUrl from './component/OneImageUrl';
import { CLOSE, AGREE, EXIT, EDIT_POST } from '@src/const/text';
import {
    set__data__toast_message,
    set__is_loading,
    set__is_show__edit_post_dialog,
    set__new_post__edit_post_dialog,
} from '@src/redux/slice/Post';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { Account_Field } from '@src/data_struct/account';
import {
    Post_Field,
    Register_Post_Field,
    Register_Post_Type_Enum,
    Post_Type_Enum,
    Post_Type_Type,
} from '@src/data_struct/post';
import { Edit_Post_Body_Field } from '@src/data_struct/post/body';
import { isPositiveInteger } from '@src/utility/string';
import { uploadImage } from '../../handle';
import { use_edit_Post_Mutation } from '@src/redux/query/post_RTK';

const EditPostDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const imageInput_element = useRef<HTMLInputElement | null>(null);

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const selected_register_post: Register_Post_Field | undefined = useSelector(
        (state: RootState) => state.Post_Slice.selected_register_post
    );
    const is_show: boolean = useSelector((state: RootState) => state.Post_Slice.edit_post_dialog.is_show);
    const post: Post_Field | undefined = useSelector((state: RootState) => state.Post_Slice.edit_post_dialog.post);

    const [name, set__name] = useState<string>('');
    const [title, set__title] = useState<string>('');
    const [type, set__type] = useState<Post_Type_Type>(Post_Type_Enum.FREE);
    const [index, set__index] = useState<string>('1');
    const [describe, set__describe] = useState<string>('');
    const [images, set__images] = useState<string[]>([]);
    const [new_images, set__new_images] = useState<File[]>([]);
    const id_image_input = useId();

    const [edit_Post] = use_edit_Post_Mutation();

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
        if (!post) return;
        set__name(post.name);
        set__title(post.title);
        set__type(post.type);
        set__index(post.index.toString());
        set__describe(post.describe);
        set__images(JSON.parse(post.images));

        return () => {
            set__new_images([]);
        };
    }, [post]);

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

    const handle_Image_Icon_Click = () => {
        imageInput_element.current?.click();
    };

    const handle_Image_Change = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files) return;

        set__new_images((prev) => [...prev, ...(files || [])]);
    };

    const handle_Close = () => {
        dispatch(set__is_show__edit_post_dialog(false));
    };

    const handle_Close_Image_Url = useCallback((index: number) => {
        set__images((prev) => prev.filter((_, i) => i !== index));
    }, []);

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
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.SUCCESS,
                        message: 'Đăng tải hình ảnh thành công !',
                    })
                );

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

    const handle_Close_Image_File = useCallback((index: number) => {
        set__new_images((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const handle_Agree = async () => {
        if (!account) return;
        if (!post) return;

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
            const r_new_images = await handle_Upload_Images(new_images, account);

            const ole_images = [...images];
            const all_images = ole_images.concat(r_new_images ?? []);

            const edit_post_body: Edit_Post_Body_Field = {
                id: post.id,
                index: post.index,
                name: name_t,
                title: title_t,
                describe: describe,
                images: JSON.stringify(all_images),
                is_active: true,
                account_id: account.id,
            };

            const r_edit = await edit_Post(edit_post_body);
            const res_data = r_edit.data;
            if (res_data?.is_success && res_data.data) {
                dispatch(set__new_post__edit_post_dialog(res_data.data));
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.SUCCESS,
                        message: 'Chỉnh sửa bài đăng thành công !',
                    })
                );
            } else {
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Chỉnh sửa bài đăng không thành công !',
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

    const list_image_url = images.map((item, index) => {
        return <OneImageUrl file_name={item} index={index} handle_Close_Image={handle_Close_Image_Url} key={index} />;
    });

    const list_image_file = new_images.map((item, index) => {
        return <OneImageFile file={item} index={index} handle_Close_Image={handle_Close_Image_File} key={index} />;
    });

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.header}>
                        <div>{EDIT_POST}</div>
                    </div>
                    <div className={style.name}>
                        <input
                            value={name}
                            onChange={(e) => handle_Name(e)}
                            placeholder="Đặt tên dễ nhớ !"
                            maxLength={50}
                        />
                    </div>
                    <div className={style.title}>
                        <input
                            value={title}
                            onChange={(e) => handle_Title(e)}
                            placeholder="Tiêu đề !"
                            maxLength={255}
                        />
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
                        <TextEditor value={post?.describe} onChange={(value) => handle_Describe(value)} />
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
                    <div className={style.images}>{list_image_url}</div>
                    <div className={style.images}>{list_image_file}</div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handle_Agree()}>{AGREE}</button>
                    <button onClick={() => handle_Close()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(EditPostDialog);
