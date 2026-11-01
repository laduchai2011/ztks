import { memo, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
// import { route_enum } from '@src/router/type';
import { HiOutlineCube } from 'react-icons/hi';
import { EDIT_PRODUCT } from '@src/const/text';
import { select_enum } from '@src/router/type';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className={style.parent}>
            <div>
                <HiOutlineCube />
                <span>{EDIT_PRODUCT}</span>
            </div>
            <div>
                <div>Cập nhật</div>
            </div>
        </div>
    );
};

export default memo(Header);
