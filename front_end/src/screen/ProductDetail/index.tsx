import { useEffect } from 'react';
import style from './style.module.scss';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
// import { route_enum } from '@src/router/type';
import { select_enum } from '@src/router/type';
import GlobalLoading from '@src/Global/GlobalLoading';
import GlobalToastMessage from '@src/Global/GlobalToastMessage';
import Header from './component/Header';
import Infor1 from './component/Infor1';
import Infor2 from './component/Infor2';
import Infor3 from './component/Infor3';

const ProductDetail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const my_id = sessionStorage.getItem('myId');

    const { id } = useParams<{ id: string }>();

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
                <Header />
                <Infor1 />
                <Infor2 />
                <Infor3 />
            </div>
            <div>
                <GlobalLoading />
                <GlobalToastMessage />
            </div>
        </div>
    );
};

export default ProductDetail;
