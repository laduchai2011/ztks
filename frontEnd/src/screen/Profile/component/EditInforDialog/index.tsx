import { memo, useEffect, useRef, useId, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT } from '@src/const/text';
import { setIsShow_editInforDialog, setData_toastMessage, set_isLoading } from '@src/redux/slice/Profile';
import { messageType_enum } from '@src/component/ToastMessage/type';
import axiosInstance from '@src/api/axiosInstance';
import { MyResponse } from '@src/dataStruct/response';
import { EditInforAccountBodyField } from '@src/dataStruct/account/body';
import { AccountField } from '@src/dataStruct/account';
import { uploadImage } from '../../handle';
import { BASE_URL_API } from '@src/const/api/baseUrl';
import { set_account } from '@src/redux/slice/App';

const EditInforDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const isShow: boolean = useSelector((state: RootState) => state.ProfileSlice.editInforDialog.isShow);

    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const id_imageInput = useId();
    const imageInput_element = useRef<HTMLInputElement | null>(null);
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');

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
        if (!image) return;
        const objectUrl = URL.createObjectURL(image);
        setPreview(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
            setPreview(null);
        };
    }, [image]);

    const handleClickImage = () => {
        imageInput_element.current?.click();
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Đã có lỗi xảy ra',
                })
            );
            return;
        }
        setImage(files[0]);
    };

    const handleDelImage = () => {
        setImage(null);
    };

    const handleClose = () => {
        dispatch(setIsShow_editInforDialog(false));
    };

    const handleAgree = async () => {
        if (!account) return;
        const firstName_final = firstName.trim();
        const lastName_final = lastName.trim();

        try {
            dispatch(set_isLoading(true));
            let avatarUrl: string = '';
            if (image) {
                const resData_image = await uploadImage(image, account.id.toString());
                if (!resData_image) {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Đăng tải hình ảnh thất bại !',
                        })
                    );
                    return;
                }
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.SUCCESS,
                        message: 'Đăng tải hình ảnh thành công !',
                    })
                );

                const fileName = resData_image.fileName;
                avatarUrl = `${BASE_URL_API}/service_image_v1/query/image/${fileName}`;

                if (firstName_final.length === 0 && lastName_final.length === 0 && avatarUrl.length === 0) {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.NORMAL,
                            message: 'Không có gì thay đổi',
                        })
                    );
                    return;
                }

                const editInforAccountBody: EditInforAccountBodyField = {
                    id: account.id,
                    firstName: firstName_final.length > 0 ? firstName_final : account.firstName,
                    lastName: lastName_final.length > 0 ? lastName_final : account.lastName,
                    avatar: avatarUrl,
                };

                const resData_account = await handle_editInforAccount(editInforAccountBody);
                if (resData_account?.isSuccess && resData_account.data) {
                    dispatch(set_account(resData_account.data));
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: 'Chỉnh sửa thông tin thành công !',
                        })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Chỉnh sửa thông tin thất bại !',
                        })
                    );
                }
            }
        } catch (error) {
            console.error('Error uploading image ( EditInforDialog ):', error);
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Đã có lỗi xảy ',
                })
            );
            return;
        } finally {
            dispatch(set_isLoading(false));
        }
    };

    const handle_editInforAccount = async (editInforAccountBody: EditInforAccountBodyField) => {
        try {
            const response = await axiosInstance.post<MyResponse<AccountField>>(
                '/service_account/mutate/editInforAccount',
                editInforAccountBody
            );
            return response.data;
        } catch (error) {
            console.error('Error editing account information:', error);
            throw error;
        }
    };

    const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFirstName(e.target.value);
    };

    const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLastName(e.target.value);
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.header}>Chọn tên và ảnh đại diện mới</div>
                    <div className={style.avatarContainer}>
                        <div className={style.box}>
                            {image && <IoMdClose onClick={() => handleDelImage()} title={CLOSE} />}
                            {!image && (
                                <div className={style.btn} id={id_imageInput} onClick={handleClickImage}>
                                    Chọn ảnh đại diện
                                </div>
                            )}
                            <input
                                ref={imageInput_element}
                                onChange={handleImageChange}
                                type="file"
                                id={id_imageInput}
                                accept="image/*"
                            />
                            {preview && <img className={style.avatar} src={preview} alt="avatar" />}
                        </div>
                    </div>
                    <div className={style.nameContainer}>
                        <input value={firstName} onChange={(e) => handleFirstNameChange(e)} placeholder="Tên đầu" />
                        <input value={lastName} onChange={(e) => handleLastNameChange(e)} placeholder="Tên cuối" />
                    </div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handleAgree()}>{AGREE}</button>
                    <button onClick={() => handleClose()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(EditInforDialog);
