import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { set_isLoading, setData_toastMessage } from '@src/redux/slice/CheckInOutManager';
import { route_enum } from '@src/router/type';
import { select_enum } from '@src/router/type';
import { useGetAllMembersQuery } from '@src/redux/query/accountRTK';
import { useLazyGetCheckInOutsQuery } from '@src/redux/query/checkInOutRTK';
import OneCheck from './component/OneCheck';
import { AccountField } from '@src/dataStruct/account';
import { GetMyCheckInOutsBodyField } from '@src/dataStruct/checkInOut/body';
import { CheckInOutWithDateField } from '@src/dataStruct/checkInOut';
import { SEE_MORE } from '@src/const/text';

interface CheckInOutGroup {
    date: string;
    items: CheckInOutWithDateField[];
}

const CheckListMember = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [hasMore, setHasMore] = useState<boolean>(true);
    const [groupedCheckInOuts, setGroupedCheckInOuts] = useState<CheckInOutGroup[]>();
    const [allMembers, setAllMembers] = useState<AccountField[]>([]);
    const [page, setPage] = useState<number>(1);
    const [getCheckInOuts] = useLazyGetCheckInOutsQuery();
    const [days, setDays] = useState<string[]>([]);

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

    // useEffect(() => {
    //     async function getChecks() {
    //         try {
    //             const len = allMembers.length;
    //             let checkInOutsWithDate: CheckInOutWithDateField[] = [];
    //             for (let i: number = 0; i < len; i++) {
    //                 const date = new Date();
    //                 date.setDate(date.getDate() - (page - 1) * size);
    //                 const dateDaysAgo = new Date(date);
    //                 dateDaysAgo.setDate(dateDaysAgo.getDate() - (size - 1));

    //                 const fromDate = date.toISOString().split('T')[0];
    //                 const toDate = dateDaysAgo.toISOString().split('T')[0];

    //                 const body: GetMyCheckInOutsBodyField = {
    //                     fromDate: fromDate,
    //                     toDate: toDate,
    //                     accountId: allMembers[i].id,
    //                 };

    //                 const res_checkInOut = await getCheckInOuts(body);
    //                 const resDara_checkInOut = res_checkInOut.data;

    //                 if (resDara_checkInOut?.isSuccess && resDara_checkInOut?.data) {
    //                     checkInOutsWithDate = checkInOutsWithDate.concat(resDara_checkInOut.data);
    //                 }
    //             }

    //             // group according to day
    //             const _groupedCheckInOuts = Object.entries(
    //                 checkInOutsWithDate.reduce(
    //                     (groups, item) => {
    //                         const date = item.date.split('T')[0];

    //                         if (!groups[date]) {
    //                             groups[date] = [];
    //                         }

    //                         groups[date].push(item);

    //                         return groups;
    //                     },
    //                     {} as Record<string, CheckInOutWithDateField[]>
    //                 )
    //             ).map(([date, items]) => ({
    //                 date,
    //                 items,
    //             }));
    //             setGroupedCheckInOuts(_groupedCheckInOuts);
    //         } catch (error) {
    //             console.log('CheckList', 'getCheckInOuts error: ', error);
    //         }
    //     }
    //     getChecks();
    // }, [dispatch, allMembers, page, getCheckInOuts]);

    // const list_check = groupedCheckInOuts?.map((group) => (
    //     <div className={style.checkGroup} key={group.date}>
    //         <div className={style.header}>{group.date}</div>
    //         {group.items.map((item, index) => (
    //             <OneCheck index={index} data={item} />
    //         ))}
    //     </div>
    // ));

    useEffect(() => {
        const date = new Date();
        date.setDate(date.getDate() - (page - 1));
        if (page === 1) {
            setDays([date.toISOString().split('T')[0]]);
        } else {
            setDays((prev) => [...prev, date.toISOString().split('T')[0]]);
        }
    }, [page]);

    const handleSeeMore = () => {
        setPage((prev) => prev + 1);
    };

    const list_check = days.map((day) => (
        <div className={style.checkGroup} key={day}>
            <div className={style.header}>{day}</div>
            {allMembers.map((item, index) => (
                <OneCheck index={index} account={item} day={day} />
            ))}
        </div>
    ));

    return (
        <div className={style.parent}>
            {list_check}
            <div className={style.seeMore}>
                <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>
            </div>
        </div>
    );
};

export default memo(CheckListMember);
