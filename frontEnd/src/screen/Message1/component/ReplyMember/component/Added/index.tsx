import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { HexColorPicker } from 'react-colorful';
import { AccountField } from '@src/dataStruct/account';
import { ChatRoomRoleField } from '@src/dataStruct/chatRoom';
import { UpdateSetupChatRoomRoleBodyField } from '@src/dataStruct/chatRoom/body';
import avatarnull from '@src/asset/avatar/avatarnull.png';
import { useGetChatRoomRoleWithCridAaidQuery, useUpdateSetupChatRoomRoleMutation } from '@src/redux/query/chatRoomRTK';
import { setData_toastMessage, set_isLoading } from '@src/redux/slice/MessageV1';
import { messageType_enum } from '@src/component/ToastMessage/type';

const Added: FC<{ index: number; data: AccountField }> = ({ index, data }) => {
    const defaultColor = '#EBEBEB';
    const dispatch = useDispatch<AppDispatch>();
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const you: string = account?.id === data.id ? 'Bạn' : '';
    const { id } = useParams<{ id: string }>();
    const [isColorFrame, setIscolorFrame] = useState<boolean>(false);
    const [isRead, setIsRead] = useState<boolean>(false);
    const [isSend, setIsSend] = useState<boolean>(false);
    const [color, setColor] = useState<string>(defaultColor);
    const [chatRoomRole, setChatRoomRole] = useState<ChatRoomRoleField | undefined>(undefined);

    const [updateSetupChatRoomRole] = useUpdateSetupChatRoomRoleMutation();

    const handleIsRead = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setIsRead(checked);
    };

    const handleIsSend = (e: React.ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        setIsSend(checked);
    };

    const handleShowColorFrame = () => {
        setIscolorFrame(!isColorFrame);
    };

    const {
        data: data_chatRoomRole,
        // isFetching,
        isLoading: isLoading_chatRoomRole,
        isError: isError_chatRoomRole,
        error: error_chatRoomRole,
    } = useGetChatRoomRoleWithCridAaidQuery(
        { authorizedAccountId: data.id, chatRoomId: Number(id) },
        { skip: id === undefined }
    );
    useEffect(() => {
        if (isError_chatRoomRole && error_chatRoomRole) {
            console.error(error_chatRoomRole);
            // dispatch(
            //     setData_toastMessage({
            //         type: messageType_enum.ERROR,
            //         message: 'Lấy dữ liệu phòng hội thoại KHÔNG thành công !',
            //     })
            // );
        }
    }, [isError_chatRoomRole, error_chatRoomRole]);
    useEffect(() => {
        // dispatch(set_isLoading(isLoading_chatRoom));
    }, [isLoading_chatRoomRole]);
    useEffect(() => {
        const resData = data_chatRoomRole;
        if (resData?.isSuccess && resData.data) {
            setChatRoomRole(resData.data);
        }
    }, [data_chatRoomRole]);

    useEffect(() => {
        if (!chatRoomRole) return;
        setIsRead(chatRoomRole.isRead);
        setIsSend(chatRoomRole.isSend);
        if (chatRoomRole.backGroundColor) {
            setColor(chatRoomRole.backGroundColor);
        }
    }, [chatRoomRole]);

    const handleUpdate = () => {
        if (!chatRoomRole) return;
        if (chatRoomRole.isRead === isRead && chatRoomRole.isSend === isSend && chatRoomRole.backGroundColor === color)
            return;

        const updateSetupChatRoomRoleBody: UpdateSetupChatRoomRoleBodyField = {
            id: chatRoomRole.id,
            backGroundColor: color,
            isRead: isRead,
            isSend: isSend,
            accountId: chatRoomRole.accountId,
        };

        dispatch(set_isLoading(true));
        updateSetupChatRoomRole(updateSetupChatRoomRoleBody)
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess) {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: 'Cập nhật thành công !',
                        })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Cập nhật thất bại !',
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
            <div className={style.nameContainer}>
                <img src={data.avatar ? data.avatar : avatarnull} alt="" />
                <div className={style.you}>{you}</div>
                <div className={style.name}>{data.firstName + ' ' + data.lastName}</div>
            </div>
            <div className={style.setupContainer}>
                <div className={style.setupMain}>
                    <div className={style.read}>
                        <input checked={isRead} onChange={(e) => handleIsRead(e)} type="checkbox" />
                        <div>Đọc</div>
                    </div>
                    <div className={style.send}>
                        <input checked={isSend} onChange={(e) => handleIsSend(e)} type="checkbox" />
                        <div>Gửi</div>
                    </div>
                    <div className={style.colorSelect}>
                        <div
                            onClick={() => handleShowColorFrame()}
                            style={{
                                background: color,
                            }}
                        />
                        <div>Màu nền</div>
                        {isColorFrame && (
                            <HexColorPicker className={style.colorFrame} color={color} onChange={setColor} />
                        )}
                    </div>
                </div>
            </div>
            <div className={style.btnContainer}>
                <button onClick={() => handleUpdate()}>Cập nhật</button>
            </div>
        </div>
    );
};

export default memo(Added);
