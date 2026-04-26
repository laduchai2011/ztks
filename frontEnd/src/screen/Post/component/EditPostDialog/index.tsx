import { memo, useEffect, useRef, useState, useId } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CiImageOn } from 'react-icons/ci';
import TextEditor from '@src/component/TextEditor';
import { CLOSE, AGREE, EXIT, EDIT_POST } from '@src/const/text';
import { setData_toastMessage, set_isLoading, setIsShow_editPostDialog } from '@src/redux/slice/Post';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { PostField } from '@src/dataStruct/post';
import { PostTypeEnum, PostTypeType, RegisterPostTypeEnum } from '@src/dataStruct/post';
import { isPositiveInteger } from '@src/utility/string';

const EditPostDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const imageInput_element = useRef<HTMLInputElement | null>(null);

    const isShow: boolean = useSelector((state: RootState) => state.PostSlice.editPostDialog.isShow);
    const post: PostField | undefined = useSelector((state: RootState) => state.PostSlice.editPostDialog.post);

    const [name, setName] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [type, setType] = useState<PostTypeType>(PostTypeEnum.FREE);
    const [index, setIndex] = useState<string>('1');
    const [describe, setDescribe] = useState<string>('');
    const [images, setImages] = useState<File[]>([]);
    const id_imageInput = useId();

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

        setImages((prev) => [...prev, ...(files || [])]);
    };

    const handleClose = () => {
        dispatch(setIsShow_editPostDialog(false));
    };

    const handleAgree = () => {};

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
                        <input value={name} onChange={(e) => handleName(e)} placeholder="Đặt tên dễ nhớ !" />
                    </div>
                    <div className={style.title}>
                        <input value={title} onChange={(e) => handleTitle(e)} placeholder="Tiêu đề !" />
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
                        <TextEditor onChange={(value) => handleDescribe(value)} />
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
                    {/* <div className={style.images}>{list_image}</div> */}
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
