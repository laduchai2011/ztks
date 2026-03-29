import { useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { MEMBER_RECEIVE_MESSAGE } from '@src/const/text';
import avatarnull from '@src/asset/avatar/avatarnull.png';
import { AccountField, AccountInformationField, accountType_enum } from '@src/dataStruct/account';
import {
    useGetAllMembersQuery,
    useSetMemberReceiveMessageMutation,
    useGetMemberReceiveMessageQuery,
} from '@src/redux/query/accountRTK';
import MyToastMessage from './component/MyToastMessage';
import MyLoading from './component/MyLoading';
import { setData_toastMessage } from '@src/redux/slice/ManageMembers';
import { messageType_enum as toastMessageType_enum } from '@src/component/ToastMessage/type';

const MemberReceiveMessage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [allMembers, setAllMembers] = useState<AccountField[]>([]);
    const [selectedMember, setSelectedMember] = useState<AccountField | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [accountInformation, setAccountInformation] = useState<AccountInformationField | null>(null);
    const [setMemberReceiveMessage] = useSetMemberReceiveMessageMutation();

    useEffect(() => {
        const accountInformationStorage = sessionStorage.getItem('accountInformation');
        if (!accountInformationStorage) return;
        setAccountInformation(JSON.parse(accountInformationStorage));
    }, []);

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
                    type: toastMessageType_enum.ERROR,
                    message: 'Lấy dữ liệu KHÔNG thành công !',
                })
            );
        }
    }, [dispatch, isError_allMembers, error_allMembers]);
    useEffect(() => {
        setIsLoading(isLoading_allMembers);
    }, [isLoading_allMembers]);
    useEffect(() => {
        const resData = data_allMembers;
        if (resData?.isSuccess && resData?.data) {
            setAllMembers(resData.data);
        }
    }, [data_allMembers]);

    const {
        data: data_memberReceiveMessage,
        // isFetching,
        isLoading: isLoading_memberReceiveMessage,
        isError: isError_memberReceiveMessage,
        error: error_memberReceiveMessage,
    } = useGetMemberReceiveMessageQuery();
    useEffect(() => {
        if (isError_memberReceiveMessage && error_memberReceiveMessage) {
            console.error(error_memberReceiveMessage);
            dispatch(
                setData_toastMessage({
                    type: toastMessageType_enum.ERROR,
                    message: 'Lấy dữ liệu KHÔNG thành công !',
                })
            );
        }
    }, [dispatch, isError_memberReceiveMessage, error_memberReceiveMessage]);
    useEffect(() => {
        setIsLoading(isLoading_memberReceiveMessage);
    }, [isLoading_memberReceiveMessage]);
    useEffect(() => {
        const resData = data_memberReceiveMessage;
        if (resData?.isSuccess && resData?.data) {
            setSelectedMember(resData.data);
        }
    }, [data_memberReceiveMessage]);

    const handleSelectMemberReceiveMessage = (member: AccountField) => {
        if (accountInformation?.accountType === accountType_enum.ADMIN) {
            setMemberReceiveMessage(member)
                .then((res) => {
                    const resData = res.data;
                    if (resData?.isSuccess && resData?.data) {
                        setSelectedMember(resData.data);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            dispatch(
                setData_toastMessage({
                    type: toastMessageType_enum.WARN,
                    message: 'Bạn không có quyền thực hiện thao tác này !',
                })
            );
        }
    };

    const list_members = allMembers.map((member, index) => (
        <div key={index} onClick={() => handleSelectMemberReceiveMessage(member)}>
            {member.userName} - {member.firstName} {member.lastName} - {member.phone}
        </div>
    ));

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>{MEMBER_RECEIVE_MESSAGE}</div>
                <div className={style.row}>
                    {selectedMember === null ? (
                        <div className={style.selected}>Chưa xác định</div>
                    ) : (
                        <div className={style.selected}>
                            <img className={style.avatar} src={avatarnull} alt="avatar" />
                            <div className={style.name}>
                                {selectedMember?.firstName + ' ' + selectedMember?.lastName}
                            </div>
                        </div>
                    )}
                    <div className={style.list}>{list_members}</div>
                </div>
            </div>
            <div>
                <MyToastMessage />
                <MyLoading isLoading={isLoading} />
            </div>
        </div>
    );
};

export default MemberReceiveMessage;
