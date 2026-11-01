import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
// import { route_enum } from '@src/router/type';
import { HiOutlineCube } from 'react-icons/hi';
import { CREATE_PRODUCT } from '@src/const/text';
import { select_enum } from '@src/router/type';
import GlobalLoading from '@src/Global/GlobalLoading';
import GlobalToastMessage from '@src/Global/GlobalToastMessage';
import Infor1 from './component/Infor1';

const ProductCreate = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const my_id = sessionStorage.getItem('myId');

    useEffect(() => {
        // if (my_id === null) {
        //     navigate(route_enum.SIGNIN);
        // }

        return () => {
            dispatch(
                global_set__data__toast_message({
                    message: '',
                    type: undefined,
                })
            );
        };
    }, [navigate, my_id, dispatch]);

    return (
        <div className={style.parent}>
            <div>
                <div className={style.header}>
                    <HiOutlineCube />
                    <span>{CREATE_PRODUCT}</span>
                </div>
                <Infor1 />
            </div>
        </div>
    );
};

export default ProductCreate;
