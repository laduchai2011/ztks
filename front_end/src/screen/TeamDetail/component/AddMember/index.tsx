import { memo, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoMdAdd } from 'react-icons/io';
import { ADD } from '@src/const/text';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set__new_team_member } from '@src/redux/slice/Team_Detail';
import { use_add_Team_Member_Mutation } from '@src/redux/query/team_RTK';
import { Account_Information_Field } from '@src/data_struct/account';
import { Team_Member_Field, Team_Member_Role_Enum } from '@src/data_struct/team';
import { Add_Team_Member_Body_Field } from '@src/data_struct/team/body';

const AddMember = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();

    const add_container_element = useRef<HTMLDivElement | null>(null);

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const team_leader: Team_Member_Field | undefined = useSelector(
        (state: RootState) => state.Team_Detail_Slice.team_leader
    );

    const [is_show, set__is_show] = useState<boolean>(false);
    const [member_account_id, set__member_account_id] = useState<string>('');

    const [add_Team_Member] = use_add_Team_Member_Mutation();

    useEffect(() => {
        if (!add_container_element.current) return;
        const addContainerElement = add_container_element.current;

        if (is_show) {
            addContainerElement.classList.add(style.is_show);
        } else {
            addContainerElement.classList.remove(style.is_show);
        }
    }, [is_show]);

    const handle_Show = () => {
        set__is_show(!is_show);
    };

    const handle_Input_Member_Account_Id = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__member_account_id(value);
    };

    const handle_Add_Team_Member = () => {
        if (!id) return;

        if (!team_leader) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Vui lòng thêm nhóm trưởng trước !',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }

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

        if (member_account_id.trim().length === 0) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Vui lòng nhập định danh !',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }

        if (team_leader.account_id === member_account_id.trim()) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Không thể thêm nhóm trưởng vào làm thành viên !',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }

        const body: Add_Team_Member_Body_Field = {
            team_id: id,
            account_id: member_account_id.trim(),
            admin_account_id: account_information?.added_by_id,
            role: Team_Member_Role_Enum.MEMBER,
        };
        dispatch(global_set__is_loading(true));
        add_Team_Member(body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__new_team_member(res_data.data));
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Thêm thành viên mới thành công !',
                            type: messageType_enum.SUCCESS,
                        })
                    );
                } else {
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Thêm thành viên mới không thành công !',
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
            <div className={style.icon}>
                <IoMdAdd onClick={() => handle_Show()} size={25} color="green" title={ADD} />
            </div>
            <div className={style.add_container} ref={add_container_element}>
                <div className={style.add}>
                    <div className={style.id}>
                        <input
                            value={member_account_id}
                            onChange={(e) => handle_Input_Member_Account_Id(e)}
                            placeholder="Định danh"
                        />
                    </div>
                    <div className={style.btn_container}>
                        <div onClick={() => handle_Add_Team_Member()} title={ADD}>
                            {ADD}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(AddMember);
