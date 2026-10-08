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
import Overview from './component/Overview';
import AddMember from './component/AddMember';
import List from './component/List';

const TeamDetail = () => {
    const navigate = useNavigate();

    const handle_Back = () => {
        navigate(-1);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>
                    <div>Thông tin nhóm</div>
                    <IoMdArrowBack onClick={() => handle_Back()} size={30} />
                </div>
                <Overview />
                <AddMember />
                <List />
                <div>
                    <GlobalLoading />
                    <GlobalToastMessage />
                </div>
            </div>
        </div>
    );
};

export default TeamDetail;
