import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import OneMember from './component/OneMember';
import { useLazy_get_Team_Members_Query } from '@src/redux/query/team_RTK';
import { Team_Member_Field } from '@src/data_struct/team';
import { SEE_MORE } from '@src/const/text';

const List = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();

    const new_team_member: Team_Member_Field | undefined = useSelector(
        (state: RootState) => state.Team_Detail_Slice.new_team_member
    );

    const [team_members, set__team_members] = useState<Team_Member_Field[]>([]);
    const limit = 15;
    const [cursor, set__cursor] = useState<string | undefined>(undefined);
    const [next_cursor, set__next_cursor] = useState<string | undefined>(undefined);
    const [has_more, set__has_more] = useState<boolean>(false);

    const [get_Team_Members] = useLazy_get_Team_Members_Query();

    useEffect(() => {
        if (!id) return;
        get_Team_Members({ cursor: cursor, limit: limit, team_id: id! })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data?.data) {
                    if (!cursor) {
                        set__team_members(res_data.data.items);
                    } else {
                        set__team_members((prev) => [...prev, ...(res_data.data?.items ?? [])]);
                    }
                    set__next_cursor(res_data.data?.next_cursor || undefined);
                    set__has_more(res_data.data.items.length === limit);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [dispatch, get_Team_Members, cursor, id]);

    useEffect(() => {
        if (!new_team_member) return;
        set__team_members((prev) => [new_team_member, ...prev]);
    }, [new_team_member]);

    const handle_See_More = () => {
        if (!has_more) return;
        if (!next_cursor) return;
        set__cursor(next_cursor);
    };

    const list = team_members.map((item, index) => {
        return <OneMember key={item.id} data={item} index={index} />;
    });

    return (
        <div className={style.parent}>
            <div>{list}</div>
            <div>{has_more && <div onClick={() => handle_See_More()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(List);
