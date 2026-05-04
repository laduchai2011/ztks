import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { OA_SETTING } from '@src/const/text';
import MyOa from './component/MyOa';
import SessionList from './component/SessionList';
import CreateNewSession from './component/CreateNewSession';
import MyToastMessage from './component/MyToastMessage';
import DelDialog from './component/DelDialog';
import DialogLoading from './component/DialogLoading';
import TakeTokenDialog from './component/TakeTokenDialog';
import EditZaloOa from './component/EditZaloOa';
import { route_enum } from '@src/router/type';
import { setData_toastMessage } from '@src/redux/slice/Order';

const OaSetting = () => {
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
                <div className={style.header}>{OA_SETTING}</div>
                <div>
                    <MyOa />
                </div>
                <div>
                    <CreateNewSession />
                </div>
                <div>
                    <SessionList />
                </div>
                <div>
                    <MyToastMessage />
                    <DelDialog />
                    <DialogLoading />
                    <TakeTokenDialog />
                    <EditZaloOa />
                </div>
            </div>
        </div>
    );
};

export default OaSetting;
