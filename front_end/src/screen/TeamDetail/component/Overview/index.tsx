import { memo } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import GlobalLoading from '@src/Global/GlobalLoading';
import GlobalToastMessage from '@src/Global/GlobalToastMessage';
import { avatarnull } from '@src/utility/string';

const Overview = () => {
    return (
        <div className={style.parent}>
            <div className={style.avatar}>
                <img src={avatarnull} alt="Team Image" />
            </div>
            <div className={style.name}>John Doe</div>
            <div className={style.type}>Sales</div>
            <div className={style.icons}>
                <FaLock size={20} color="red" />
                <MdDelete size={20} color="red" />
            </div>
        </div>
    );
};

export default memo(Overview);
