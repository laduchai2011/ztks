import { memo, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import OneProduct from './component/OneProduct';

const List = () => {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className={style.parent}>
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
            <OneProduct />
        </div>
    );
};

export default memo(List);
