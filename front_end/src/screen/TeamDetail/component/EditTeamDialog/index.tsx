import { memo, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { CLOSE, TEAM, EDIT } from '@src/const/text';
import { Edit_Team_Body_Field } from '@src/data_struct/team/body';
import { use_edit_Team_Mutation } from '@src/redux/query/team_RTK';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set__is_show_edit_team, set__edited_team } from '@src/redux/slice/Team_Detail';
import { Team_Field } from '@src/data_struct/team';
import { Account_Information_Field } from '@src/data_struct/account';

const EditTeamDialog = () => {
    const dispatch = useDispatch<AppDispatch>();

    const parent_element = useRef<HTMLDivElement | null>(null);
    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );

    const is_show_edit_team: boolean = useSelector((state: RootState) => state.Team_Detail_Slice.is_show_edit_team);
    const selected_edit_team: Team_Field | undefined = useSelector(
        (state: RootState) => state.Team_Detail_Slice.selected_edit_team
    );

    const [edit_team, set__edit_team] = useState<Edit_Team_Body_Field>({
        id: '',
        name: '',
        admin_account_id: '',
    });

    const [edit_Team] = use_edit_Team_Mutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show_edit_team) {
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
    }, [is_show_edit_team]);

    useEffect(() => {
        if (!selected_edit_team) return;
        const _edit_team: Edit_Team_Body_Field = {
            id: selected_edit_team.id,
            name: selected_edit_team.name,
            admin_account_id: '',
        };
        set__edit_team(_edit_team);
    }, [selected_edit_team]);

    const handle_Close = () => {
        dispatch(set__is_show_edit_team(false));
    };

    const handle_Edit_Team = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        switch (type) {
            case 'name': {
                set__edit_team((prev) => ({
                    ...prev,
                    name: value,
                }));
                break;
            }
            default: {
                //statements;
                break;
            }
        }
    };

    const handle_Edit = () => {
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

        if (edit_team.name.trim().length === 0) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Vui lòng nhập tên nhóm !',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }

        const body: Edit_Team_Body_Field = {
            id: edit_team.id,
            name: edit_team.name.trim(),
            admin_account_id: account_information?.added_by_id,
        };
        dispatch(global_set__is_loading(true));
        edit_Team(body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__edited_team(res_data.data));
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Thay đổi thông tin nhóm thành công !',
                            type: messageType_enum.SUCCESS,
                        })
                    );
                    dispatch(set__is_show_edit_team(false));
                } else {
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Thay đổi thông tin nhóm không thành công !',
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
                    <div>Thay đổi thông tin kho</div>
                    <IoCloseOutline onClick={() => handle_Close()} size={30} title={CLOSE} />
                </div>
                <div className={style.content}>
                    <div>
                        <div>
                            <div className={style.input1}>
                                <input
                                    value={edit_team.name}
                                    onChange={(e) => handle_Edit_Team('name', e)}
                                    placeholder="Tên của hàng"
                                    maxLength={50}
                                />
                            </div>

                            <div className={style.btn1}>
                                <div onClick={() => handle_Edit()}>{EDIT}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className={style.header}>
                            <div>{TEAM}</div>
                        </div>
                        <div className={style.content}>
                            <div>{`Bạn đang chỉnh sửa thông tin nhóm (${selected_edit_team?.name})`}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(EditTeamDialog);
