import { memo, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { LEAVE } from '@src/const/text';
import { set__data__toast_message, set__is_loading } from '@src/redux/slice/Leave';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { useLazy_get_My_Chat_Rooms_Query, use_change_Chat_Room_Master_Mutation } from '@src/redux/query/chat_room_RTK';
import { Account_Field, Account_Information_Field } from '@src/data_struct/account';

const LeaveAllChatRoom = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );

    const [is_leave, set__is_leave] = useState<boolean>(false);
    const size = 1;

    const [get_My_Chat_Rooms] = useLazy_get_My_Chat_Rooms_Query();
    const [change_Chat_Room_Master] = use_change_Chat_Room_Master_Mutation();

    const handle_Get_My_Chat_Rooms = async (page: number) => {
        if (!account) return;

        try {
            const res = await get_My_Chat_Rooms({ page: page, size: size, account_id: account.id });
            const res_data = res.data;
            if (res_data?.is_success && res_data.data) {
                return res_data.data;
            }
        } catch (error) {
            console.error(error);
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Đã có lỗi xảy ra !',
                })
            );
        }
    };

    const handle_Change_Chat_Room_Master = async (chat_room_id: string) => {
        if (!account) return false;
        if (!account_information?.added_by_id) return false;
        let is_success: boolean = false;

        try {
            const res = await change_Chat_Room_Master({
                chat_room_id: chat_room_id,
                new_account_id: account_information.added_by_id,
                account_id: account.id,
            });
            const res_data = res.data;
            if (res_data?.is_success && res_data.data) {
                is_success = true;
            }
        } catch (error) {
            console.error(error);
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Đã có lỗi xảy ra !',
                })
            );
        }

        return is_success;
    };

    const handle_Leave_Rooms = async (): Promise<boolean> => {
        dispatch(set__is_loading(true));

        while (true) {
            const paged__chat_room = await handle_Get_My_Chat_Rooms(1);

            if (!paged__chat_room) return false;

            const { items, total_count } = paged__chat_room;

            // xử lý từng room
            for (const room of items) {
                const ok = await handle_Change_Chat_Room_Master(room.id);
                if (!ok) return false;
            }

            const has_more = items.length < total_count;

            if (!has_more) break;
        }

        dispatch(set__is_loading(false));

        return true;
    };

    const handle_Leave = async () => {
        const is = await handle_Leave_Rooms();
        set__is_leave(is);
    };

    return (
        <div className={style.parent}>
            <div className={style.header}>Bạn cần rời khỏi các phòng hội thoại</div>
            <div className={style.buttonContainer}>
                {!is_leave && (
                    <div className={style.btn} onClick={() => handle_Leave()}>
                        {LEAVE}
                    </div>
                )}
                {is_leave && <div className={style.txt}>Đã rời</div>}
            </div>
        </div>
    );
};

export default memo(LeaveAllChatRoom);
