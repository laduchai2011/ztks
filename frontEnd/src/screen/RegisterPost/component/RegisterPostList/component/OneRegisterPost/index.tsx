import { memo, FC } from 'react';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { MdDeleteOutline, MdOutlineUpgrade } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import { RegisterPostField, RegisterPostTypeEnum } from '@src/dataStruct/post';
import { detailTime } from '@src/utility/time';
import {
    setIsShow_editRegisterPostDialog,
    setRegisterPost_editRegisterPostDialog,
} from '@src/redux/slice/RegisterPost';

const OneRegisterPost: FC<{ data: RegisterPostField }> = ({ data }) => {
    const dispatch = useDispatch<AppDispatch>();

    const registerPost: RegisterPostField = data;

    const handleOpenEdit = () => {
        dispatch(setIsShow_editRegisterPostDialog(true));
        dispatch(setRegisterPost_editRegisterPostDialog(registerPost));
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
                <MdOutlineUpgrade size={18} />
                <CiEdit onClick={() => handleOpenEdit()} size={18} color="green" />
                <MdDeleteOutline size={18} color="red" />
            </div>
        </div>
    );
};

export default memo(OneRegisterPost);
