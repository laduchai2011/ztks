import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { SEE_MORE } from '@src/const/text';
import Filter from './component/Filter';
import OneMember from './component/OneMember';
import { useLazyGetMembersQuery } from '@src/redux/query/accountRTK';
import { set_isLoading, setData_toastMessage } from '@src/redux/slice/Member';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { AccountField } from '@src/dataStruct/account';

const MemberList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const searchedAccountId: string = useSelector((state: RootState) => state.MemberSlice.searchedAccountId);
    const newMember: AccountField | undefined = useSelector((state: RootState) => state.MemberSlice.newMember);
    const [members, setMembers] = useState<AccountField[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const size = 10;

    const [getMembers] = useLazyGetMembersQuery();

    useEffect(() => {
        if (!newMember) return;
        setMembers((prev) => [newMember, ...prev]);
    }, [newMember]);

    useEffect(() => {
        const searchedAccountId_cp = searchedAccountId.trim();
        dispatch(set_isLoading(true));
        getMembers({
            page: 1,
            size: size,
            accountId: -1,
            searchedAccountId:
                searchedAccountId_cp.length > 0 && !isNaN(Number(searchedAccountId_cp))
                    ? Number(searchedAccountId_cp)
                    : undefined,
        })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setMembers(resData.data.items);
                    setPage(2);
                    setHasMore(resData.data.items.length === size);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => dispatch(set_isLoading(false)));
    }, [dispatch, getMembers, searchedAccountId]);

    const handleSeeMore = () => {
        if (!hasMore) return;
        const searchedAccountId_cp = searchedAccountId.trim();
        dispatch(set_isLoading(true));
        getMembers({
            page: page,
            size: size,
            accountId: -1,
            searchedAccountId:
                searchedAccountId_cp.length > 0 && !isNaN(Number(searchedAccountId_cp))
                    ? Number(searchedAccountId_cp)
                    : undefined,
        })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setMembers((prev) => [...prev, ...(resData.data?.items || [])]);
                    setPage((pre) => pre + 1);
                    setHasMore(resData.data.items.length === size);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => dispatch(set_isLoading(false)));
    };

    const list_member = members.map((item, index) => {
        return <OneMember data={item} key={index} />;
    });

    return (
        <div className={style.parent}>
            <Filter />
            <div>{list_member}</div>
            <div className={style.seeMore}>
                <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>
            </div>
        </div>
    );
};

export default memo(MemberList);
