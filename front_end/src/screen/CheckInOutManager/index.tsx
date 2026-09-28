import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';
import ToolBar from '@src/screen/ToolBar';
import CheckListMember from './component/CheckListMember';
import { route_enum } from '@src/router/type';
import { set__data__toast_message } from '@src/redux/slice/Dash_Board';
import { select_enum } from '@src/router/type';

const CheckInOutManager = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const my_id = sessionStorage.getItem('myId');

    const is_show: boolean = useSelector((state: RootState) => state.Tool_Bar_Slice.is_show);
    const is_max_show: boolean = useSelector((state: RootState) => state.Tool_Bar_Slice.is_max_show);

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

    const hand_Is_Show = () => {
        if (is_show) {
            return style.is_show;
        }
        return;
    };

    const hand_Is_Max_Show = () => {
        if (is_max_show && is_show) {
            return style.is_max_show;
        }
        return;
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={`${style.toolbar} ${hand_Is_Show()} ${hand_Is_Max_Show()}`}>
                    <ToolBar selected={select_enum.CHECK_IN_OUT_MANAGER} />
                </div>
                <div className={`${style.main1} ${hand_Is_Show()} ${hand_Is_Max_Show()}`}>
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
