import { memo, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import {
    set__is_loading,
    set__data__toast_message,
    set__data__add_new_agent,
    clear__new_agents,
} from '@src/redux/slice/Manage_Agent';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { IoIosAddCircle } from 'react-icons/io';
import { use_create_Agent_Mutation } from '@src/redux/query/agent_RTK';

const CreateService = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [create_Agent] = use_create_Agent_Mutation();

    useEffect(() => {
        return () => {
            dispatch(clear__new_agents());
        };
    }, [dispatch]);

    const handle_Create_Agent = () => {
        dispatch(set__is_loading(true));
        create_Agent({ account_id: '' })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__data__add_new_agent(res_data.data));
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.SUCCESS,
                            message: 'Tạo agent thành công !',
                        })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.NORMAL,
                            message: 'Tạo agent không thành công !',
                        })
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => dispatch(set__is_loading(false)));
    };

    return (
        <div className={style.parent}>
            <IoIosAddCircle onClick={() => handle_Create_Agent()} size={25} color="greenyellow" />
        </div>
    );
};

export default memo(CreateService);
