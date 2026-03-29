import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { OA_SETTING } from '@src/const/text';
import MyOa from './component/MyOa';
import SessionList from './component/SessionList';
import CreateNewSession from './component/CreateNewSession';
import MyToastMessage from './component/MyToastMessage';
import DelDialog from './component/DelDialog';
import DialogLoading from './component/DialogLoading';
import { route_enum } from '@src/router/type';

const OaSetting = () => {
    const navigate = useNavigate();
    const myId = sessionStorage.getItem('myId');

    useEffect(() => {
        if (myId === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, myId]);

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
                </div>
            </div>
        </div>
    );
};

export default OaSetting;
