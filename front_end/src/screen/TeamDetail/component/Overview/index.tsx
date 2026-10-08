import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import GlobalLoading from '@src/Global/GlobalLoading';
import GlobalToastMessage from '@src/Global/GlobalToastMessage';
import { avatarnull } from '@src/utility/string';
import { Account_Field, Account_Information_Field } from '@src/data_struct/account';
import { Team_Field, Team_Member_Field, Team_Member_Role_Enum } from '@src/data_struct/team';
import { Add_Team_Member_Body_Field } from '@src/data_struct/team/body';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import {
    useLazy_get_Team_By_Id_Query,
    useLazy_get_Team_Leader_Query,
    use_add_Team_Member_Mutation,
} from '@src/redux/query/team_RTK';
import { useLazy_get_Account_With_Id_Query } from '@src/redux/query/account_RTK';

const Overview = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );

    const [leader_account_id, set__leader_account_id] = useState<string>('');
    const [team, set__team] = useState<Team_Field | undefined>(undefined);
    const [team_leader, set__team_leader] = useState<Team_Member_Field | undefined>(undefined);
    const [leader_account, set__leader_account] = useState<Account_Field | undefined>(undefined);

    const [get_Team_By_Id] = useLazy_get_Team_By_Id_Query();
    const [get_Team_Leader] = useLazy_get_Team_Leader_Query();
    const [get_Account] = useLazy_get_Account_With_Id_Query();
    const [add_Team_Member] = use_add_Team_Member_Mutation();

    useEffect(() => {
        if (!id) return;
        async function get_Infor() {
            try {
                const res_team = await get_Team_By_Id({ id: id! });
                const res_data_team = res_team.data;
                if (res_data_team?.is_success && res_data_team.data) {
                    set__team(res_data_team.data);
                }
            } catch (error) {
                console.error(error);
            }
        }
        get_Infor();
    }, [id, get_Team_By_Id]);

    useEffect(() => {
        async function get_Infor() {
            try {
                if (!team) return;
                const res_team_leader = await get_Team_Leader({ team_id: team.id });
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
    }, [team, get_Team_Leader, get_Account]);

    useEffect(() => {
        async function get_Infor() {
            try {
                if (!team_leader) return;
                const res_account = await get_Account({ id: team_leader.account_id });
                const res_data_account = res_account.data;
                if (res_data_account?.is_success && res_data_account.data) {
                    set__leader_account(res_data_account.data);
                }
            } catch (error) {
                console.error(error);
            }
        }

        get_Infor();
    }, [team_leader, get_Account]);

    const handle_Leader_Account_Id_Input = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__leader_account_id(value);
    };

    const handle_Add_Team_Leader = () => {
        if (!account_information) {
            return;
        }

        if (!(account_information?.added_by_id === account_information.account_id)) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Bạn không phải admin !',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }

        if (!team) {
            return;
        }

        if (leader_account_id.trim().length === 0) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Vui lòng nhập định danh !',
                    type: messageType_enum.WARN,
                })
            );
        }

        const body: Add_Team_Member_Body_Field = {
            team_id: team.id,
            account_id: leader_account_id.trim(),
            admin_account_id: account_information?.added_by_id,
            role: Team_Member_Role_Enum.LEADER,
        };

        dispatch(global_set__is_loading(true));
        add_Team_Member(body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__team_leader(res_data.data);
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Thêm nhóm trưởng thành công !',
                            type: messageType_enum.SUCCESS,
                        })
                    );
                } else {
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Thêm nhóm trưởng không thành công !',
                            type: messageType_enum.WARN,
                        })
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    global_set__data__toast_message({
                        message: 'Đã có lỗi xảy ra !',
                        type: messageType_enum.ERROR,
                    })
                );
            })
            .finally(() => {
                dispatch(global_set__is_loading(false));
            });
    };

    if (!leader_account) {
        return (
            <div className={style.parent1}>
                <div>
                    <div>
                        <input
                            value={leader_account_id}
                            onChange={(e) => handle_Leader_Account_Id_Input(e)}
                            placeholder="Định danh"
                        />
                    </div>
                    <div onClick={() => handle_Add_Team_Leader()}>Thêm nhóm trưởng</div>
                </div>
            </div>
        );
    }

    return (
        <div className={style.parent}>
            <div className={style.avatar}>
                <img src={avatarnull} alt="Team Image" />
            </div>
            <div className={style.name}>{`${leader_account.first_name} ${leader_account.last_name}`}</div>
            <div className={style.type}>Sales</div>
            <div className={style.icons}>
                <FaLock size={20} color="red" />
                <MdDelete size={20} color="red" />
            </div>
        </div>
    );
};

export default memo(Overview);
