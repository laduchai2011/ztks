import { memo, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { CLOSE, DELETE } from '@src/const/text';
import { Delete_Team_Body_Field } from '@src/data_struct/team/body';
import { use_delete_Team_Mutation } from '@src/redux/query/team_RTK';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set__is_show_delete_team, set__deleted_team } from '@src/redux/slice/Team_Detail';
import { Team_Field } from '@src/data_struct/team';
import { Account_Information_Field } from '@src/data_struct/account';

const DeleteTeamDialog = () => {
    const dispatch = useDispatch<AppDispatch>();

    const parent_element = useRef<HTMLDivElement | null>(null);

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const is_show_delete_team: boolean = useSelector((state: RootState) => state.Team_Detail_Slice.is_show_delete_team);
    const selected_delete_team: Team_Field | undefined = useSelector(
        (state: RootState) => state.Team_Detail_Slice.selected_delete_team
    );

    const [name, set__name] = useState<string>('');

    const [delete_Team] = use_delete_Team_Mutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show_delete_team) {
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
    }, [is_show_delete_team]);

    const handle_Close = () => {
        dispatch(set__is_show_delete_team(false));
    };

    const handle_Name = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__name(value);
    };

    const handle_Delete = () => {
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

        if (!selected_delete_team) return;

        const name_t = name.trim();
        if (name_t !== selected_delete_team.name) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Tên kho không đúng !',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }
        const body: Delete_Team_Body_Field = {
            id: selected_delete_team.id,
            admin_account_id: account_information?.added_by_id,
        };
        dispatch(global_set__is_loading(true));
        delete_Team(body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__deleted_team(res_data.data));
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Xóa nhóm thành công !',
                            type: messageType_enum.SUCCESS,
                        })
                    );
                    dispatch(set__is_show_delete_team(false));
                } else {
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Xóa nhóm không thành công !',
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
                    <div>Xóa nhóm</div>
                    <IoCloseOutline onClick={() => handle_Close()} size={30} title={CLOSE} />
                </div>
                <div className={style.content}>
                    <div>
                        <div>{`Hãy nhập đúng tên nhóm để xóa (${selected_delete_team?.name})`}</div>
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

export default memo(DeleteTeamDialog);
