import { memo, useEffect, useRef } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { AGREE, EXIT, CLOSE } from '@src/const/text';
import { connectSip } from '../../call';
import { setIsShow_callDialog } from '@src/redux/slice/MessageV1';

const CallDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const isShow: boolean = useSelector((state: RootState) => state.MessageV1Slice.callDialog.isShow);

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
        connectSip();
    }, []);

    const handleClose = () => {
        dispatch(setIsShow_callDialog(false));
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}></div>
                <div className={style.buttonContainer}>
                    <button>{AGREE}</button>
                    <button>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(CallDialog);
