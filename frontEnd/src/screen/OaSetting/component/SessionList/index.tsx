import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { SESSION_LIST, SEE_MORE } from '@src/const/text';
import Session from './component/Session';
import { useGetChatSessionsWithAccountIdQuery } from '@src/redux/query/chatSessionRTK';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set_isLoading, setData_toastMessage, set_chatSessions } from '@src/redux/slice/OaSetting';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { AccountField } from '@src/dataStruct/account';
import { ChatSessionField } from '@src/dataStruct/chatSession';
import { Crud_Enum } from '../../type';

const SessionList = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const zaloOa: ZaloOaField | undefined = useSelector((state: RootState) => state.OaSettingSlice.zaloOa);
    const chatSessions: ChatSessionField[] = useSelector((state: RootState) => state.OaSettingSlice.chatSessions);

    // const [isLoadMore, setIsLoadMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const size = 5;
    const [totalCount, setTotalCount] = useState<number>(0);

    const {
        data: data_chatSession,
        // isFetching,
        isLoading: isLoading_chatSession,
        isError: isError_chatSession,
        error: error_chatSession,
    } = useGetChatSessionsWithAccountIdQuery(
        { page: page, size: size, zaloOaId: zaloOa?.id || -1, accountId: account?.id || -1 },
        { skip: zaloOa === undefined || account === undefined }
    );
    useEffect(() => {
        if (isError_chatSession && error_chatSession) {
            console.error(error_chatSession);
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Lấy dữ liệu OA KHÔNG thành công !',
                })
            );
        }
    }, [dispatch, isError_chatSession, error_chatSession]);
    useEffect(() => {
        dispatch(set_isLoading(isLoading_chatSession));
    }, [dispatch, isLoading_chatSession]);
    useEffect(() => {
        const resData = data_chatSession;
        if (resData?.isSuccess && resData.data) {
            dispatch(set_chatSessions({ chatSessions: resData.data?.items, crud_type: Crud_Enum.LOAD_MORE }));
            setTotalCount(resData.data.totalCount);
        }
    }, [dispatch, data_chatSession]);

    const handleSeeMore = () => {
        // setIsLoadMore(true);
        setPage((prev) => prev + 1);
    };

    const list = chatSessions.map((item, index) => {
        return <Session key={item.id} index={index + 1} data={item} />;
    });

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>{SESSION_LIST}</div>
                <div className={style.list}>{list}</div>
                <div className={style.more}>
                    {chatSessions.length < totalCount && <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>}
                </div>
            </div>
        </div>
    );
};

export default memo(SessionList);
