import { memo, useEffect, useRef } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT } from '@src/const/text';
import {
    setData_toastMessage,
    set_isLoading,
    setIsShow_deleteRegisterPostDialog,
    setNewRegisterPost_deleteRegisterPostDialog,
} from '@src/redux/slice/RegisterPost';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { RegisterPostField } from '@src/dataStruct/post';
import { useDeleteRegisterPostMutation } from '@src/redux/query/postRTK';

const DeleteRegisterPostDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const isShow: boolean = useSelector((state: RootState) => state.RegisterPostSlice.deleteRegisterPostDialog.isShow);
    const registerPost: RegisterPostField | undefined = useSelector(
        (state: RootState) => state.RegisterPostSlice.deleteRegisterPostDialog.registerPost
    );

    const [deleteRegisterPost] = useDeleteRegisterPostMutation();

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
        dispatch(setIsShow_deleteRegisterPostDialog(false));
    };

    const handleAgree = () => {
        if (!registerPost) return;

        dispatch(set_isLoading(true));
        deleteRegisterPost({ id: registerPost.id, accountId: -1 })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    dispatch(setNewRegisterPost_deleteRegisterPostDialog(resData.data));
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: 'Xóa thành công !',
                        })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Xóa thành công !',
                        })
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.content}>{registerPost?.name}</div>
                    <div className={style.text}>Bạn có chắc chắn muốn xóa đăng ký này không ?</div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handleAgree()}>{AGREE}</button>
                    <button onClick={() => handleClose()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(DeleteRegisterPostDialog);
