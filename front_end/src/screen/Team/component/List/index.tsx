import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { SEE_MORE } from '@src/const/text';
import OneTeam from './component/OneTeam';
import { useLazy_get_Teams_Query } from '@src/redux/query/team_RTK';
import { Account_Information_Field } from '@src/data_struct/account';
import { Team_Field } from '@src/data_struct/team';

const List = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const new_team: Team_Field | undefined = useSelector((state: RootState) => state.Team_Slice.new_team);

    const [team_list, set__team_list] = useState<Team_Field[]>([]);
    const limit = 5;
    const [cursor, set__cursor] = useState<string | undefined>(undefined);
    const [next_cursor, set__next_cursor] = useState<string | undefined>(undefined);
    const [has_more, set__has_more] = useState<boolean>(false);

    const [get_Teams] = useLazy_get_Teams_Query();

    useEffect(() => {
        if (!account_information) return;
        get_Teams({ cursor: cursor, limit: limit, admin_account_id: account_information?.added_by_id || '' })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data?.data) {
                    if (!cursor) {
                        set__team_list(res_data.data.items);
                    } else {
                        set__team_list((prev) => [...prev, ...(res_data.data?.items ?? [])]);
                    }
                    set__next_cursor(res_data.data?.next_cursor || undefined);
                    set__has_more(res_data.data.items.length === limit);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [dispatch, get_Teams, cursor, account_information]);

    useEffect(() => {
        if (!new_team) return;
        set__team_list((prev) => [new_team, ...prev]);
    }, [new_team]);

    const handle_See_More = () => {
        if (!has_more) return;
        if (!next_cursor) return;
        set__cursor(next_cursor);
    };

    const list = team_list.map((item) => {
        return (
            <div key={item.id}>
                <OneTeam data={item} />
            </div>
        );
    });

    return (
        <div className={style.parent}>
            <div className={style.list}>{list}</div>
            <div className={style.see_more}>{has_more && <div onClick={() => handle_See_More()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(List);
