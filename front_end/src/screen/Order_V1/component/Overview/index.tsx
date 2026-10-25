import { memo, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import AllOrderView from './component/AllOrderView';
import SuccessOrderView from './component/SuccessOrderView';
import UnFinishedOrderView from './component/UnFinishedOrderView';
import FailureOrderView from './component/FailureOrderView';
import DeletedOrderView from './component/DeletedOrderView';
import AllMoneyView from './component/AllMoneyView';

const Overview = () => {
    return (
        <div className={style.parent}>
            <AllOrderView />
            <SuccessOrderView />
            <UnFinishedOrderView />
            <FailureOrderView />
            <DeletedOrderView />
            <AllMoneyView />
        </div>
    );
};

export default memo(Overview);
