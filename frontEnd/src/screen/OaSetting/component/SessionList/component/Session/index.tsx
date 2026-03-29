import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { MdDelete } from 'react-icons/md';
import { GoDotFill } from 'react-icons/go';
import avatarnull from '@src/asset/avatar/avatarnull.png';
import { ChatSessionField } from '@src/dataStruct/chatSession';
import { useGetAccountWithIdQuery } from '@src/redux/query/accountRTK';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set_isLoading, setData_toastMessage, setIsShow_delDialog } from '@src/redux/slice/OaSetting';
import { AccountField } from '@src/dataStruct/account';
import { useGetAllMembersQuery } from '@src/redux/query/accountRTK';
import {
    useUpdateSelectedAccountIdOfChatSessionMutation,
    useUpdateIsReayOfChatSessionMutation,
} from '@src/redux/query/chatSessionRTK';

const Session: FC<{ index: number; data: ChatSessionField }> = ({ index, data }) => {
    const [chatSession, setChatSession] = useState<ChatSessionField>(data);
    const dispatch = useDispatch<AppDispatch>();
    const btnText = chatSession.isReady ? 'Bỏ sẵn sàng' : 'Sẵn sàng';
    const readyColor = chatSession.isReady ? 'greenyellow' : 'gray';
    const readyBackgroundColor = !chatSession.isReady ? 'greenyellow' : 'white';
    const [allMembers, setAllMembers] = useState<AccountField[]>([]);
    const [account, setAccount] = useState<AccountField | undefined>(undefined);

    const [updateSelectedAccountIdOfChatSession] = useUpdateSelectedAccountIdOfChatSessionMutation();
    const [updateIsReadyOfChatSession] = useUpdateIsReayOfChatSessionMutation();

    const {
        data: data_allMembers,
        // isFetching,
        isLoading: isLoading_allMembers,
        isError: isError_allMembers,
        error: error_allMembers,
    } = useGetAllMembersQuery({ addedById: -1 });
    useEffect(() => {
        if (isError_allMembers && error_allMembers) {
            console.error(error_allMembers);
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Lấy dữ liệu KHÔNG thành công !',
                })
            );
        }
    }, [dispatch, isError_allMembers, error_allMembers]);
    useEffect(() => {
        dispatch(set_isLoading(isLoading_allMembers));
    }, [dispatch, isLoading_allMembers]);
    useEffect(() => {
        const resData = data_allMembers;
        if (resData?.isSuccess && resData?.data) {
            setAllMembers(resData.data);
        }
    }, [chatSession, data_allMembers]);

    const {
        data: data_account,
        // isFetching,
        isLoading: isLoading_account,
        isError: isError_account,
        error: error_account,
    } = useGetAccountWithIdQuery({ id: chatSession.selectedAccountId });
    useEffect(() => {
        if (isError_account && error_account) {
            console.error(error_account);
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Lấy dữ liệu tài khoản KHÔNG thành công !',
                })
            );
        }
    }, [dispatch, isError_account, error_account]);
    useEffect(() => {
        dispatch(set_isLoading(isLoading_account));
    }, [dispatch, isLoading_account]);
    useEffect(() => {
        const resData = data_account;
        if (resData?.isSuccess && resData.data) {
            setAccount(resData.data);
        }
    }, [dispatch, data_account]);

    const handleDel = () => {
        dispatch(setIsShow_delDialog(true));
    };

    const handleSelected = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        dispatch(set_isLoading(true));
        updateSelectedAccountIdOfChatSession({ id: chatSession.id, selectedAccountId: Number(value), accountId: -1 })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setChatSession(resData.data);
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.WARN,
                            message: 'Lựa chọn KHÔNG thành công !',
                        })
                    );
                }
            })
            .catch((err) => console.error(err))
            .finally(() => dispatch(set_isLoading(false)));
    };

    const handleReady = () => {
        const isReady = chatSession.isReady;
        dispatch(set_isLoading(true));
        updateIsReadyOfChatSession({ id: chatSession.id, isReady: !isReady, accountId: -1 })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setChatSession(resData.data);
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.WARN,
                            message: 'Hành động thất bại !',
                        })
                    );
                }
            })
            .catch((err) => console.error(err))
            .finally(() => dispatch(set_isLoading(false)));
    };

    const list_member = allMembers.map((item, index) => {
        const index1 = index + 1;
        return (
            <option key={`${item.id}-${chatSession.id}`} value={item.id}>
                {index1 + '  ' + item.firstName + ' ' + item.lastName}
            </option>
        );
    });

    return (
        <div className={style.parent}>
            <div className={style.header}>
                <div>{index}</div>
                <div>{chatSession.label}</div>
                <div>
                    <GoDotFill size={20} color={readyColor} />
                    <MdDelete onClick={() => handleDel()} size={20} color="red" />
                </div>
            </div>
            <div className={style.infor}>
                <div>{`Mã phiên: ${chatSession.code}`}</div>
                <div>Chỉ định: Lựa chọn hoặc nhập id</div>
                <div className={style.selectedContainer}>
                    <div>
                        <select value={chatSession.selectedAccountId} onChange={(e) => handleSelected(e)}>
                            {list_member}
                        </select>
                    </div>
                    <div>
                        <input placeholder="id" />
                    </div>
                </div>
            </div>
            <div className={style.selectedAcount}>
                <div>
                    <img src={account?.avatar && account?.avatar?.length > 0 ? account?.avatar : avatarnull} alt="" />
                </div>
                <div>{account?.firstName + ' ' + account?.lastName}</div>
            </div>
            <div className={style.btnContainer}>
                <button style={{ background: readyBackgroundColor }} onClick={() => handleReady()}>
                    {btnText}
                </button>
            </div>
        </div>
    );
};

export default memo(Session);
