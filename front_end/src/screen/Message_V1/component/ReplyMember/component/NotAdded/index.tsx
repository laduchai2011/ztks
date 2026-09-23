import { FC, memo } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { Account_Field } from '@src/data_struct/account';
import { Chat_Room_Field } from '@src/data_struct/chat_room';
import { use_create_Reply_Account_Mutation } from '@src/redux/query/account_RTK';
import { set__data__toast_message, set__is_loading } from '@src/redux/slice/Message_V1';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { avatarnull } from '@src/utility/string';
import { handleSrcImage } from '@src/utility/string';

const NotAdded: FC<{ index: number; data: Account_Field }> = ({ index, data }) => {
    const dispatch = useDispatch<AppDispatch>();
    const chat_room: Chat_Room_Field | undefined = useSelector((state: RootState) => state.Message_V1_Slice.chat_room);

    const [create_Reply_Account] = use_create_Reply_Account_Mutation();

    const handle_Add = () => {
        if (!chat_room) return;

        dispatch(set__is_loading(true));
        create_Reply_Account({
            authorized_account_id: data.id,
            chat_room_id: chat_room.id,
            account_id: chat_room.account_id,
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success) {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.SUCCESS,
                            message: 'Thêm thành công !',
                        })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Thêm không thành công !',
                        })
                    );
                }
            })
            .catch((err) => console.error(err))
            .finally(() => dispatch(set__is_loading(false)));
    };

    const avatar_url = data.avatar ? handleSrcImage(data.avatar) : avatarnull;

    return (
        <div className={style.parent}>
            <div className={style.indexContainer}>{index + 1}</div>
            <div className={style.inforContainer}>
                <img src={avatar_url} alt="" />
                <div>{data.first_name + ' ' + data.last_name}</div>
            </div>
            <div className={style.btnContainer}>
                <button onClick={() => handle_Add()}>Thêm</button>
            </div>
        </div>
    );
};

export default memo(NotAdded);
