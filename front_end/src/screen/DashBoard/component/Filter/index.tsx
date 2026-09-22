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
import { useLazy_get_Statistics_Oa_Query } from '@src/redux/query/statistics_RTK';
import { Account_Information_Field } from '@src/data_struct/account';
import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import {
    set__data__toast_message,
    set__is_loading,
    set__selected_oa,
    set__statistics_oa_array,
} from '@src/redux/slice/Dash_Board';
import { useLazy_get_Zalo_Oa_List_With_2_Fk_Query } from '@src/redux/query/zalo_RTK';
import { OA_KEY } from '@src/const/key';
import { get_Cookie, set_Cookie } from '@src/utility/cookie';
import { SEE_MORE } from '@src/const/text';
import { messageType_enum } from '@src/component/ToastMessage/type';

const Filter = () => {
    const dispatch = useDispatch<AppDispatch>();
    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const zalo_app: Zalo_App_Field | undefined = useSelector((state: RootState) => state.App_Slice.zalo_app);
    const selected_oa: Zalo_Oa_Field | undefined = useSelector(
        (state: RootState) => state.Dash_Board_Slice.selected_oa
    );

    const list_element = useRef<HTMLDivElement | null>(null);
    const [from_date, set__from_date] = useState<Dayjs | null>(dayjs());
    const [to_date, set__to_date] = useState<Dayjs | null>(dayjs());
    const [is_show_oa, set__is_show_oa] = useState<boolean>(false);
    const [page, set__page] = useState<number>(1);
    const size: number = 5;
    const [zalo_oa_list, set__zalo_oa_list] = useState<Zalo_Oa_Field[]>([]);
    const [total, set__total] = useState<number>(0);
    // const [statisticsOaArray, setStatisticsOaArray] = useState<StatisticsOaField[]>([]);

    const [get_Statistics_Oa] = useLazy_get_Statistics_Oa_Query();
    const [get_Zalo_Oa_List_With_2_Fk] = useLazy_get_Zalo_Oa_List_With_2_Fk_Query();

    // useEffect(() => {
    //     if (fromDate) {
    //         console.log('dashboard filter', fromDate.format('YYYY-MM-DD'));
    //     }
    // }, [fromDate]);

    useEffect(() => {
        if (!account_information || !zalo_app) return;
        dispatch(set__is_loading(true));
        get_Zalo_Oa_List_With_2_Fk({
            page: page,
            size: size,
            zalo_app_id: zalo_app.id,
            account_id: account_information.added_by_id || '',
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    if (page === 1) {
                        set__zalo_oa_list(res_data.data.items);
                    } else {
                        set__zalo_oa_list((prev) => [...prev, ...(res_data.data?.items ?? [])]);
                    }

                    set__total(res_data.data.total_count);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    }, [dispatch, account_information, get_Zalo_Oa_List_With_2_Fk, page, zalo_app]);

    useEffect(() => {
        const selected_oa_cookie = get_Cookie(OA_KEY.SELECTED_OA);
        if (!selected_oa_cookie) return;
        const selected_oa_js = JSON.parse(selected_oa_cookie) as Zalo_Oa_Field;
        let isExist: boolean = false;

        for (let i: number = 0; i < zalo_oa_list.length; i++) {
            if (zalo_oa_list[i].id === selected_oa_js.id) {
                isExist = true;
                break;
            }
        }

        if (isExist) {
            dispatch(set__selected_oa(selected_oa_js));
        }
    }, [dispatch, zalo_oa_list]);

    useEffect(() => {
        if (!list_element.current) return;
        const listElement = list_element.current;

        if (is_show_oa) {
            listElement.classList.add(style.show);
        } else {
            listElement.classList.remove(style.show);
        }
    }, [is_show_oa]);

    const handle_Search = () => {
        if (!selected_oa) return;
        if (!account_information) return;
        if (!from_date) return;
        if (!to_date) return;

        get_Statistics_Oa({
            from_date: new Date(from_date.format('YYYY-MM-DD')).toString(),
            to_date: new Date(to_date.format('YYYY-MM-DD')).toString(),
            zalo_oa_id: selected_oa.id,
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__statistics_oa_array(res_data.data));
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            });
    };

    const handle_Show_Down = () => {
        set__is_show_oa(true);
    };

    const handle_Show_Up = () => {
        set__is_show_oa(false);
    };

    const handle_Selected = (item: Zalo_Oa_Field) => {
        set_Cookie(OA_KEY.SELECTED_OA, JSON.stringify(item), 365);
        dispatch(set__selected_oa(item));
    };

    const handle_See_More = () => {
        set__page((prev) => prev + 1);
    };

    const list_oa = zalo_oa_list.map((item) => {
        return (
            <div onClick={() => handle_Selected(item)} key={item.id}>
                {item.oa_name}
            </div>
        );
    });

    return (
        <div className={style.parent}>
            <div>
                <div>
                    <div className={style.selected}>
                        <div>{selected_oa?.oa_name}</div>
                        <div>
                            {!is_show_oa && <HiChevronDown onClick={() => handle_Show_Down()} size={25} />}
                            {is_show_oa && <HiChevronUp onClick={() => handle_Show_Up()} size={25} />}
                        </div>
                    </div>
                    <div className={style.list} ref={list_element}>
                        <div>{list_oa}</div>
                        <div>
                            {zalo_oa_list.length < total && <div onClick={() => handle_See_More()}>{SEE_MORE}</div>}
                        </div>
                    </div>
                </div>
                <div>
                    <div className={style.text}>Từ</div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Chọn ngày"
                            value={from_date}
                            onChange={(newValue) => {
                                set__from_date(newValue);
                            }}
                        />
                    </LocalizationProvider>
                    <div className={style.text}>Tới</div>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                            label="Chọn ngày"
                            value={to_date}
                            onChange={(newValue) => {
                                set__to_date(newValue);
                            }}
                        />
                    </LocalizationProvider>
                    <div className={style.searchBtn} onClick={() => handle_Search()}>
                        {SEARCH}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Filter);
