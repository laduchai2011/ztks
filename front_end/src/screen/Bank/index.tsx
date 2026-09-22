import { useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { BANK } from '@src/const/text';
import MyLoading from './component/MyLoading';
import MyToastMessage from './component/MyToastMessage';
import AddBank from './component/AddBank';
import BankList from './component/BankList';
import EditBankDialog from './component/EditBankDialog';
import DeleteBankDialog from './component/DeleteBankDialog';
import { IoChevronBack } from 'react-icons/io5';
import { set__data__toast_message } from '@src/redux/slice/Bank';
import { route_enum } from '@src/router/type';

const Bank = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const my_id = sessionStorage.getItem('myId');

    useEffect(() => {
        if (my_id === null) {
            navigate(route_enum.SIGNIN);
        }

        return () => {
            dispatch(
                set__data__toast_message({
                    message: '',
                    type: undefined,
                })
            );
        };
    }, [navigate, my_id, dispatch]);

    const handleBack = () => {
        navigate(-1);
    };

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>
                    <div>{BANK}</div>
                    <IoChevronBack onClick={() => handleBack()} size={20} color="white" />
                </div>
                <AddBank />
                <BankList />
            </div>
            <div>
                <MyToastMessage />
                <MyLoading />
                <EditBankDialog />
                <DeleteBankDialog />
            </div>
        </div>
    );
};

export default Bank;
