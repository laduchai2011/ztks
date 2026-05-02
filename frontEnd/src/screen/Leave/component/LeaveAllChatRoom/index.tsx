import { memo, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { LEAVE } from '@src/const/text';
import { setData_toastMessage, set_isLoading } from '@src/redux/slice/Leave';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { useLazyGetMyChatRoomsQuery } from '@src/redux/query/chatRoomRTK';
import { useChangeChatRoomMasterMutation } from '@src/redux/query/chatRoomRTK';
import { AccountField, AccountInformationField } from '@src/dataStruct/account';

const LeaveAllChatRoom = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const accountInformation: AccountInformationField | undefined = useSelector(
        (state: RootState) => state.AppSlice.accountInformation
    );

    const [isLeave, setIsLeave] = useState<boolean>(false);
    const size = 1;

    const [getMyChatRooms] = useLazyGetMyChatRoomsQuery();
    const [changeChatRoomMaster] = useChangeChatRoomMasterMutation();

    const handleGetMyChatRooms = async (page: number) => {
        if (!account) return;

        try {
            const res = await getMyChatRooms({ page: page, size: size, accountId: account.id });
            const resData = res.data;
            if (resData?.isSuccess && resData.data) {
                return resData.data;
            }
        } catch (error) {
            console.error(error);
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Đã có lỗi xảy ra !',
                })
            );
        }
    };

    const handleChangeChatRoomMaster = async (chatRoomId: number) => {
        if (!account) return false;
        if (!accountInformation?.addedById) return false;
        let isSuccess: boolean = false;

        try {
            const res = await changeChatRoomMaster({
                chatRoomId: chatRoomId,
                newAccountId: accountInformation.addedById,
                accountId: account.id,
            });
            const resData = res.data;
            if (resData?.isSuccess && resData.data) {
                isSuccess = true;
            }
        } catch (error) {
            console.error(error);
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Đã có lỗi xảy ra !',
                })
            );
        }

        return isSuccess;
    };

    const handleLeaveRooms = async (): Promise<boolean> => {
        dispatch(set_isLoading(true));

        while (true) {
            const pagedChatRoom = await handleGetMyChatRooms(1);

            if (!pagedChatRoom) return false;

            const { items, totalCount } = pagedChatRoom;

            // xử lý từng room
            for (const room of items) {
                const ok = await handleChangeChatRoomMaster(room.id);
                if (!ok) return false;
            }

            const hasMore = items.length < totalCount;

            if (!hasMore) break;
        }

        dispatch(set_isLoading(false));

        return true;
    };

    const handleLeave = async () => {
        const is = await handleLeaveRooms();
        setIsLeave(is);
    };

    return (
        <div className={style.parent}>
            <div className={style.header}>Bạn cần rời khỏi các phòng hội thoại</div>
            <div className={style.buttonContainer}>
                {!isLeave && (
                    <div className={style.btn} onClick={() => handleLeave()}>
                        {LEAVE}
                    </div>
                )}
                {isLeave && <div className={style.txt}>Đã rời</div>}
            </div>
        </div>
    );
};

export default memo(LeaveAllChatRoom);
