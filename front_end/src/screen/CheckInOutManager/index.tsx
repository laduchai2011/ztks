import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';
import ToolBar from '@src/screen/ToolBar';
import CheckListMember from './component/CheckListMember';
import { route_enum } from '@src/router/type';
import { setData_toastMessage } from '@src/redux/slice/DashBoard';
import { select_enum } from '@src/router/type';

const CheckInOutManager = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const myId = sessionStorage.getItem('myId');

    useEffect(() => {
        if (myId === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, myId]);

    useEffect(() => {
        return () => {
            dispatch(
                setData_toastMessage({
                    type: undefined,
                    message: '',
                })
            );
        };
    }, [dispatch]);

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <ToolBar selected={select_enum.CHECK_IN_OUT_MANAGER} />
                <div className={style.main1}>
                    <div>
                        <div className={style.header}>Danh sách điểm danh</div>
                        <CheckListMember />
                    </div>
                </div>
                {/* <div className={style.main2}>1</div> */}
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
            </div>
        </div>
    );
};

export default CheckInOutManager;
