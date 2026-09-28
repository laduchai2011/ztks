import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { route_enum } from '@src/router/type';
import { SHOP } from '@src/const/text';
import ToolBar from '@src/screen/ToolBar';
import { select_enum } from '@src/router/type';
import List from './component/List';

const Shop = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const my_id = sessionStorage.getItem('myId');

    const is_show: boolean = useSelector((state: RootState) => state.Tool_Bar_Slice.is_show);
    const is_max_show: boolean = useSelector((state: RootState) => state.Tool_Bar_Slice.is_max_show);

    useEffect(() => {
        if (my_id === null) {
            navigate(route_enum.SIGNIN);
        }

        return () => {
            dispatch(
                global_set__data__toast_message({
                    message: '',
                    type: undefined,
                })
            );
        };
    }, [navigate, my_id, dispatch]);

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
                    <ToolBar selected={select_enum.SHOP} />
                </div>
                <div className={`${style.main1} ${hand_Is_Show()} ${hand_Is_Max_Show()}`}>
                    <div>
                        <div className={style.header}>{SHOP}</div>
                        <List />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shop;
