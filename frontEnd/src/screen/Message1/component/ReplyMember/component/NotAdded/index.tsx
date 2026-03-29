import { FC, memo } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { AccountField } from '@src/dataStruct/account';
import { ChatRoomField } from '@src/dataStruct/chatRoom';
import { useCreateReplyAccountMutation } from '@src/redux/query/accountRTK';
import { setData_toastMessage, set_isLoading } from '@src/redux/slice/MessageV1';
import { messageType_enum } from '@src/component/ToastMessage/type';

const NotAdded: FC<{ index: number; data: AccountField }> = ({ index, data }) => {
    const dispatch = useDispatch<AppDispatch>();
    const chatRoom: ChatRoomField | undefined = useSelector((state: RootState) => state.MessageV1Slice.chatRoom);
    const [createReplyAccount] = useCreateReplyAccountMutation();

    const handleAdd = () => {
        if (!chatRoom) return;

        dispatch(set_isLoading(true));
        createReplyAccount({
            authorizedAccountId: data.id,
            chatRoomId: chatRoom.id,
            accountId: chatRoom.accountId,
        })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess) {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: 'Thêm thành công !',
                        })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Thêm không thành công !',
                        })
                    );
                }
            })
            .catch((err) => console.error(err))
            .finally(() => dispatch(set_isLoading(false)));
    };

    return (
        <div className={style.parent}>
            <div className={style.indexContainer}>{index + 1}</div>
            <div className={style.inforContainer}>
                <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRNzSvQMx07eqW79xIar2vd4x_1NUKPZ7kKUw&s"
                    alt=""
                />
                <div>{data.firstName + ' ' + data.lastName}</div>
            </div>
            <div className={style.btnContainer}>
                <button onClick={() => handleAdd()}>Thêm</button>
            </div>
        </div>
    );
};

export default memo(NotAdded);
