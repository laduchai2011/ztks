import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { route_enum } from '@src/router/type';
import { IoMdArrowBack } from 'react-icons/io';
import GlobalLoading from '@src/Global/GlobalLoading';
import GlobalToastMessage from '@src/Global/GlobalToastMessage';
import Overview from './component/Overview';
import AddMember from './component/AddMember';
import List from './component/List';
import EditTeamDialog from './component/EditTeamDialog';
import DeleteTeamDialog from './component/DeleteTeamDialog';
import DeleteTeamMemberDialog from './component/DeleteTeamMemberDialog';

const TeamDetail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const my_id = sessionStorage.getItem('myId');

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
                    <EditTeamDialog />
                    <DeleteTeamDialog />
                    <DeleteTeamMemberDialog />
                </div>
            </div>
        </div>
    );
};

export default TeamDetail;
