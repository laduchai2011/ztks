import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { set__is_loading, set__data__toast_message } from '@src/redux/slice/Check_In_Out_Manager';
import { route_enum } from '@src/router/type';
import { select_enum } from '@src/router/type';
import { use_get_All_Members_Query } from '@src/redux/query/account_RTK';
import { useLazy_get_Check_In_Outs_Query } from '@src/redux/query/check_in_out_RTK';
import OneCheckMember from './component/OneCheckMember';
import { Account_Field } from '@src/data_struct/account';
import { Get_My_Check_In_Outs_Body_Field } from '@src/data_struct/check_in_out/body';
import { Check_In_Out_With_Date_Field } from '@src/data_struct/check_in_out';
import { SEE_MORE } from '@src/const/text';

interface Check_In_Out_Group_Field {
    date: string;
    items: Check_In_Out_With_Date_Field[];
}

const CheckListMember = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const [has_more, set__has_more] = useState<boolean>(true);
    const [grouped_check_in_outs, set__grouped_check_in_outs] = useState<Check_In_Out_Group_Field[]>();
    const [all_members, set__all_members] = useState<Account_Field[]>([]);
    const [page, set__page] = useState<number>(1);
    const [days, set__days] = useState<string[]>([]);

    const [get_Check_In_Outs] = useLazy_get_Check_In_Outs_Query();

    const {
        data: data__all_members,
        // isFetching,
        isLoading: is_loading__all_members,
        isError: is_error__all_members,
        error: error__all_members,
    } = use_get_All_Members_Query({ added_by_id: '' });
    useEffect(() => {
        if (is_error__all_members && error__all_members) {
            console.error(error__all_members);
        }
    }, [dispatch, is_error__all_members, error__all_members]);
    useEffect(() => {
        dispatch(set__is_loading(is_loading__all_members));
    }, [dispatch, is_loading__all_members]);
    useEffect(() => {
        const res_data = data__all_members;
        if (res_data?.is_success && res_data?.data) {
            set__all_members(res_data.data);
        }
    }, [data__all_members]);

    useEffect(() => {
        const date = new Date();
        date.setDate(date.getDate() - (page - 1));
        if (page === 1) {
            set__days([date.toISOString().split('T')[0]]);
        } else {
            set__days((prev) => [...prev, date.toISOString().split('T')[0]]);
        }
    }, [page]);

    const handle_See_More = () => {
        set__page((prev) => prev + 1);
    };

    const list_check = days.map((day, index1) => (
        <div className={style.checkGroup} key={index1}>
            <div className={style.header}>{day}</div>
            {all_members.map((item, index2) => (
                <OneCheckMember key={index2} index={index2} account={item} day={day} />
            ))}
        </div>
    ));

    return (
        <div className={style.parent}>
            {list_check}
            <div className={style.seeMore}>
                <div onClick={() => handle_See_More()}>{SEE_MORE}</div>
            </div>
        </div>
    );
};

export default memo(CheckListMember);
