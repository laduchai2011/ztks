import { memo, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { CLOSE, DELETE } from '@src/const/text';
import { Delete_Team_Member_Body_Field } from '@src/data_struct/team/body';
import { useLazy_get_Account_With_Id_Query } from '@src/redux/query/account_RTK';
import { use_delete_Team_Member_Mutation } from '@src/redux/query/team_RTK';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set__is_show_delete_team_member, set__deleted_team_member } from '@src/redux/slice/Team_Detail';
import { Team_Member_Field } from '@src/data_struct/team';
import { Account_Field, Account_Information_Field } from '@src/data_struct/account';

const DeleteTeamMemberDialog = () => {
    const dispatch = useDispatch<AppDispatch>();

    const parent_element = useRef<HTMLDivElement | null>(null);

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const team_leader: Team_Member_Field | undefined = useSelector(
        (state: RootState) => state.Team_Detail_Slice.team_leader
    );
    const is_show_delete_team_member: boolean = useSelector(
        (state: RootState) => state.Team_Detail_Slice.is_show_delete_team_member
    );
    const selected_delete_team_member: Team_Member_Field | undefined = useSelector(
        (state: RootState) => state.Team_Detail_Slice.selected_delete_team_member
    );

    const [name, set__name] = useState<string>('');
    const [member_account, set__member_account] = useState<Account_Field | undefined>(undefined);

    const [get_Account] = useLazy_get_Account_With_Id_Query();
    const [delete_Team_Member] = use_delete_Team_Member_Mutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show_delete_team_member) {
            parentElement.classList.add(style.display);
            const timeout2 = setTimeout(() => {
                parentElement.classList.add(style.opacity);
                clearTimeout(timeout2);
            }, 50);
        } else {
            parentElement.classList.remove(style.opacity);

            const timeout2 = setTimeout(() => {
                parentElement.classList.remove(style.display);
                clearTimeout(timeout2);
            }, 550);
        }
    }, [is_show_delete_team_member]);

    useEffect(() => {
        if (!selected_delete_team_member) return;
        get_Account({ id: selected_delete_team_member.account_id }).then((res) => {
            const res_data = res.data;
            if (res_data?.is_success && res_data.data) {
                set__member_account(res_data.data);
            }
        });
    }, [get_Account, selected_delete_team_member]);

    const handle_Close = () => {
        dispatch(set__is_show_delete_team_member(false));
    };

    const handle_Name = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__name(value);
    };

    const handle_Delete = () => {
        if (!account_information) {
            return;
        }

        if (!team_leader) {
            return;
        }

        if (!selected_delete_team_member) {
            return;
        }

        if (!member_account) {
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

        const name_t = name.trim();
        if (name_t !== `${member_account.first_name} ${member_account.last_name}`) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Tên thành viên không đúng !',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }
        const body: Delete_Team_Member_Body_Field = {
            id: selected_delete_team_member.id,
            leader_account_id: team_leader.account_id,
        };
        dispatch(global_set__is_loading(true));
        delete_Team_Member(body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__deleted_team_member(res_data.data));
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Xóa thành viên thành công !',
                            type: messageType_enum.SUCCESS,
                        })
                    );
                    dispatch(set__is_show_delete_team_member(false));
                } else {
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Xóa thành viên không thành công !',
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
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.header}>
                    <div>Xóa thành viên</div>
                    <IoCloseOutline onClick={() => handle_Close()} size={30} title={CLOSE} />
                </div>
                <div className={style.content}>
                    <div>
                        <div>{`Hãy nhập đúng tên thành viên để xóa (${member_account?.first_name} ${member_account?.last_name})`}</div>
                        <div>
                            <input value={name} onChange={(e) => handle_Name(e)} placeholder="Tên nhóm !" />
                        </div>
                        <div>
                            <div onClick={() => handle_Delete()}>{DELETE}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(DeleteTeamMemberDialog);
