import { memo, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';

const OneProductCode = () => {
    return (
        <div className={style.parent}>
            <div>OneProductCode</div>
            <div>description description description description description description</div>
        </div>
    );
};

export default memo(OneProductCode);
