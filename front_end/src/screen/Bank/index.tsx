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
import { setData_toastMessage } from '@src/redux/slice/Bank';
import { route_enum } from '@src/router/type';

const Bank = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const myId = sessionStorage.getItem('myId');

    useEffect(() => {
        if (myId === null) {
            navigate(route_enum.SIGNIN);
        }

        return () => {
            dispatch(
                setData_toastMessage({
                    message: '',
                    type: undefined,
                })
            );
        };
    }, [navigate, myId, dispatch]);

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
