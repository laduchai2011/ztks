import { memo, useEffect, useState, useRef } from 'react';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { CREATE_CHECK_IN_OUT } from '@src/const/text';
import { CheckInOutType, CheckInOutEnum } from '@src/dataStruct/checkInOut';
import { CreateCheckInOutBodyField } from '@src/dataStruct/checkInOut/body';
import { setData_toastMessage, set_isLoading } from '@src/redux/slice/CheckInOut';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { useCreateCheckInOutMutation } from '@src/redux/query/checkInOutRTK';
import { FaImage } from 'react-icons/fa';
// import { PiVideoFill } from 'react-icons/pi';

const CreateCheckInOut = () => {
    const dispatch = useDispatch<AppDispatch>();
    const image_element = useRef<HTMLInputElement>(null);
    const checkTypes_element = useRef<HTMLDivElement>(null);

    const [createCheckInOut] = useCreateCheckInOutMutation();

    const [isShowParent, setIsShowParent] = useState(false);
    const [isDisplayBtn, setIsDisplayBtn] = useState(true);
    const [isShowBtn, setIsShowBtn] = useState(true);
    const [isDisplayIcon, setIsDisplayIcon] = useState(false);
    const [isShowIcon, setIsShowIcon] = useState(false);

    const [note, setNote] = useState('');
    const [checkType, setCheckType] = useState<CheckInOutType | null>(null);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!checkTypes_element.current) return;
        const checkTypesElement = checkTypes_element.current;
        const checkTypeElements = checkTypesElement.children;

        switch (checkType) {
            case CheckInOutEnum.IN: {
                checkTypeElements[0].classList.add(style.selected);
                checkTypeElements[1].classList.remove(style.selected);
                break;
            }
            case CheckInOutEnum.OUT: {
                checkTypeElements[0].classList.remove(style.selected);
                checkTypeElements[1].classList.add(style.selected);
                break;
            }
            default: {
                //statements;
                break;
            }
        }
    }, [checkType]);

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

    const handleNote = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setNote(value);
    };

    const handleCheckType = (type: CheckInOutType) => {
        setCheckType(type);
    };

    useEffect(() => {
        if (!image) return;
        const objectUrl = URL.createObjectURL(image);
        setPreview(objectUrl);

        return () => {
            URL.revokeObjectURL(objectUrl);
            setPreview(null);
        };
    }, [image]);
    const handleClickImageIcon = () => {
        image_element.current?.click();
    };
    const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];

        if (!file) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Đã có lỗi xảy ra',
                })
            );
            return;
        }

        setImage(file);
    };

    // const handleClickVideoIcon = () => {};

    const handleCreate = () => {
        // const createNoteBody: CreateNoteBodyField = {
        //     note: content,
        //     chatRoomId: Number(idInput_t),
        //     accountId: -1,
        // };
        // dispatch(set_isLoading(true));
        // createNote(createNoteBody)
        //     .then((res) => {
        //         const resData = res.data;
        //         if (resData?.isSuccess && resData.data) {
        //             dispatch(setData_addNewNote(resData.data));
        //             dispatch(
        //                 setData_toastMessage({ type: messageType_enum.SUCCESS, message: 'Tạo ghi chú thành công !' })
        //             );
        //         } else {
        //             dispatch(
        //                 setData_toastMessage({
        //                     type: messageType_enum.ERROR,
        //                     message: resData?.message ?? 'Tạo ghi chú không thành công !',
        //                 })
        //             );
        //         }
        //     })
        //     .catch((err) => {
        //         dispatch(
        //             setData_toastMessage({ type: messageType_enum.ERROR, message: 'Tạo ghi chú không thành công !' })
        //         );
        //         console.error(err);
        //     })
        //     .finally(() => {
        //         dispatch(set_isLoading(false));
        //     });
    };

    return (
        <div className={`${style.parent} ${isShowParent ? style.show : ''}`}>
            <div className={style.header}>
                <div
                    className={`${style.btn} ${isDisplayBtn ? style.display : ''} ${isShowBtn ? style.show : ''}`}
                    onClick={() => handleHBtn()}
                >
                    {CREATE_CHECK_IN_OUT}
                </div>
                <IoCloseOutline
                    className={`${style.icon} ${isDisplayIcon ? style.display : ''} ${isShowIcon ? style.show : ''}`}
                    onClick={() => handleHIcon()}
                    size={25}
                />
            </div>
            <div className={style.content}>
                <div>
                    <input value={note} onChange={(e) => handleNote(e)} placeholder="Ghi chú" />
                </div>
                <div className={style.checkTypes} ref={checkTypes_element}>
                    <div onClick={() => handleCheckType(CheckInOutEnum.IN)}>Check in</div>
                    <div onClick={() => handleCheckType(CheckInOutEnum.OUT)}>Check out</div>
                </div>
                <div>
                    <FaImage onClick={() => handleClickImageIcon()} size={25} color="greenyellow" />
                    <input type="file" ref={image_element} accept="image/*" capture="user" onChange={handleCapture} />
                    {/* <PiVideoFill onClick={() => handleClickVideoIcon()} size={25} color="red" /> */}
                </div>
                <div className={style.preview}>
                    <div className={style.previewImage}>{preview && <img src={preview} alt="previewImage" />}</div>
                    <div></div>
                </div>
                <div>
                    <div onClick={() => handleCreate()}>{CREATE_CHECK_IN_OUT}</div>
                </div>
            </div>
        </div>
    );
};

export default memo(CreateCheckInOut);
