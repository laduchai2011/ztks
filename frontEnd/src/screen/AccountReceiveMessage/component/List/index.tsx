import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { set_isLoading, setData_toastMessage, set_accountReceiveMessage } from '@src/redux/slice/AccountReceiveMessage';
import { messageType_enum } from '@src/component/ToastMessage/type';
import OneAccount from './component/OneAccount';
import {
    useGetAccountReceiveMessageQuery,
    useCreateAccountReceiveMessageMutation,
    useGetAllMembersQuery,
} from '@src/redux/query/accountRTK';
import { AccountField, AccountReceiveMessageField } from '@src/dataStruct/account';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { ACTIVATE } from '@src/const/text';

const List = () => {
    const dispatch = useDispatch<AppDispatch>();
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const selectedOa: ZaloOaField | undefined = useSelector(
        (state: RootState) => state.AccountReceiveMessageSlice.selectedOa
    );
    const accountReceiveMessage: AccountReceiveMessageField | undefined = useSelector(
        (state: RootState) => state.AccountReceiveMessageSlice.accountReceiveMessage
    );
    const [allMembers, setAllMembers] = useState<AccountField[]>([]);
    // const [accountReceiveMessage, setAccountReceiveMessage] = useState<AccountReceiveMessageField | undefined>(
    //     undefined
    // );
    const [createAccountReceiveMessage] = useCreateAccountReceiveMessageMutation();

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
    }, [data_allMembers]);

    const {
        data: data_accountReceiveMessage,
        // isFetching,
        isLoading: isLoading_accountReceiveMessage,
        isError: isError_accountReceiveMessage,
        error: error_accountReceiveMessage,
    } = useGetAccountReceiveMessageQuery(
        { zaloOaId: selectedOa?.id || -1, accountId: account?.id || -1 },
        { skip: selectedOa === undefined || account === undefined }
    );
    useEffect(() => {
        if (isError_accountReceiveMessage && error_accountReceiveMessage) {
            console.error(error_accountReceiveMessage);
        }
    }, [dispatch, isError_accountReceiveMessage, error_accountReceiveMessage]);
    useEffect(() => {
        dispatch(set_isLoading(isLoading_accountReceiveMessage));
    }, [dispatch, isLoading_accountReceiveMessage]);
    useEffect(() => {
        const resData = data_accountReceiveMessage;
        if (resData?.isSuccess && resData.data) {
            dispatch(set_accountReceiveMessage(resData.data));
            // setAccountReceiveMessage(resData.data);
        }
    }, [dispatch, data_accountReceiveMessage]);

    const handleActivate = () => {
        if (!account) return;
        if (!selectedOa) return;

        dispatch(set_isLoading(true));
        createAccountReceiveMessage({ zaloOaId: selectedOa.id, accountId: account.id })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData?.data) {
                    // setAccountReceiveMessage(resData.data);
                    dispatch(set_accountReceiveMessage(resData.data));
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Kích hoạt thất bại !',
                        })
                    );
                }
            })
            .catch((err) => {
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
                console.error(err);
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    };

    const list_account = allMembers.map((item, index) => {
        return <OneAccount key={index} index={index} data={item} />;
    });

    return (
        <div className={style.parent}>
            <div className={style.header}>{`Số lượng thành viên ${allMembers.length}`}</div>
            {accountReceiveMessage && <div className={style.list}>{list_account}</div>}
            {!accountReceiveMessage && (
                <div className={style.activateContainer}>
                    <div onClick={() => handleActivate()}>{ACTIVATE}</div>
                </div>
            )}
        </div>
    );
};

export default memo(List);
