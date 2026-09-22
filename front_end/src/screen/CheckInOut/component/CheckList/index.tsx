import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { SEE_MORE } from '@src/const/text';
import { useLazy_get_Check_In_Outs_Query } from '@src/redux/query/check_in_out_RTK';
import { Check_In_Out_With_Date_Field, Check_In_Out_Type, Check_In_Out_Enum } from '@src/data_struct/check_in_out';
import { Get_My_Check_In_Outs_Body_Field } from '@src/data_struct/check_in_out/body';
import { set__is_loading } from '@src/redux/slice/Note';
import { Account_Field } from '@src/data_struct/account';
import { handleSrcImage } from '@src/utility/string';

interface Check_In_Out_Group_Field {
    date: string;
    items: Check_In_Out_With_Date_Field[];
}

const CheckList = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);

    const [check_in_outs_with_date, set__check_in_outs_with_date] = useState<Check_In_Out_With_Date_Field[]>([]);
    const [has_more, set__has_more] = useState<boolean>(true);
    const [grouped_check_in_outs, set__grouped_check_in_outs] = useState<Check_In_Out_Group_Field[]>();
    const size = 10;
    const [page, set__page] = useState<number>(1);

    const [get_Check_In_Outs] = useLazy_get_Check_In_Outs_Query();

    useEffect(() => {
        if (!account) return;

        const date = new Date();
        date.setDate(date.getDate() - (page - 1) * size);
        const date_days_ago = new Date(date);
        date_days_ago.setDate(date_days_ago.getDate() - (size - 1));

        const from_date = date.toISOString().split('T')[0];
        const to_date = date_days_ago.toISOString().split('T')[0];

        const body: Get_My_Check_In_Outs_Body_Field = {
            from_date: from_date,
            to_date: to_date,
            account_id: account.id,
        };
        dispatch(set__is_loading(true));
        get_Check_In_Outs(body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data?.data) {
                    if (page === 1) {
                        set__check_in_outs_with_date(res_data.data);
                    } else {
                        set__check_in_outs_with_date((prev) => [...prev, ...(res_data.data || [])]);
                    }
                }
            })
            .catch((error) => {
                console.log('Check_List', 'get_Check_In_Outs error: ', error);
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    }, [dispatch, get_Check_In_Outs, account, page]);

    const handle_See_More = () => {
        if (!account) return;
        if (!has_more) return;
        set__page((prev) => prev + 1);
    };

    useEffect(() => {
        const _grouped_check_in_outs = Object.entries(
            check_in_outs_with_date.reduce(
                (groups, item) => {
                    const date = item.date.split('T')[0];

                    if (!groups[date]) {
                        groups[date] = [];
                    }

                    groups[date].push(item);

                    return groups;
                },
                {} as Record<string, Check_In_Out_With_Date_Field[]>
            )
        ).map(([date, items]) => ({
            date,
            items,
        }));
        set__grouped_check_in_outs(_grouped_check_in_outs);
    }, [check_in_outs_with_date]);

    useEffect(() => {
        if (!grouped_check_in_outs) return;
        if (grouped_check_in_outs.length === size) {
            set__has_more(true);
        } else {
            set__has_more(false);
        }
    }, [grouped_check_in_outs]);

    const handle_Check_Color = (type: Check_In_Out_Type) => {
        switch (type) {
            case Check_In_Out_Enum.IN:
                return style.green;
            case Check_In_Out_Enum.OUT:
                return style.red;
            default:
                return '';
        }
    };

    const list_check = grouped_check_in_outs?.map((group) => (
        <div className={style.checkGroup} key={group.date}>
            <div className={style.header}>{group.date}</div>

            {group.items.map((item) => (
                <div className={style.check} key={item.id}>
                    <div>
                        <div className={handle_Check_Color(item.type)}>{item.type}</div>
                        <div>{item.note}</div>
                    </div>
                    {item.image && <img src={handleSrcImage(item.image)} alt="CheckInOut" />}
                </div>
            ))}
        </div>
    ));

    return (
        <div className={style.parent}>
            {list_check}
            <div className={style.seeMore}>{has_more && <div onClick={() => handle_See_More()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(CheckList);
