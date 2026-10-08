import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { avatarnull } from '@src/utility/string';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { route_enum } from '@src/router/type';
import { Team_Field, Team_Type_Enum } from '@src/data_struct/team';
import { Account_Field } from '@src/data_struct/account';
import { useLazy_get_Team_Leader_Query } from '@src/redux/query/team_RTK';
import { useLazy_get_Account_With_Id_Query } from '@src/redux/query/account_RTK';

const OneTeam: FC<{ data: Team_Field }> = ({ data }) => {
    const navigate = useNavigate();

    const [is_lock, set__is_lock] = useState<boolean>(data.is_lock);
    const [leader_account, set__leader_account] = useState<Account_Field | undefined>(undefined);

    const [get_Team_Leader] = useLazy_get_Team_Leader_Query();
    const [get_Account] = useLazy_get_Account_With_Id_Query();

    useEffect(() => {
        async function get_Infor() {
            try {
                const res_team_leader = await get_Team_Leader({ team_id: data.id });
                const res_data_team_leader = res_team_leader.data;
                if (res_data_team_leader?.is_success && res_data_team_leader.data) {
                    const res_account = await get_Account({ id: res_data_team_leader.data.account_id });
                    const res_data_account = res_account.data;
                    if (res_data_account?.is_success && res_data_account.data) {
                        set__leader_account(res_data_account.data);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }

        get_Infor();
    }, [data, get_Team_Leader, get_Account]);

    const handle_Type_Class = () => {
        switch (data.type) {
            case Team_Type_Enum.SALE: {
                return style.sale;
            }
            case Team_Type_Enum.STORE: {
                return style.store;
            }
            default: {
                return;
            }
        }
    };

    const handle_Lock = () => {
        set__is_lock(true);
    };

    const handle_Un_Lock = () => {
        set__is_lock(false);
    };

    const handle_Go_To_Team_Detail = () => {
        navigate(`${route_enum.TEAM_DETAIL}/${data.id}`);
    };

    return (
        <div className={style.parent} onClick={() => handle_Go_To_Team_Detail()}>
            <div className={style.name}>{data.name}</div>
            <div className={style.type}>
                <div className={`${style.type1} ${handle_Type_Class()}`}>{data.type}</div>
                <div>
                    {is_lock && <FaLock onClick={() => handle_Un_Lock()} color="red" />}
                    {!is_lock && <FaLockOpen onClick={() => handle_Lock()} color="gray" />}
                </div>
            </div>
            {leader_account && (
                <div className={style.team_leader}>
                    <img src={avatarnull} alt="avatar" />
                    <div>team leader</div>
                </div>
            )}
            {!leader_account && <div className={style.not_team_leader}>Chưa có nhóm trưởng</div>}
        </div>
    );
};

export default memo(OneTeam);
