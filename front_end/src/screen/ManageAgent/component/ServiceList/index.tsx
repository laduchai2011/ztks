import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { SEE_MORE } from '@src/const/text';
import { CiSearch } from 'react-icons/ci';
import OneService from './component/OneService';
import { useLazyGetAgentsQuery } from '@src/redux/query/agentRTK';
import { AgentField } from '@src/dataStruct/agent';
import { set_isLoading, setData_toastMessage } from '@src/redux/slice/ManageAgent';
import { messageType_enum } from '@src/component/ToastMessage/type';

const ServiceList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const newAgents: AgentField[] = useSelector((state: RootState) => state.ManageAgentSlice.newAgents);
    const [agents, setAgents] = useState<AgentField[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [searchInput, setSearchInput] = useState<string>('');
    const [isSearch, setIsSearch] = useState<boolean>(true);
    const size = 10;

    const [getAgents] = useLazyGetAgentsQuery();

    useEffect(() => {
        if (newAgents.length === 0) return;
        setAgents((prev) => [newAgents[newAgents.length - 1], ...prev]);
    }, [newAgents]);

    useEffect(() => {
        if (!isSearch) return;
        const searchInput_t = searchInput.trim();
        dispatch(set_isLoading(true));
        getAgents({
            page: 1,
            size: size,
            offset: 0,
            agentAccountId:
                searchInput_t.length > 0 && !isNaN(Number(searchInput_t)) ? Number(searchInput_t) : undefined,
            accountId: -1,
        })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setAgents(resData.data.items);
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
    }, [dispatch, getAgents, isSearch, searchInput]);

    const handleSeeMore = () => {
        if (!hasMore) return;
        const searchInput_t = searchInput.trim();
        dispatch(set_isLoading(true));
        getAgents({
            page: page,
            size: size,
            offset: 0,
            agentAccountId:
                searchInput_t.length > 0 && !isNaN(Number(searchInput_t)) ? Number(searchInput_t) : undefined,
            accountId: -1,
        })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setAgents((prev) => [...prev, ...(resData.data?.items || [])]);
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

    const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchInput(value);
    };

    const handleSearch = () => {
        setIsSearch(true);
    };

    const list_service = agents.map((item, index) => {
        return <OneService data={item} key={item.id} index={index} />;
    });

    return (
        <div className={style.parent}>
            <div className={style.search}>
                <div>
                    <input value={searchInput} onChange={(e) => handleSearchInput(e)} placeholder="Id thành viên" />
                    <CiSearch onClick={() => handleSearch()} size={25} />
                </div>
            </div>
            <div>{list_service}</div>
            {hasMore && (
                <div className={style.seeMore}>
                    <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>
                </div>
            )}
        </div>
    );
};

export default memo(ServiceList);
