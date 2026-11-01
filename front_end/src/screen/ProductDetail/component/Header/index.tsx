import { memo, useEffect } from 'react';
import style from './style.module.scss';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { route_enum } from '@src/router/type';
import { HiOutlineCube } from 'react-icons/hi';
import { PRODUCT_DETAIL } from '@src/const/text';
import { select_enum } from '@src/router/type';

const Header = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const { id } = useParams<{ id: string }>();

    const handle_Go_To_Edit_Product = () => {
        navigate(route_enum.EDIT_PRODUCT + '/' + `${1}`);
    };

    return (
        <div className={style.parent}>
            <div>
                <HiOutlineCube />
                <span>{PRODUCT_DETAIL}</span>
            </div>
            <div>
                <div onClick={() => handle_Go_To_Edit_Product()}>Chỉnh sửa</div>
            </div>
        </div>
    );
};

export default memo(Header);
