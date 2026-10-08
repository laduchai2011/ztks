import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { IoMdArrowBack } from 'react-icons/io';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import GlobalLoading from '@src/Global/GlobalLoading';
import GlobalToastMessage from '@src/Global/GlobalToastMessage';
import { avatarnull } from '@src/utility/string';
import Overview from './component/Overview';

const TeamDetail = () => {
    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>
                    <div>Thông tin nhóm</div>
                    <IoMdArrowBack size={30} />
                </div>
                <Overview />
                <div>
                    <GlobalLoading />
                    <GlobalToastMessage />
                </div>
            </div>
        </div>
    );
};

export default TeamDetail;
