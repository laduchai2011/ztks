import { memo, FC, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { MdDeleteOutline, MdOutlineUpgrade } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import { RegisterPostField, RegisterPostTypeEnum } from '@src/dataStruct/post';
import { detailTime } from '@src/utility/time';
import {
    setData_toastMessage,
    setIsShow_editRegisterPostDialog,
    setRegisterPost_editRegisterPostDialog,
    setNewRegisterPost_editRegisterPostDialog,
    setIsShow_deleteRegisterPostDialog,
    setRegisterPost_deleteRegisterPostDialog,
    setNewRegisterPost_deleteRegisterPostDialog,
} from '@src/redux/slice/RegisterPost';
import { messageType_enum } from '@src/component/ToastMessage/type';

const OneRegisterPost: FC<{ data: RegisterPostField }> = ({ data }) => {
    const dispatch = useDispatch<AppDispatch>();
    const newRegisterPostE: RegisterPostField | undefined = useSelector(
        (state: RootState) => state.RegisterPostSlice.editRegisterPostDialog.newRegisterPost
    );
    const newRegisterPostD: RegisterPostField | undefined = useSelector(
        (state: RootState) => state.RegisterPostSlice.deleteRegisterPostDialog.newRegisterPost
    );

    const [registerPost, setRegisterPost] = useState<RegisterPostField>(data);

    useEffect(() => {
        if (!newRegisterPostE) return;
        if (newRegisterPostE.id === registerPost.id) {
            setRegisterPost(newRegisterPostE);
        }
        dispatch(setNewRegisterPost_editRegisterPostDialog(undefined));
    }, [dispatch, newRegisterPostE, registerPost]);

    useEffect(() => {
        if (!newRegisterPostD) return;
        if (newRegisterPostD.id === registerPost.id) {
            setRegisterPost(newRegisterPostD);
        }
        dispatch(setNewRegisterPost_deleteRegisterPostDialog(undefined));
    }, [dispatch, newRegisterPostD, registerPost]);

    const handleUpgrade = () => {
        dispatch(
            setData_toastMessage({
                type: messageType_enum.NORMAL,
                message: 'Tính năng sắp ra mắt !',
            })
        );
    };

    const handleOpenEdit = () => {
        dispatch(setIsShow_editRegisterPostDialog(true));
        dispatch(setRegisterPost_editRegisterPostDialog(registerPost));
    };

    const handleOpenDelete = () => {
        dispatch(setIsShow_deleteRegisterPostDialog(true));
        dispatch(setRegisterPost_deleteRegisterPostDialog(registerPost));
    };

    return (
        <div className={style.parent}>
            <div className={style.name}>{registerPost.name}</div>
            <div className={style.infor}>
                <div className={style.type}>
                    {registerPost.type === RegisterPostTypeEnum.FREE && <div className={style.free}>Miễn phí</div>}
                    {registerPost.type === RegisterPostTypeEnum.UPGRADE && (
                        <div className={style.upgrade}>Nâng cấp</div>
                    )}
                </div>
                <div className={style.time}>
                    {registerPost.type === RegisterPostTypeEnum.FREE && <div>Không giới hạn</div>}
                    {registerPost.type === RegisterPostTypeEnum.UPGRADE && (
                        <div>{detailTime(registerPost.expiryTime ?? '')}</div>
                    )}
                </div>
            </div>
            <div className={style.status}>
                {registerPost.isDelete && <div className={style.ed}>Đã xóa</div>}
                {!registerPost.isDelete && <div className={style.not}>Hoạt động</div>}
            </div>
            <div className={style.icons}>
                <MdOutlineUpgrade onClick={() => handleUpgrade()} size={18} />
                <CiEdit onClick={() => handleOpenEdit()} size={18} color="green" />
                <MdDeleteOutline onClick={() => handleOpenDelete()} size={18} color="red" />
            </div>
        </div>
    );
};

export default memo(OneRegisterPost);
