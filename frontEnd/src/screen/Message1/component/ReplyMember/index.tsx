import { memo, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { IoAdd } from 'react-icons/io5';
import Added from './component/Added';
import NotAdded from './component/NotAdded';
import { AccountField } from '@src/dataStruct/account';
import { ChatRoomField } from '@src/dataStruct/chatRoom';
import { useGetReplyAccountsQuery, useGetNotReplyAccountsQuery } from '@src/redux/query/accountRTK';

const ReplyMember = () => {
    const { id } = useParams<{ id: string }>();
    const chatRoom: ChatRoomField | undefined = useSelector((state: RootState) => state.MessageV1Slice.chatRoom);

    const notAddedlList_element = useRef<HTMLDivElement | null>(null);
    const [isShowAdded, setIsShowAdded] = useState<boolean>(false);
    const [replyAccounts, setReplyAccount] = useState<AccountField[]>([]);
    const [replyAccountTotal, setReplyAccountTotal] = useState<number>(-1);
    const [replyAccountIndex, setReplyAccountIndex] = useState<number>(1);
    const replyAccountSize = 5;

    const addedlList_element = useRef<HTMLDivElement | null>(null);
    const [isShowNotAdded, setIsShowNotAdded] = useState<boolean>(false);
    const [notReplyAccounts, setNotReplyAccount] = useState<AccountField[]>([]);
    const [notReplyAccountTotal, setNotReplyAccountTotal] = useState<number>(-1);
    const [notReplyAccountIndex, setNotReplyAccountIndex] = useState<number>(1);
    const notReplyAccountSize = 10;

    useEffect(() => {
        if (!addedlList_element.current) return;
        const addedListElement = addedlList_element.current;

        if (isShowAdded) {
            addedListElement.classList.add(style.show);
        } else {
            addedListElement.classList.remove(style.show);
        }
    }, [isShowAdded]);

    useEffect(() => {
        if (!notAddedlList_element.current) return;
        const notAddedListElement = notAddedlList_element.current;

        if (isShowNotAdded) {
            notAddedListElement.classList.add(style.show);
        } else {
            notAddedListElement.classList.remove(style.show);
        }
    }, [isShowNotAdded]);

    const handleShowDown = () => {
        setIsShowAdded(true);
        setIsShowNotAdded(false);
    };

    const handleShowUp = () => {
        setIsShowAdded(false);
    };

    const handleShowNotAdded = () => {
        setIsShowAdded(false);
        setIsShowNotAdded(!isShowNotAdded);
    };

    const {
        data: data_replyAccount,
        // isFetching,
        isLoading: isLoading_replyAccount,
        isError: isError_replyAccount,
        error: error_replyAccount,
    } = useGetReplyAccountsQuery(
        { page: replyAccountIndex, size: replyAccountSize, chatRoomId: Number(id) },
        { skip: id === undefined }
    );
    useEffect(() => {
        if (isError_replyAccount && error_replyAccount) {
            console.error(error_replyAccount);
            // dispatch(
            //     setData_toastMessage({
            //         type: messageType_enum.ERROR,
            //         message: 'Lấy dữ liệu phòng hội thoại KHÔNG thành công !',
            //     })
            // );
        }
    }, [isError_replyAccount, error_replyAccount]);
    useEffect(() => {
        // dispatch(set_isLoading(isLoading_chatRoom));
    }, [isLoading_replyAccount]);
    useEffect(() => {
        const resData = data_replyAccount;
        if (resData?.isSuccess && resData.data) {
            setReplyAccount(resData.data.items);
            setReplyAccountTotal(resData.data.totalCount);
        }
    }, [data_replyAccount]);

    const {
        data: data_notReplyAccount,
        // isFetching,
        isLoading: isLoading_notReplyAccount,
        isError: isError_notReplyAccount,
        error: error_notReplyAccount,
    } = useGetNotReplyAccountsQuery(
        {
            page: notReplyAccountIndex,
            size: notReplyAccountSize,
            chatRoomId: Number(id),
            accountId: chatRoom?.accountId || -1,
        },
        { skip: id === undefined || chatRoom === undefined }
    );
    useEffect(() => {
        if (isError_notReplyAccount && error_notReplyAccount) {
            console.error(error_notReplyAccount);
            // dispatch(
            //     setData_toastMessage({
            //         type: messageType_enum.ERROR,
            //         message: 'Lấy dữ liệu phòng hội thoại KHÔNG thành công !',
            //     })
            // );
        }
    }, [isError_notReplyAccount, error_notReplyAccount]);
    useEffect(() => {
        // dispatch(set_isLoading(isLoading_chatRoom));
    }, [isLoading_notReplyAccount]);
    useEffect(() => {
        const resData = data_notReplyAccount;
        if (resData?.isSuccess && resData.data) {
            setNotReplyAccount(resData.data.items);
            setNotReplyAccountTotal(resData.data.totalCount);
        }
    }, [data_notReplyAccount]);

    const handleSeeMore_replyAccount = () => {
        setReplyAccountIndex((pre) => pre + 1);
    };

    const handleSeeMore_notReplyAccount = () => {
        setNotReplyAccountIndex((pre) => pre + 1);
    };

    const list_replyAccount = replyAccounts.map((item, index) => {
        return <Added key={index} index={index} data={item} />;
    });

    const list_notReplyAccount = notReplyAccounts.map((item, index) => {
        return <NotAdded key={index} index={index} data={item} />;
    });

    return (
        <div className={style.parent}>
            <div className={style.header}>
                <div>Thành viên trả lời tin nhắn</div>
                <div>
                    <IoAdd onClick={() => handleShowNotAdded()} size={25} color="greenyellow" />
                    {!isShowAdded && <GoChevronDown onClick={() => handleShowDown()} size={25} />}
                    {isShowAdded && <GoChevronUp onClick={() => handleShowUp()} size={25} />}
                </div>
            </div>
            <div className={style.addedList} ref={addedlList_element}>
                {list_replyAccount}
                {replyAccounts.length < replyAccountTotal && (
                    <div className={style.addedMore} onClick={() => handleSeeMore_replyAccount()}>
                        Xem thêm
                    </div>
                )}
            </div>
            <div className={style.notAddedList} ref={notAddedlList_element}>
                {list_notReplyAccount}
                {notReplyAccounts.length < notReplyAccountTotal && (
                    <div className={style.notAddedMore} onClick={() => handleSeeMore_notReplyAccount()}>
                        Xem thêm
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(ReplyMember);
