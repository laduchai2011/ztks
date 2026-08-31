import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { MANAGE_AGENT } from '@src/const/text';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';
import MemberListDialog from './component/MemberListDialog';
import AgentPayDialog from './component/AgentPayDialog';
import CreateService from './component/CreateService';
import ServiceList from './component/ServiceList';
import { IoChevronBack } from 'react-icons/io5';
import { route_enum } from '@src/router/type';

const ManageAgent = () => {
    const navigate = useNavigate();
    const myId = sessionStorage.getItem('myId');

    useEffect(() => {
        if (myId === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, myId]);

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
