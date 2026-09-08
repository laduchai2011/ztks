import { memo } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { route_enum } from '@src/router/type';
import { setData_toastMessage } from '@src/redux/slice/DashBoard';
import { select_enum } from '@src/router/type';
import OneCheck from './component/OneCheck';

const CheckList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    return (
        <div className={style.parent}>
            <OneCheck />
            <OneCheck />
            <OneCheck />
        </div>
    );
};

export default memo(CheckList);
