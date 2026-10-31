import { memo, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import ChartAccordingToMoney from './component/ChartAccordingToMoney';
import ChartAccordingToQuantity from './component/ChartAccordingToQuantity';

const Overview = () => {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className={style.parent}>
            <div className={style.view1}>
                <div>
                    <div>100</div>
                    <div>Mã sản phẩm</div>
                </div>
                <div>
                    <div>1.000</div>
                    <div>Sản phẩm</div>
                </div>
            </div>
            <div className={style.view2}>
                <div>
                    <ChartAccordingToMoney />
                </div>
                <div>
                    <ChartAccordingToQuantity />
                </div>
            </div>
        </div>
    );
};

export default memo(Overview);
