import { memo, useRef, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';
import { CLOSE, SEE_MORE } from '@src/const/text';
import {
    setIsShow_memberListDialog,
    set_agent_memberListDialog,
    set_isLoading,
    setData_toastMessage,
} from '@src/redux/slice/ManageAgent';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { avatarnull } from '@src/utility/string';
import { useLazyGetMembersQuery } from '@src/redux/query/accountRTK';
import { useAgentAddAccountMutation } from '@src/redux/query/agentRTK';
import { AccountField } from '@src/dataStruct/account';
import { AgentField } from '@src/dataStruct/agent';

const MemberListDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const isShow: boolean = useSelector((state: RootState) => state.ManageAgentSlice.memberListDialog.isShow);
    const agent: AgentField | undefined = useSelector(
        (state: RootState) => state.ManageAgentSlice.memberListDialog.agent
    );
    const [members, setMembers] = useState<AccountField[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const size = 10;
    const [searchInput, setSearchInput] = useState<string>('');
    const [isSearch, setIsSearch] = useState<boolean>(true);

    const [getMembers] = useLazyGetMembersQuery();
    const [agentAddAccount] = useAgentAddAccountMutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (isShow) {
            parentElement.classList.add(style.display);
            const timeout2 = setTimeout(() => {
                parentElement.classList.add(style.opacity);
                clearTimeout(timeout2);
            }, 50);
        } else {
            parentElement.classList.remove(style.opacity);

            const timeout2 = setTimeout(() => {
                parentElement.classList.remove(style.display);
                clearTimeout(timeout2);
            }, 550);
        }
    }, [isShow]);

    useEffect(() => {
        if (!isSearch) return;
        const searchInput_t = searchInput.trim();
        dispatch(set_isLoading(true));
        getMembers({
            page: 1,
            size: size,
            accountId: -1,
            searchedAccountId:
                searchInput_t.length > 0 && !isNaN(Number(searchInput_t)) ? Number(searchInput_t) : undefined,
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
            .finally(() => {
                dispatch(set_isLoading(false));
                setIsSearch(false);
            });
    }, [dispatch, getMembers, searchInput, isSearch]);

    const handleClose = () => {
        dispatch(setIsShow_memberListDialog(false));
    };

    const handleSearch = () => {
        setIsSearch(true);
    };

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);
    };

    const handleSeeMore = () => {
        if (!hasMore) return;
        const searchInput_t = searchInput.trim();
        dispatch(set_isLoading(true));
        getMembers({
            page: page,
            size: size,
            accountId: -1,
            searchedAccountId:
                searchInput_t.length > 0 && !isNaN(Number(searchInput_t)) ? Number(searchInput_t) : undefined,
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

    const handleSelect = (item: AccountField) => {
        if (!agent) return;
        dispatch(set_isLoading(true));
        agentAddAccount({ id: agent.id, agentAccountId: item.id, accountId: -1 })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    dispatch(setIsShow_memberListDialog(false));
                    dispatch(set_agent_memberListDialog(resData.data));
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
        return (
            <div className={style.row} key={item.id} onClick={() => handleSelect(item)}>
                <div>{index + 1}</div>
                <img src={avatarnull} alt="" />
                <div>{`${item.firstName} ${item.lastName}`}</div>
            </div>
        );
    });

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.search}>
                    <div>
                        <input
                            value={searchInput}
                            onChange={(e) => handleSearchInput(e)}
                            placeholder="Id thành viên !"
                        />
                        <CiSearch onClick={() => handleSearch()} size={25} />
                    </div>
                </div>
                <div className={style.list}>{list_member}</div>
                {hasMore && (
                    <div className={style.seeMore}>
                        <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(MemberListDialog);
