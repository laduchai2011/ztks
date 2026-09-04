import { memo, useState, useEffect, useRef } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { SEARCH } from '@src/const/text';
import { useLazyGetStatisticsOaQuery } from '@src/redux/query/statisticsRTK';
import { AccountInformationField } from '@src/dataStruct/account';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { setData_toastMessage, set_isLoading, set_selectedOa, set_statisticsOaArray } from '@src/redux/slice/DashBoard';
import { useLazyGetZaloOaListWith2FkQuery } from '@src/redux/query/zaloRTK';
import { OA_KEY } from '@src/const/key';
import { getCookie, setCookie } from '@src/utility/cookie';
import { SEE_MORE } from '@src/const/text';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { StatisticsOaField } from '@src/dataStruct/statistics';

const Filter = () => {
    const dispatch = useDispatch<AppDispatch>();
    const accountInformation: AccountInformationField | undefined = useSelector(
        (state: RootState) => state.AppSlice.accountInformation
    );
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);
    const selectedOa: ZaloOaField | undefined = useSelector((state: RootState) => state.DashBoardSlice.selectedOa);

    const list_element = useRef<HTMLDivElement | null>(null);
    const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs());
    const [toDate, setToDate] = useState<Dayjs | null>(dayjs());
    const [isShowOa, setIsShowOa] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const size: number = 5;
    const [zaloOaList, setZaloOaList] = useState<ZaloOaField[]>([]);
    const [total, setTotal] = useState<number>(0);
    // const [statisticsOaArray, setStatisticsOaArray] = useState<StatisticsOaField[]>([]);

    const [getStatisticsOa] = useLazyGetStatisticsOaQuery();
    const [getZaloOaListWith2Fk] = useLazyGetZaloOaListWith2FkQuery();

    // useEffect(() => {
    //     if (fromDate) {
    //         console.log('dashboard filter', fromDate.format('YYYY-MM-DD'));
    //     }
    // }, [fromDate]);

    useEffect(() => {
        if (!accountInformation || !zaloApp) return;
        dispatch(set_isLoading(true));
        getZaloOaListWith2Fk({
            page: page,
            size: size,
            zaloAppId: zaloApp.id,
            accountId: accountInformation.addedById || -1,
        })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    if (page === 1) {
                        setZaloOaList(resData.data.items);
                    } else {
                        setZaloOaList((prev) => [...prev, ...(resData.data?.items ?? [])]);
                    }

                    setTotal(resData.data.totalCount);
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
            });
    }, [dispatch, accountInformation, getZaloOaListWith2Fk, page, zaloApp]);

    useEffect(() => {
        const selected_oa_cookie = getCookie(OA_KEY.SELECTED_OA);
        if (!selected_oa_cookie) return;
        const selected_oa_js = JSON.parse(selected_oa_cookie) as ZaloOaField;
        let isExist: boolean = false;

        for (let i: number = 0; i < zaloOaList.length; i++) {
            if (zaloOaList[i].id === selected_oa_js.id) {
                isExist = true;
                break;
            }
        }

        if (isExist) {
            dispatch(set_selectedOa(selected_oa_js));
        }
    }, [dispatch, zaloOaList]);

    useEffect(() => {
        if (!list_element.current) return;
        const listElement = list_element.current;

        if (isShowOa) {
            listElement.classList.add(style.show);
        } else {
            listElement.classList.remove(style.show);
        }
    }, [isShowOa]);

    const handleSearch = () => {
        if (!selectedOa) return;
        if (!accountInformation) return;
        if (!fromDate) return;
        if (!toDate) return;

        getStatisticsOa({
            fromDate: new Date(fromDate.format('YYYY-MM-DD')).toString(),
            toDate: new Date(toDate.format('YYYY-MM-DD')).toString(),
            zaloOaId: selectedOa.id,
        })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    // setStatisticsOaArray(resData.data);
                    dispatch(set_statisticsOaArray(resData.data));
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
            });
    };

    // useEffect(() => {
    //     if (!statisticsOaArray) return;

    //     dispatch(set_statisticsOaArray(statisticsOaArray));

    //     let sales: number = 0;
    //     let averageSales: number = 0;
    //     let orderAmount: number = 0;
    //     let averageOrderAmount: number = 0;
    //     let ofDay: string = '';
    //     for (let i: number = 0; i < statisticsOaArray.length; i++) {
    //         sales = sales + statisticsOaArray[i].sales;

    //         orderAmount = orderAmount + statisticsOaArray[i].orderAmount;
    //         // averageOrderAmount = averageOrderAmount + statisticsOaArray[i].averageOrderAmount;

    //         ofDay = statisticsOaArray[i].ofDay.toString();
    //     }

    //     averageSales = sales / orderAmount;
    //     averageOrderAmount = orderAmount / 2;
    // }, [dispatch, statisticsOaArray]);

    const handleShowDown = () => {
        setIsShowOa(true);
    };

    const handleShowUp = () => {
        setIsShowOa(false);
    };

    const handleSelected = (item: ZaloOaField) => {
        setCookie(OA_KEY.SELECTED_OA, JSON.stringify(item), 365);
        dispatch(set_selectedOa(item));
    };

    const handleSeeMore = () => {
        setPage((prev) => prev + 1);
    };

    const list_oa = zaloOaList.map((item) => {
        return (
            <div onClick={() => handleSelected(item)} key={item.id}>
                {item.oaName}
            </div>
        );
    });

    return (
        <div className={style.parent}>
            <div>
                <div>
                    <div className={style.selected}>
                        <div>{selectedOa?.oaName}</div>
                        <div>
                            {!isShowOa && <HiChevronDown onClick={() => handleShowDown()} size={25} />}
                            {isShowOa && <HiChevronUp onClick={() => handleShowUp()} size={25} />}
                        </div>
                    </div>
                    <div className={style.list} ref={list_element}>
                        <div>{list_oa}</div>
                        <div>{zaloOaList.length < total && <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>}</div>
                    </div>
                </div>
                <div>
                    <div className={style.text}>Từ</div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Chọn ngày"
                            value={fromDate}
                            onChange={(newValue) => {
                                setFromDate(newValue);
                            }}
                        />
                    </LocalizationProvider>
                    <div className={style.text}>Tới</div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Chọn ngày"
                            value={toDate}
                            onChange={(newValue) => {
                                setToDate(newValue);
                            }}
                        />
                    </LocalizationProvider>
                    <div className={style.searchBtn} onClick={() => handleSearch()}>
                        {SEARCH}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Filter);
