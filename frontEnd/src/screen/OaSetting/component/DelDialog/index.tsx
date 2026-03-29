import { memo, useEffect, useRef } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT } from '@src/const/text';
import { setIsShow_delDialog, setShow_dialogLoading, setData_toastMessage } from '@src/redux/slice/OaSetting';
import { messageType_enum } from '@src/component/ToastMessage/type';

const DelDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const isShow: boolean = useSelector((state: RootState) => state.OaSettingSlice.delDialog.isShow);

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

    const handleClose = () => {
        dispatch(setIsShow_delDialog(false));
    };

    const handleAgree = () => {
        dispatch(setShow_dialogLoading(true));
        const timeout = setTimeout(() => {
            dispatch(setShow_dialogLoading(false));
            dispatch(setIsShow_delDialog(false));
            dispatch(setData_toastMessage({ type: messageType_enum.SUCCESS, message: 'Xóa thành công !' }));
            clearTimeout(timeout);
        }, 4000);
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>Bạn có chắc chắn muốn s435gfdgdfdfh xóa không ?</div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handleAgree()}>{AGREE}</button>
                    <button onClick={() => handleClose()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(DelDialog);
