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
    setData_toastMessage,
    set_isLoading,
    setIsShow_editZnsTemplateDialog,
    setNewZnsTemplate_editZnsTemplateDialog,
} from '@src/redux/slice/Zns';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { AccountField } from '@src/dataStruct/account';
import { ZaloOaField, ZnsTemplateField } from '@src/dataStruct/zalo';
import { EditZnsTemplateBodyField } from '@src/dataStruct/zalo/body';
import { useEditZnsTemplateMutation } from '@src/redux/query/zaloRTK';
import { handleSrcImage } from '@src/utility/string';
import { uploadImage } from '../../handle';
import { isPositiveInteger } from '@src/utility/string';

const EditTemplateDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const selectedOa: ZaloOaField | undefined = useSelector((state: RootState) => state.ZnsSlice.selectedOa);
    const isShow: boolean = useSelector((state: RootState) => state.ZnsSlice.editZnsTemplateDialog.isShow);
    const znsTemplate: ZnsTemplateField | undefined = useSelector(
        (state: RootState) => state.ZnsSlice.editZnsTemplateDialog.znsTemplate
    );

    const imageInput_element = useRef<HTMLInputElement | null>(null);
    const id_imageInput = useId();
    const [image, setImage] = useState<File | undefined>(undefined);
    const [preView, setPreView] = useState<string | undefined>(undefined);
    const [temId, setTemId] = useState<string>('');
    const [phoneCost, setPhoneCost] = useState<string>('');
    const [uidCost, setUidCost] = useState<string>('');
    const [parameters, setParameters] = useState<string[]>(['']);

    const [znsTemplate1, setZnsTemplate1] = useState<ZnsTemplateField | undefined>(undefined);
    const [editZnsTemplate] = useEditZnsTemplateMutation();

    useEffect(() => {
        if (!znsTemplate) return;
        setZnsTemplate1(znsTemplate);
    }, [znsTemplate]);

    useEffect(() => {
        if (!znsTemplate1) return;
        setTemId(znsTemplate1.temId);
        setPhoneCost(znsTemplate1.phoneCost.toString());
        setUidCost(znsTemplate1.uidCost.toString());
        setParameters(JSON.parse(znsTemplate1.dataFields));
        setPreView(handleSrcImage(JSON.parse(znsTemplate1.images)[0]));
    }, [znsTemplate1]);

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

    const handleTemId = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTemId(value);
    };

    const handlePhoneCost = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPhoneCost(value);
    };

    const handleUidCost = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setUidCost(value);
    };

    const handleClose = () => {
        dispatch(setIsShow_editZnsTemplateDialog(false));
    };

    const handleAgree = async () => {
        if (!account) return;
        if (!selectedOa) return;
        if (!znsTemplate1) return;

        const temId_t = temId.trim();
        if (temId_t.length === 0) {
            dispatch(
                setData_toastMessage({ type: messageType_enum.ERROR, message: 'Định danh mẫu không được để trống !' })
            );
            return;
        }

        const phoneCost_t = phoneCost.trim();
        if (!isPositiveInteger(phoneCost_t)) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Chi phí số điện thoại phải là 1 số nguyên dương !',
                })
            );
            return;
        }

        const uidCost_t = uidCost.trim();
        if (!isPositiveInteger(uidCost_t)) {
            dispatch(
                setData_toastMessage({
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
                    setData_toastMessage({ type: messageType_enum.ERROR, message: 'Không được để trống các trường !' })
                );
                return;
            }
            parameters_t.push(parameter_t);
        }

        if (!preView) {
            dispatch(
                setData_toastMessage({ type: messageType_enum.ERROR, message: 'Bắt buộc phải có hình ảnh minh họa !' })
            );
            return;
        }

        let r_images: string[] | undefined = undefined;
        if (image) {
            r_images = await handleUploadImages([image], account);
        }

        const final_images = r_images && r_images?.length > 0 ? JSON.stringify(r_images) : znsTemplate1.images;
        const editZnsTemplateBody: EditZnsTemplateBodyField = {
            id: znsTemplate1.id,
            temId: '',
            images: final_images,
            dataFields: JSON.stringify(parameters_t),
            phoneCost: Number(phoneCost_t),
            uidCost: Number(uidCost_t),
            zaloOaId: selectedOa.id,
            accountId: account.id,
        };

        dispatch(set_isLoading(true));
        editZnsTemplate(editZnsTemplateBody)
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    dispatch(setNewZnsTemplate_editZnsTemplateDialog(resData.data));
                    dispatch(
                        setData_toastMessage({ type: messageType_enum.SUCCESS, message: 'Cập nhật thành công !' })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({ type: messageType_enum.ERROR, message: 'Cập nhật không thành công !' })
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

    const handleAddParameter = () => {
        setParameters((prev) => [...prev, '']);
    };

    const handleValueParameter = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const value = e.target.value;
        const newParameters = [...parameters];
        newParameters[index] = value;
        setParameters(newParameters);
    };

    const handleSubParameter = (index: number) => {
        const newParameters = [...parameters];
        newParameters.splice(index, 1);
        setParameters(newParameters);
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

    const handleImageIconClick = () => {
        imageInput_element.current?.click();
    };

    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;

        if (!files) return;

        const file = files[0];

        setImage(file);
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
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.fieldContainer}>
                        <div className={style.inputContainer}>
                            <div>Định danh mẫu</div>
                            <input value={temId} onChange={(e) => handleTemId(e)} />
                        </div>
                    </div>
                    <div className={style.fieldContainer}>
                        <div className={style.inputContainer}>
                            <div>Chi phí quá sđt</div>
                            <input value={phoneCost} onChange={(e) => handlePhoneCost(e)} />
                        </div>
                    </div>
                    <div className={style.fieldContainer}>
                        <div className={style.inputContainer}>
                            <div>Chi phí qua uid</div>
                            <input value={uidCost} onChange={(e) => handleUidCost(e)} />
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
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handleAgree()}>{AGREE}</button>
                    <button onClick={() => handleClose()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(EditTemplateDialog);
