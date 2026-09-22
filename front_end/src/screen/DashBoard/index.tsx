import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';
import ToolBar from '@src/screen/ToolBar';
import Filter from './component/Filter';
import Overview from './component/Overview';
import MemberRank from './component/MemberRank';
import { route_enum } from '@src/router/type';
import { set__data__toast_message } from '@src/redux/slice/Dash_Board';
import { select_enum } from '@src/router/type';

const DashBoard = () => {
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

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <ToolBar selected={select_enum.DASH_BOARD} />
                <div className={style.main1}>
                    <div>
                        <Filter />
                        <Overview />
                        <MemberRank />
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

export default DashBoard;
