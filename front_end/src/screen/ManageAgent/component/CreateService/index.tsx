import { memo, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import {
    set_isLoading,
    setData_toastMessage,
    setData_addNewAgent,
    clear_newAgents,
} from '@src/redux/slice/ManageAgent';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { IoIosAddCircle } from 'react-icons/io';
import { useCreateAgentMutation } from '@src/redux/query/agentRTK';

const CreateService = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [createAgent] = useCreateAgentMutation();

    useEffect(() => {
        return () => {
            dispatch(clear_newAgents());
        };
    }, [dispatch]);

    const handleCreateAgent = () => {
        dispatch(set_isLoading(true));
        createAgent({ accountId: -1 })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    dispatch(setData_addNewAgent(resData.data));
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: 'Tạo agent thành công !',
                        })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.NORMAL,
                            message: 'Tạo agent không thành công !',
                        })
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => dispatch(set_isLoading(false)));
    };

    return (
        <div className={style.parent}>
            <IoIosAddCircle onClick={() => handleCreateAgent()} size={25} color="greenyellow" />
        </div>
    );
};

export default memo(CreateService);
