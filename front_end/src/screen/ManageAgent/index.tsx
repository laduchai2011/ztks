import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { MANAGE_AGENT } from '@src/const/text';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';
import MemberListDialog from './component/MemberListDialog';
import AgentPayDialog from './component/AgentPayDialog';
import CreateService from './component/CreateService';
import ServiceList from './component/ServiceList';
import { IoChevronBack } from 'react-icons/io5';
import { route_enum } from '@src/router/type';
import { set__data__toast_message } from '@src/redux/slice/Manage_Agent';

const ManageAgent = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const my_id = sessionStorage.getItem('myId');

    useEffect(() => {
        if (my_id === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, my_id]);

    useEffect(() => {
        dispatch(
            set__data__toast_message({
                type: undefined,
                message: '',
            })
        );
    }, [dispatch]);

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>
                    <div>{MANAGE_AGENT}</div>
                    <IoChevronBack onClick={() => handleBack()} size={20} color="white" />
                </div>
                <CreateService />
                <ServiceList />
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
                <MemberListDialog />
                <AgentPayDialog />
            </div>
        </div>
    );
};

export default ManageAgent;
