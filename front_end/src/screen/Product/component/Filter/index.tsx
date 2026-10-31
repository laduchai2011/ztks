import { memo, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { CiSearch } from 'react-icons/ci';
import { IoMdAdd } from 'react-icons/io';
import { set__is_show_create_order_v1 } from '@src/redux/slice/Order_V1';
import { CREATE_PRODUCT } from '@src/const/text';

const Filter = () => {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className={style.parent}>
            <div className={style.search}>
                <div>
                    <input />
                    <CiSearch />
                </div>
            </div>
            <div className={style.btn}>
                <div>
                    <IoMdAdd />
                    <div>{CREATE_PRODUCT}</div>
                </div>
            </div>
        </div>
    );
};

export default memo(Filter);
