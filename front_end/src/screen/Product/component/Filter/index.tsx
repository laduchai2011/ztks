import { memo, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { CiSearch } from 'react-icons/ci';
import { IoMdAdd } from 'react-icons/io';
import { CREATE_PRODUCT } from '@src/const/text';
import { route_enum } from '@src/router/type';

const Filter = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handle_Go_To_Create_Product = () => {
        navigate(route_enum.CREATE_PRODUCT);
    };

    return (
        <div className={style.parent}>
            <div className={style.search}>
                <div>
                    <input placeholder="Tìm kiếm" />
                    <CiSearch />
                </div>
            </div>
            <div className={style.btn}>
                <div onClick={() => handle_Go_To_Create_Product()}>
                    <IoMdAdd />
                    <div>{CREATE_PRODUCT}</div>
                </div>
            </div>
        </div>
    );
};

export default memo(Filter);
