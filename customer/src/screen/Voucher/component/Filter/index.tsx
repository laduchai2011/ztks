import { memo } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoIosSearch } from 'react-icons/io';

const Filter = () => {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className={style.parent}>
            <div>
                <input placeholder="Nhập số điện thoại" />
                <IoIosSearch size={22} />
            </div>
        </div>
    );
};

export default memo(Filter);
