import { useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import MessageBox from './components/MessageBox';
import { HOME } from '@src/const/text';
import { useGetMyCustomersQuery } from '@src/redux/query/myCustomerRTK';
import io from 'socket.io-client';
import Header from '../Header';
import { select_enum } from '@src/router/type';
import { route_enum } from '@src/router/type';
import { SOCKET_URL } from '@src/const/api/socketUrl';
import { SocketType } from '@src/dataStruct/socketIo';
import { MyCustomerField } from '@src/dataStruct/myCustom';

let socket: SocketType;

const Home = () => {
    const navigate = useNavigate();
    const myId = sessionStorage.getItem('myId');
    const [newMes, setNewMes] = useState<any>();
    const [myCustomers, setMyCustomers] = useState<MyCustomerField[]>([]);

    useEffect(() => {
        if (myId === null) {
            navigate(route_enum.SIGNIN);
        }
    }, [navigate, myId]);

    useEffect(() => {
        // Kết nối server
        socket = io(SOCKET_URL || '', { path: '/socket.io/' });
        // socket = io('wss://socketapp.5kaquarium.com', {
        //     path: "/socket.io/",
        // });

        socket.on('connect', () => {
            console.log('Connected:', socket.id);
        });

        // Nhận message từ server
        socket.on('roomMessage', (message: any) => {
            // setMessages((prev) => [...prev, data]);
            setNewMes(message);
            // console.log('roomMessage', message);
        });

        // console.log('myId', myId);
        socket.emit('joinRoom', myId);

        // socket.emit('roomMessage', { roomName: myId, message: 'client hello' });

        return () => {
            socket.emit('leaveRoom', myId);
            socket.disconnect();
        };
    }, [myId]);

    const {
        data: data_myCustomers,
        // isFetching,
        isLoading: isLoading_myCustomers,
        isError: isError_myCustomers,
        error: error_myCustomers,
    } = useGetMyCustomersQuery({ page: 1, size: 1000, accountId: -1 });
    useEffect(() => {
        if (isError_myCustomers && error_myCustomers) {
            console.error(error_myCustomers);
            // dispatch(
            //     setData_toastMessage({
            //         type: messageType_enum.SUCCESS,
            //         message: 'Lấy dữ liệu KHÔNG thành công !',
            //     })
            // );
        }
    }, [isError_myCustomers, error_myCustomers]);
    useEffect(() => {
        // setIsLoading(isLoading_medication);
    }, [isLoading_myCustomers]);
    useEffect(() => {
        const resData = data_myCustomers;
        if (resData?.isSuccess && resData.data) {
            setMyCustomers(resData.data.items);
        }
    }, [data_myCustomers]);

    // useEffect(() => {
    //     console.log('myCustomers', myCustomers);
    // }, [myCustomers]);

    const list_myCustomers = myCustomers.map((item, index) => {
        return <MessageBox data={item} key={index} newMes={newMes} />;
    });

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>{HOME}</div>
                <div className={style.list}>{list_myCustomers}</div>
                <div className={style.headerTab}>
                    <Header selected={select_enum.HOME} />
                </div>
            </div>
        </div>
    );
};

export default Home;
