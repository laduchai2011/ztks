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
import CreateZaloTrunkDialog from './component/CreateZaloTrunkDialog';
import { IoChevronBack } from 'react-icons/io5';
import { route_enum } from '@src/router/type';
import { set__data__toast_message } from '@src/redux/slice/Order';

const OaSetting = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const my_id = sessionStorage.getItem('myId');

    useEffect(() => {
        if (my_id === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, my_id]);

    useEffect(() => {
        return () => {
            dispatch(
                set__data__toast_message({
                    type: undefined,
                    message: '',
                })
            );
        };
    }, [dispatch]);

    const handle_Back = () => {
        navigate(-1);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>
                    <div>{OA_SETTING}</div>
                    <IoChevronBack onClick={() => handle_Back()} size={20} color="white" />
                </div>
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
                    <CreateZaloTrunkDialog />
                </div>
            </div>
        </div>
    );
};

export default OaSetting;
