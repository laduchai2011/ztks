import { memo, useEffect, useRef } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT } from '@src/const/text';
import {
    set__is_show__del_dialog,
    set__is_show__dialog_loading,
    set__data__toast_message,
} from '@src/redux/slice/Oa_Setting';
import { messageType_enum } from '@src/component/ToastMessage/type';

const DelDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const is_show: boolean = useSelector((state: RootState) => state.Oa_Setting_Slice.del_dialog.is_show);

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

    const handle_Close = () => {
        dispatch(set__is_show__del_dialog(false));
    };

    const handle_Agree = () => {
        dispatch(set__is_show__dialog_loading(true));
        const timeout = setTimeout(() => {
            dispatch(set__is_show__dialog_loading(false));
            dispatch(set__is_show__del_dialog(false));
            dispatch(set__data__toast_message({ type: messageType_enum.SUCCESS, message: 'Xóa thành công !' }));
            clearTimeout(timeout);
        }, 4000);
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>Bạn có chắc chắn muốn s435gfdgdfdfh xóa không ?</div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handle_Agree()}>{AGREE}</button>
                    <button onClick={() => handle_Close()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(DelDialog);
