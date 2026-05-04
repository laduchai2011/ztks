import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import OaApp from './component/OaApp';
import OaList from './component/OaList';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';
import TakeTokenDialog from './component/TakeTokenDialog';
import CreateZaloOaDialog from './component/CreateZaloOaDialog';
import { OA_LIST } from '@src/const/text';
import { route_enum } from '@src/router/type';
import { setData_toastMessage } from '@src/redux/slice/Oa';

const Oa = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const myId = sessionStorage.getItem('myId');

    useEffect(() => {
        if (myId === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, myId]);

    useEffect(() => {
        dispatch(
            setData_toastMessage({
                type: undefined,
                message: '',
            })
        );
    }, [dispatch]);

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>{OA_LIST}</div>
                <div>
                    <OaApp />
                </div>
                <div>
                    <OaList />
                </div>
                <div>
                    <MyToastMessage />
                    <MyLoading />
                    <TakeTokenDialog />
                    <CreateZaloOaDialog />
                </div>
            </div>
        </div>
    );
};

export default Oa;
