import { useEffect } from 'react';
import AppRouter from '@src/router';
import axiosInstance from '@src/api/axiosInstance';
import { MyResponse } from '@src/dataStruct/response';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { set_customer } from '@src/redux/slice/App';
import { CustomerField } from '@src/dataStruct/customer';

const App = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const getCustomer = async () => {
            try {
                const response = await axiosInstance.get<MyResponse<CustomerField>>(`/service_customer/query/getMe`);
                const resData = response.data;
                if (resData.isSuccess) {
                    if (resData.data) {
                        dispatch(set_customer(resData.data));
                        sessionStorage.setItem('myId', `${resData.data.id}`);
                        sessionStorage.setItem('customer', `${JSON.stringify(resData.data)}`);
                    } else {
                        sessionStorage.removeItem('customer');
                    }
                }
            } catch (error) {
                console.error(error);
            }
        };

        getCustomer();
    }, [dispatch]);

    return (
        <div>
            <AppRouter />
        </div>
    );
};

export default App;
