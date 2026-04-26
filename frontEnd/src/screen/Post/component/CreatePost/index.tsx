import { memo, useCallback, useState, useId, useRef } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { CiImageOn } from 'react-icons/ci';
import OneImage from './component/OneImage';
import { CREATE_POST } from '@src/const/text';
import TextEditor from '@src/component/TextEditor';
import { useCreatePostMutation } from '@src/redux/query/postRTK';
import { AccountField } from '@src/dataStruct/account';
import { set_isLoading, setData_toastMessage } from '@src/redux/slice/Post';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { RegisterPostField, PostTypeEnum, PostTypeType } from '@src/dataStruct/post';

const CreatePost = () => {
    const dispatch = useDispatch<AppDispatch>();

    const imageInput_element = useRef<HTMLInputElement | null>(null);

    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const selectedRegisterPost: RegisterPostField | undefined = useSelector(
        (state: RootState) => state.PostSlice.selectedRegisterPost
    );

    const [isShowParent, setIsShowParent] = useState(false);
    const [isDisplayBtn, setIsDisplayBtn] = useState(true);
    const [isShowBtn, setIsShowBtn] = useState(true);
    const [isDisplayIcon, setIsDisplayIcon] = useState(false);
    const [isShowIcon, setIsShowIcon] = useState(false);
    const [name, setName] = useState<string>('');
    const [title, setTitle] = useState<string>('');
    const [type, setType] = useState<PostTypeType>(PostTypeEnum.FREE);
    const [describe, setDescribe] = useState<string>('');
    const [images, setImages] = useState<File[]>([]);
    const id_imageInput = useId();

    const handleHBtn = () => {
        setIsShowParent(true);
        setIsShowBtn(false);
        setTimeout(() => {
            setIsDisplayBtn(false);
        }, 300);
        setIsDisplayIcon(true);
        setTimeout(() => {
            setIsShowIcon(true);
        }, 10);
    };

    const handleHIcon = () => {
        setIsShowParent(false);
        setIsShowIcon(false);
        setTimeout(() => {
            setIsDisplayIcon(false);
        }, 300);
        setIsDisplayBtn(true);
        setTimeout(() => {
            setIsShowBtn(true);
        }, 10);
    };

    // useEffect(() => {
    //     if (!accountInformation || !zaloApp) return;
    //     dispatch(set_isLoading(true));
    //     getZaloOaListWith2Fk({
    //         page: 1,
    //         size: 50,
    //         zaloAppId: zaloApp.id,
    //         accountId: accountInformation.addedById || -1,
    //     })
    //         .then((res) => {
    //             const resData = res.data;
    //             if (resData?.isSuccess && resData.data) {
    //                 setZaloOaList(resData.data.items);
    //             }
    //         })
    //         .catch((err) => {
    //             console.error(err);
    //             dispatch(
    //                 setData_toastMessage({
    //                     type: messageType_enum.ERROR,
    //                     message: 'Đã có lỗi xảy ra !',
    //                 })
    //             );
    //         })
    //         .finally(() => {
    //             dispatch(set_isLoading(false));
    //         });
    // }, [dispatch, accountInformation, getZaloOaListWith2Fk, zaloApp]);

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

    const handleDescribe = (value: string) => {
        setDescribe(value);
    };

    const handleCreate = () => {
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
    };

    const handleImageIconClick = () => {
        imageInput_element.current?.click();
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files) return;

        setImages((prev) => [...prev, ...(files || [])]);
    };

    const handleCloseImage = useCallback((index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
    }, []);

    const list_image = images.map((item, index) => {
        return <OneImage file={item} index={index} key={index} handleCloseImage={handleCloseImage} />;
    });

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
        <div className={`${style.parent} ${isShowParent ? style.show : ''}`}>
            <div className={style.header}>
                <div
                    className={`${style.btn} ${isDisplayBtn ? style.display : ''} ${isShowBtn ? style.show : ''}`}
                    onClick={() => handleHBtn()}
                >
                    {CREATE_POST}
                </div>
                <IoCloseOutline
                    className={`${style.icon} ${isDisplayIcon ? style.display : ''} ${isShowIcon ? style.show : ''}`}
                    onClick={() => handleHIcon()}
                    size={25}
                />
            </div>
            <div className={style.content}>
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
                        <input />
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
                <div className={style.images}>{list_image}</div>
                <div className={style.btnContainer}>
                    <div onClick={() => handleCreate()}>{CREATE_POST}</div>
                </div>
            </div>
        </div>
    );
};

export default memo(CreatePost);
