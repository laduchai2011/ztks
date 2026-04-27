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
    setData_toastMessage,
    set_isLoading,
    setIsShow_editPostDialog,
    setNewPost_editPostDialog,
} from '@src/redux/slice/Post';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { AccountField } from '@src/dataStruct/account';
import { PostField, RegisterPostField, RegisterPostTypeEnum, PostTypeEnum, PostTypeType } from '@src/dataStruct/post';
import { EditPostBodyField } from '@src/dataStruct/post/body';
import { isPositiveInteger } from '@src/utility/string';
import { uploadImage } from '../../handle';
import { useEditPostMutation } from '@src/redux/query/postRTK';

const EditPostDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const imageInput_element = useRef<HTMLInputElement | null>(null);

    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const selectedRegisterPost: RegisterPostField | undefined = useSelector(
        (state: RootState) => state.PostSlice.selectedRegisterPost
    );
    const isShow: boolean = useSelector((state: RootState) => state.PostSlice.editPostDialog.isShow);
    const post: PostField | undefined = useSelector((state: RootState) => state.PostSlice.editPostDialog.post);

    const [name, setName] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [type, setType] = useState<PostTypeType>(PostTypeEnum.FREE);
    const [index, setIndex] = useState<string>('1');
    const [describe, setDescribe] = useState<string>('');
    const [images, setImages] = useState<string[]>([]);
    const [newImages, setNewImages] = useState<File[]>([]);
    const id_imageInput = useId();

    const [editPost] = useEditPostMutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (isShow) {
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
    }, [isShow]);

    useEffect(() => {
        if (!post) return;
        setName(post.name);
        setTitle(post.title);
        setType(post.type);
        setIndex(post.index.toString());
        setDescribe(post.describe);
        setImages(JSON.parse(post.images));

        return () => {
            setNewImages([]);
        };
    }, [post]);

    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleType = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as PostTypeType;
        setType(value);
    };

    const handleIndex = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (!isPositiveInteger(value)) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Thứ tự phải là 1 số nguyên dương !',
                })
            );
        }

        setIndex(value);
    };

    const handleDescribe = (value: string) => {
        setDescribe(value);
    };

    const handleImageIconClick = () => {
        imageInput_element.current?.click();
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files) return;

        setNewImages((prev) => [...prev, ...(files || [])]);
    };

    const handleClose = () => {
        dispatch(setIsShow_editPostDialog(false));
    };

    const handleAgree = async () => {
        if (!account) return;
        if (!post) return;

        if (!selectedRegisterPost) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Vui lòng chọn 1 đăng ký !',
                })
            );
            return;
        }

        const name_t = name.trim();
        if (name_t.length === 0) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Tên không được để trống !',
                })
            );
            return;
        }

        const title_t = title.trim();
        if (title_t.length === 0) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Tiêu đề không được để trống !',
                })
            );
            return;
        }

        if (selectedRegisterPost.type === RegisterPostTypeEnum.FREE && type === PostTypeEnum.UPGRADE) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Bạn đang dùng gói miễn phí không thể tùy chọn nâng cấp !',
                })
            );
            return;
        }

        const index_t = index.trim();
        if (!isPositiveInteger(index_t)) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Thứ tự phải là 1 số nguyên dương !',
                })
            );
            return;
        }

        try {
            dispatch(set_isLoading(true));
            const r_newImages = await handleUploadImages(newImages, account);

            const oleImages = [...images];
            const allImages = oleImages.concat(r_newImages ?? []);

            const editPostBody: EditPostBodyField = {
                id: post.id,
                index: post.index,
                name: name_t,
                title: title_t,
                describe: describe,
                images: JSON.stringify(allImages),
                isActive: true,
                accountId: account.id,
            };

            const r_edit = await editPost(editPostBody);
            const resData = r_edit.data;
            if (resData?.isSuccess && resData.data) {
                dispatch(setNewPost_editPostDialog(resData.data));
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.SUCCESS,
                        message: 'Chỉnh sửa bài đăng thành công !',
                    })
                );
            } else {
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Chỉnh sửa bài đăng không thành công !',
                    })
                );
            }
        } catch (error) {
            console.error(error);
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Đã có lỗi xảy ra !',
                })
            );
        } finally {
            dispatch(set_isLoading(false));
        }
    };

    const list_type = [PostTypeEnum.FREE, PostTypeEnum.UPGRADE].map((item, index) => {
        let text: string = '';

        switch (item) {
            case PostTypeEnum.FREE: {
                text = 'Miễn phí';
                break;
            }
            case PostTypeEnum.UPGRADE: {
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

    const handleCloseImageUrl = useCallback((index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const list_imageUrl = images.map((item, index) => {
        return <OneImageUrl fileName={item} index={index} handleCloseImage={handleCloseImageUrl} key={index} />;
    });

    const handleUploadImages = async (images: File[], account: AccountField) => {
        try {
            dispatch(set_isLoading(true));
            const fileNames: string[] = [];

            for (let i: number = 0; i < images.length; i++) {
                const resData_image = await uploadImage(images[i], account.id.toString());
                if (!resData_image) {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Đăng tải hình ảnh thất bại !',
                        })
                    );
                    break;
                }
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.SUCCESS,
                        message: 'Đăng tải hình ảnh thành công !',
                    })
                );

                const fileName = resData_image.fileName;
                fileNames.push(fileName);
            }

            return fileNames;
        } catch (error) {
            console.error(error);
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Đã có lỗi xảy ra !',
                })
            );
        } finally {
            dispatch(set_isLoading(false));
        }
    };

    const handleCloseImageFile = useCallback((index: number) => {
        setNewImages((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const list_imageFile = newImages.map((item, index) => {
        return <OneImageFile file={item} index={index} handleCloseImage={handleCloseImageFile} key={index} />;
    });

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.header}>
                        <div>{EDIT_POST}</div>
                    </div>
                    <div className={style.name}>
                        <input
                            value={name}
                            onChange={(e) => handleName(e)}
                            placeholder="Đặt tên dễ nhớ !"
                            maxLength={50}
                        />
                    </div>
                    <div className={style.title}>
                        <input value={title} onChange={(e) => handleTitle(e)} placeholder="Tiêu đề !" maxLength={255} />
                    </div>
                    <div className={style.type}>
                        <select value={type} onChange={(e) => handleType(e)}>
                            {list_type}
                        </select>
                    </div>
                    <div className={style.index}>
                        <div>
                            <div>Chọn thứ tự hiển thị bài viết</div>
                            <input value={index} onChange={(e) => handleIndex(e)} />
                        </div>
                    </div>
                    <div>
                        <TextEditor value={post?.describe} onChange={(value) => handleDescribe(value)} />
                    </div>
                    <div className={style.icons}>
                        <CiImageOn id={id_imageInput} onClick={handleImageIconClick} size={25} color="green" />
                        <input
                            ref={imageInput_element}
                            onChange={handleImageChange}
                            type="file"
                            id={id_imageInput}
                            accept="image/*"
                            multiple
                        />
                    </div>
                    <div className={style.images}>{list_imageUrl}</div>
                    <div className={style.images}>{list_imageFile}</div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handleAgree()}>{AGREE}</button>
                    <button onClick={() => handleClose()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(EditPostDialog);
