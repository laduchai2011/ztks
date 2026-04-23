import { useEffect } from 'react';
import AppRouter from '@src/router';
import 'react-day-picker/dist/style.css';
import axiosInstance from '@src/api/axiosInstance';
import { MyResponse } from '@src/dataStruct/response';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { set_account, set_accountInformation } from '@src/redux/slice/App';
import { AccountField, AccountInformationField } from '@src/dataStruct/account';
// import { getSocket } from '@src/socketIo';

const App = () => {
    const dispatch = useDispatch<AppDispatch>();
    // const accountInformation: AccountInformationField | undefined = useSelector(
    //     (state: RootState) => state.AppSlice.accountInformation
    // );
    // const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);

    // useEffect(() => {
    //     if (!account) return;

    //     const socket = getSocket();
    //     const room = account.id.toString();

    //     const onConnect = () => {
    //         socket.emit('joinRoom', room);
    //     };

    //     socket.on('connect', onConnect);

    //     // nếu socket đã connect sẵn từ trước thì join luôn
    //     if (socket.connected) {
    //         onConnect();
    //     }

    //     return () => {
    //         socket.emit('leaveRoom', room);
    //         socket.off('connect', onConnect);
    //     };
    // }, [account]);

    useEffect(() => {
        const myId = sessionStorage.getItem('myId');

        if (myId === null) {
            const fetchCheckSignin = async () => {
                try {
                    const response = await axiosInstance.get<MyResponse<number>>(`/service_account/query/isSignin`);
                    const resData = response.data;
                    if (resData.isSuccess) {
                        if (resData.data) {
                            sessionStorage.setItem('myId', `${resData.data}`);
                        } else {
                            sessionStorage.removeItem('myId');
                        }
                    }
                } catch (error) {
                    console.error(error);
                }
            };

            fetchCheckSignin();
        }
    }, []);

    useEffect(() => {
        const getAccountInformation = async () => {
            try {
                const response = await axiosInstance.get<MyResponse<AccountInformationField>>(
                    `/service_account/query/getAccountInformation`
                );
                const resData = response.data;
                // console.log('getAccountInformation', resData);
                if (resData.isSuccess) {
                    if (resData.data) {
                        dispatch(set_accountInformation(resData.data));
                        sessionStorage.setItem('accountInformation', `${JSON.stringify(resData.data)}`);
                    } else {
                        sessionStorage.removeItem('accountInformation');
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        getAccountInformation();
    }, [dispatch]);

    useEffect(() => {
        const getAccount = async () => {
            try {
                const response = await axiosInstance.get<MyResponse<AccountField>>(`/service_account/query/getMe`);
                const resData = response.data;
                if (resData.isSuccess) {
                    if (resData.data) {
                        dispatch(set_account(resData.data));
                        sessionStorage.setItem('account', `${JSON.stringify(resData.data)}`);
                    } else {
                        sessionStorage.removeItem('account');
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        getAccount();
    }, [dispatch]);

    return (
        <div>
            <AppRouter />
        </div>
    );
};

export default App;
