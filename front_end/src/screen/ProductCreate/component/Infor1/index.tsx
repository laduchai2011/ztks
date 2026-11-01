import { memo, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';

const Infor1 = () => {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className={style.parent}>
            <div className={style.header}>
                <div />
                <div>Thông tin cơ bản</div>
            </div>
            <div className={style.description}>
                <div>
                    Tên sản phẩm <span>*</span>
                </div>
                <div>
                    <input placeholder="Nhập tên sản phẩm ..." />
                </div>
            </div>
        </div>
    );
};

export default memo(Infor1);
