import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { route_enum, select_enum } from '@src/router/type';
import Header from '../Header';
import OaList from './component/OaList';
import ZnsList from './component/ZnsList';
import CreateTemplate from './component/CreateTemplate';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';
import EditTemplateDialog from './component/EditTemplateDialog';
import SendTemplateDialog from './component/SendTemplateDialog';
import { IoChevronBack } from 'react-icons/io5';
import { set__data__toast_message, clear__new_zns_templates } from '@src/redux/slice/Zns';

const Zns = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const my_id = sessionStorage.getItem('myId');

    useEffect(() => {
        if (my_id === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, my_id]);

    useEffect(() => {
        return () => {
            dispatch(set__data__toast_message({ type: undefined, message: '' }));
            dispatch(clear__new_zns_templates());
        };
    }, [dispatch]);

    const handle_Back = () => {
        navigate(-1);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>
                    <div>ZNS</div>
                    <IoChevronBack onClick={() => handle_Back()} size={20} color="white" />
                </div>
                <OaList />
                <CreateTemplate />
                <ZnsList />
                <div className={style.headerTab}>
                    <Header selected={select_enum.ZNS} />
                </div>
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
                <EditTemplateDialog />
                <SendTemplateDialog />
            </div>
        </div>
    );
};

export default Zns;
