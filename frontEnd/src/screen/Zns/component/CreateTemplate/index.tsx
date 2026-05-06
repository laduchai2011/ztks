import { memo, useState, useRef, useId, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoIosAddCircle } from 'react-icons/io';
import { GrSubtractCircle } from 'react-icons/gr';
import { IoCloseOutline } from 'react-icons/io5';
import { CiImageOn } from 'react-icons/ci';
import { CREATE_TEMPLATE } from '@src/const/text';
import { useCreateZnsTemplateMutation } from '@src/redux/query/zaloRTK';
import { CreateZnsTemplateBodyField } from '@src/dataStruct/zalo/body';
import { setData_toastMessage, set_isLoading, setData_addNewZnsTemplate } from '@src/redux/slice/Zns';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { AccountField } from '@src/dataStruct/account';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { uploadImage } from '../../handle';

const CreateTemplate = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const selectedOa: ZaloOaField | undefined = useSelector((state: RootState) => state.ZnsSlice.selectedOa);

    const imageInput_element = useRef<HTMLInputElement | null>(null);
    const id_imageInput = useId();
    const [image, setImage] = useState<File | undefined>(undefined);
    const [preView, setPreView] = useState<string | undefined>(undefined);

    const [isShowParent, setIsShowParent] = useState(false);
    const [isDisplayBtn, setIsDisplayBtn] = useState(true);
    const [isShowBtn, setIsShowBtn] = useState(true);
    const [isDisplayIcon, setIsDisplayIcon] = useState(false);
    const [isShowIcon, setIsShowIcon] = useState(false);
    const [temId, setTemId] = useState<string>('');
    const [parameters, setParameters] = useState<string[]>(['']);

    const [createZnsTemplate] = useCreateZnsTemplateMutation();

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

    const handleTemId = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTemId(value);
    };

    const handleAddParameter = () => {
        setParameters((prev) => [...prev, '']);
    };

    const handleSubParameter = (index: number) => {
        const newParameters = [...parameters];
        newParameters.splice(index, 1);
        setParameters(newParameters);
    };

    const handleValueParameter = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        const newParameters = [...parameters];
        newParameters[index] = value;
        setParameters(newParameters);
    };

    const handleImageIconClick = () => {
        imageInput_element.current?.click();
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files) return;

        const file = files[0];

        setImage(file);
    };

    useEffect(() => {
        if (!image) return;
        const preView_ = URL.createObjectURL(image);
        setPreView(preView_);

        return () => {
            URL.revokeObjectURL(preView_);
            setPreView(undefined);
        };
    }, [image]);

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

    const handleCreate = async () => {
        if (!account) return;
        if (!selectedOa) return;

        const temId_t = temId.trim();
        if (temId_t.length === 0) {
            dispatch(
                setData_toastMessage({ type: messageType_enum.ERROR, message: 'Định danh mẫu không được để trống !' })
            );
            return;
        }

        const parameters_t: string[] = [];
        for (let i: number = 0; i < parameters.length; i++) {
            const parameter_t = parameters[i].trim();
            if (parameter_t.length === 0) {
                dispatch(
                    setData_toastMessage({ type: messageType_enum.ERROR, message: 'Không được để trống các trường !' })
                );
                return;
            }
            parameters_t.push(parameter_t);
        }

        if (!image) {
            dispatch(
                setData_toastMessage({ type: messageType_enum.ERROR, message: 'Bắt buộc phải có hình ảnh minh họa !' })
            );
            return;
        }

        const r_images = await handleUploadImages([image], account);

        if (!r_images) {
            dispatch(setData_toastMessage({ type: messageType_enum.ERROR, message: 'Đăng tải hình ảnh thất bại !' }));
            return;
        }

        const createZnsTemplateBody: CreateZnsTemplateBodyField = {
            temId: temId_t,
            images: JSON.stringify(r_images),
            dataFields: JSON.stringify(parameters_t),
            zaloOaId: selectedOa.id,
            accountId: account.id,
        };

        dispatch(set_isLoading(true));
        createZnsTemplate(createZnsTemplateBody)
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    dispatch(setData_addNewZnsTemplate(resData.data));
                    dispatch(setData_toastMessage({ type: messageType_enum.SUCCESS, message: 'Tạo mẫu thành công !' }));
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: resData?.message ?? 'Tạo mẫu không thành công !',
                        })
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(setData_toastMessage({ type: messageType_enum.ERROR, message: 'Đã có lỗi xảy ra !' }));
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    };

    const paramter_list = parameters.map((item, index) => {
        return (
            <div className={style.inputContainer} key={index}>
                <div>{`Tham số ${index + 1}`}</div>
                <input value={item} onChange={(e) => handleValueParameter(e, index)} />
                <GrSubtractCircle onClick={() => handleSubParameter(index)} />
            </div>
        );
    });

    return (
        <div className={`${style.parent} ${isShowParent ? style.show : ''}`}>
            <div className={style.header}>
                <div
                    className={`${style.btn} ${isDisplayBtn ? style.display : ''} ${isShowBtn ? style.show : ''}`}
                    onClick={() => handleHBtn()}
                >
                    {CREATE_TEMPLATE}
                </div>
                <IoCloseOutline
                    className={`${style.icon} ${isDisplayIcon ? style.display : ''} ${isShowIcon ? style.show : ''}`}
                    onClick={() => handleHIcon()}
                    size={25}
                />
            </div>
            <div className={style.content}>
                <div className={style.fieldContainer}>
                    <div className={style.inputContainer}>
                        <div>Định danh mẫu</div>
                        <input value={temId} onChange={(e) => handleTemId(e)} />
                    </div>
                </div>
                <div className={style.fieldContainer}>{paramter_list}</div>
                <div className={style.iconContainer}>
                    <input
                        ref={imageInput_element}
                        onChange={handleImageChange}
                        type="file"
                        id={id_imageInput}
                        accept="image/*"
                    />
                    <CiImageOn id={id_imageInput} onClick={handleImageIconClick} size={25} color="green" />
                    <IoIosAddCircle onClick={() => handleAddParameter()} size={25} color="gray" />
                </div>
                <div className={style.imgContainer}>{preView && <img src={preView} alt="" />}</div>
                <div className={style.btnContainer}>
                    <div className={style.btn} onClick={() => handleCreate()}>
                        {CREATE_TEMPLATE}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(CreateTemplate);
