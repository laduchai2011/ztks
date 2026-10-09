import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { avatarnull } from '@src/utility/string';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import { Team_Member_Field } from '@src/data_struct/team';
import { Lock_Team_Member_Body_Field } from '@src/data_struct/team/body';
import { Account_Field, Account_Information_Field } from '@src/data_struct/account';
import { useLazy_get_Account_With_Id_Query } from '@src/redux/query/account_RTK';
import { use_lock_Team_Member_Mutation } from '@src/redux/query/team_RTK';
import { handleSrcImage } from '@src/utility/string';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';

const OneMember: FC<{ data: Team_Member_Field; index: number }> = ({ data, index }) => {
    const dispatch = useDispatch<AppDispatch>();

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const team_leader: Team_Member_Field | undefined = useSelector(
        (state: RootState) => state.Team_Detail_Slice.team_leader
    );

    const [team_member, set__team_member] = useState<Team_Member_Field>(data);
    const [member_account, set__member_account] = useState<Account_Field | undefined>(undefined);

    const [get_Account] = useLazy_get_Account_With_Id_Query();
    const [lock_Team_Member] = use_lock_Team_Member_Mutation();

    useEffect(() => {
        get_Account({ id: team_member.account_id }).then((res) => {
            const res_data = res.data;
            if (res_data?.is_success && res_data.data) {
                set__member_account(res_data.data);
            }
        });
    }, [get_Account, team_member]);

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

    return (
        <div className={style.parent}>
            <div className={style.index}>{index + 1}</div>
            <div className={style.avatar}>
                <img
                    src={member_account?.avatar ? handleSrcImage(member_account?.avatar) : avatarnull}
                    alt="TAvatar Member"
                />
            </div>
            <div className={style.name}>{`${member_account?.first_name} ${member_account?.last_name}`}</div>
            <div className={style.role}>{team_member.role}</div>
            <div className={style.icons}>
                {team_member.is_lock && <FaLock onClick={() => handle_Lock(false)} size={20} color="red" />}
                {!team_member.is_lock && <FaLockOpen onClick={() => handle_Lock(true)} size={20} color="gray" />}
                <MdDelete size={20} color="red" />
            </div>
        </div>
    );
};

export default memo(OneMember);
