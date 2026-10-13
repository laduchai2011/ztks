import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { avatarnull } from '@src/utility/string';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { Team_Field, Team_Member_Field } from '@src/data_struct/team';
import { Lock_Team_Member_Body_Field } from '@src/data_struct/team/body';
import { Account_Field, Account_Information_Field, account_type_enum } from '@src/data_struct/account';
import { Shop_Field, Shop_Role_Type_Enum, Shop_Role_Type_Type } from '@src/data_struct/shop';
import {
    Admin_Set_Shop_Role_For_One_Account_Body_Field,
    Leader_Set_Shop_Role_For_One_Account_Body_Field,
} from '@src/data_struct/shop/body';
import { useLazy_get_Account_With_Id_Query } from '@src/redux/query/account_RTK';
import {
    useLazy_get_Shop_Role_For_One_Account_Query,
    use_admin_Set_Shop_Role_For_One_Account_Mutation,
    use_leader_Set_Shop_Role_For_One_Account_Mutation,
} from '@src/redux/query/shop_RTK';
import { useLazy_get_Team_By_Id_Query } from '@src/redux/query/team_RTK';
import { use_lock_Team_Member_Mutation } from '@src/redux/query/team_RTK';
import { handleSrcImage } from '@src/utility/string';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set__is_show_delete_team_member, set__selected_delete_team_member } from '@src/redux/slice/Team_Detail';

const OneMember: FC<{ data: Team_Member_Field; index: number }> = ({ data, index }) => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const team_leader: Team_Member_Field | undefined = useSelector(
        (state: RootState) => state.Team_Detail_Slice.team_leader
    );
    const selected_shop: Shop_Field | undefined = useSelector(
        (state: RootState) => state.Team_Detail_Slice.selected_shop
    );

    const [team, set__team] = useState<Team_Field | undefined>(undefined);
    const [team_member, set__team_member] = useState<Team_Member_Field>(data);
    const [member_account, set__member_account] = useState<Account_Field | undefined>(undefined);
    const [is_lock_shop, set__is_lock_shop] = useState<boolean>(true);

    const [get_Account] = useLazy_get_Account_With_Id_Query();
    const [lock_Team_Member] = use_lock_Team_Member_Mutation();
    const [get_Team_By_Id] = useLazy_get_Team_By_Id_Query();
    const [get_Shop_Role_For_One_Account] = useLazy_get_Shop_Role_For_One_Account_Query();
    const [admin_Set_Shop_Role_For_One_Account] = use_admin_Set_Shop_Role_For_One_Account_Mutation();
    const [leader_Set_Shop_Role_For_One_Account] = use_leader_Set_Shop_Role_For_One_Account_Mutation();

    useEffect(() => {
        get_Account({ id: team_member.account_id }).then((res) => {
            const res_data = res.data;
            if (res_data?.is_success && res_data.data) {
                set__member_account(res_data.data);
            }
        });
    }, [get_Account, team_member]);

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
        if (!selected_shop) return;
        if (!team) return;

        get_Shop_Role_For_One_Account({ account_id: data.account_id, shop_id: selected_shop.id, type: team.type })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__is_lock_shop(res_data.data.is_lock);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id, get_Shop_Role_For_One_Account, selected_shop, data, team]);

    const handle_Lock = (is_lock: boolean) => {
        if (!account_information) {
            return;
        }

        if (!team_leader) {
            return;
        }

        if (account_information.account_id !== team_leader.account_id) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Bạn không phải nhóm trưởng !',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }

        const body: Lock_Team_Member_Body_Field = {
            id: team_member.id,
            is_lock: is_lock,
            leader_account_id: team_leader.account_id,
        };

        dispatch(global_set__is_loading(true));
        lock_Team_Member(body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__team_member(res_data.data);
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Cập nhật khóa thành công !',
                            type: messageType_enum.SUCCESS,
                        })
                    );
                } else {
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Cập nhật khóa không thành công !',
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

    const handle_Open_Delete_Team_Member = () => {
        dispatch(set__is_show_delete_team_member(true));
        dispatch(set__selected_delete_team_member(team_member));
    };

    const handle_Set_Shop_Role_For_One_Account = (is_lock: boolean) => {
        if (!team) return;
        if (!selected_shop) return;
        if (!account_information) return;
        if (!team_leader) return;

        if (
            account_information.account_id === account_information?.added_by_id &&
            account_information.account_type === account_type_enum.ADMIN
        ) {
            // admin do it
            admin_Set_Shop_Role_For_One_Account({
                type: team.type,
                is_lock: is_lock,
                shop_id: selected_shop.id,
                account_id: data.account_id,
                admin_account_id: account_information.account_id,
            })
                .then((res) => {
                    const res_data = res.data;
                    if (res_data?.is_success && res_data.data) {
                        set__is_lock_shop(res_data.data.is_lock);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        } else if (team_leader.account_id === account_information.account_id) {
            // leader do it
            leader_Set_Shop_Role_For_One_Account({
                type: team.type,
                is_lock: is_lock,
                shop_id: selected_shop.id,
                account_id: data.account_id,
                leader_account_id: account_information.account_id,
            })
                .then((res) => {
                    const res_data = res.data;
                    if (res_data?.is_success && res_data.data) {
                        set__is_lock_shop(res_data.data.is_lock);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            dispatch(
                global_set__data__toast_message({
                    message: 'Bạn không có quyền này !',
                    type: messageType_enum.WARN,
                })
            );
        }
    };

    return (
        <div className={style.parent}>
            <div className={style.row1}>
                <div className={style.index}>{index + 1}</div>
                <div className={style.avatar}>
                    <img
                        src={member_account?.avatar ? handleSrcImage(member_account?.avatar) : avatarnull}
                        alt="TAvatar Member"
                    />
                </div>
                <div className={style.name}>{`${member_account?.first_name} ${member_account?.last_name}`}</div>
                <div className={style.role}>{data.role}</div>
                <div className={style.icons}>
                    {team_member.is_lock && <FaLock onClick={() => handle_Lock(false)} size={20} color="red" />}
                    {!team_member.is_lock && <FaLockOpen onClick={() => handle_Lock(true)} size={20} color="gray" />}
                    <MdDelete onClick={() => handle_Open_Delete_Team_Member()} size={20} color="red" />
                </div>
            </div>
            <div className={style.row2}>
                {selected_shop && is_lock_shop && (
                    <FaLock onClick={() => handle_Set_Shop_Role_For_One_Account(false)} size={16} color="#FF5C87" />
                )}
                {selected_shop && !is_lock_shop && (
                    <FaLockOpen onClick={() => handle_Set_Shop_Role_For_One_Account(true)} size={16} color="gray" />
                )}
                {/* {is_lock_shop && <FaLock size={16} color="#FF5C87" />}
                {!is_lock_shop && <FaLockOpen size={16} color="gray" />}
                {is_lock_shop && <FaLock size={16} color="#FF5C87" />}
                {!is_lock_shop && <FaLockOpen size={16} color="gray" />} */}
            </div>
        </div>
    );
};

export default memo(OneMember);
