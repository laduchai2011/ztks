import { memo, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoMdAdd } from 'react-icons/io';
import { ADD, CREATE } from '@src/const/text';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { use_create_Team_Mutation } from '@src/redux/query/team_RTK';
import { Team_Type_Enum, Team_Type_Type } from '@src/data_struct/team';
import { Create_Team_Body_Field } from '@src/data_struct/team/body';
import { Account_Information_Field } from '@src/data_struct/account';
import { set__new_team } from '@src/redux/slice/Team';

const CreateTeam = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );

    const create_container_element = useRef<HTMLDivElement | null>(null);

    const [is_show, set__is_show] = useState<boolean>(false);

    const [create_team_body, set__team_shop_body] = useState<Create_Team_Body_Field>({
        name: '',
        type: Team_Type_Enum.SALE,
        admin_account_id: '',
    });

    const [create_Team] = use_create_Team_Mutation();

    useEffect(() => {
        if (!create_container_element.current) return;
        const createContainerElement = create_container_element.current;

        if (is_show) {
            createContainerElement.classList.add(style.is_show);
        } else {
            createContainerElement.classList.remove(style.is_show);
        }
    }, [is_show]);

    const handle_Show = () => {
        set__is_show(!is_show);
    };

    const handle_Name = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__team_shop_body((prev) => ({
            ...prev,
            name: value,
        }));
    };

    const handle_Type_Click = (type: Team_Type_Type) => {
        set__team_shop_body((prev) => ({
            ...prev,
            type,
        }));
    };

    const handle_Type_Style = (type: Team_Type_Type) => {
        switch (create_team_body.type) {
            case Team_Type_Enum.SALE: {
                if (type === create_team_body.type) {
                    return style.selected_sale;
                }
                return;
            }
            case Team_Type_Enum.STORE: {
                if (type === create_team_body.type) {
                    return style.selected_store;
                }
                return;
            }
            default: {
                //statements;
                break;
            }
        }
    };

    const handle_Create = () => {
        if (create_team_body.name.trim().length === 0) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Vui lòng nhập tên nhóm !',
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

        const body: Create_Team_Body_Field = {
            name: create_team_body.name.trim(),
            type: create_team_body.type,
            admin_account_id: account_information?.added_by_id,
        };

        dispatch(global_set__is_loading(true));
        create_Team(body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__new_team(res_data.data));
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Tạo nhóm mới thành công !',
                            type: messageType_enum.SUCCESS,
                        })
                    );
                } else {
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Tạo nhóm mới không thành công !',
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
            <div className={style.create_container} ref={create_container_element}>
                <div className={style.create}>
                    <div className={style.name}>
                        <input
                            value={create_team_body.name}
                            onChange={(e) => handle_Name(e)}
                            placeholder="Tên gợi nhớ"
                        />
                    </div>
                    <div className={style.type}>
                        <div>
                            <div
                                className={handle_Type_Style(Team_Type_Enum.SALE)}
                                onClick={() => handle_Type_Click(Team_Type_Enum.SALE)}
                            >
                                Bán hàng
                            </div>
                        </div>
                        <div>
                            <div
                                className={handle_Type_Style(Team_Type_Enum.STORE)}
                                onClick={() => handle_Type_Click(Team_Type_Enum.STORE)}
                            >
                                Kho
                            </div>
                        </div>
                    </div>
                    <div className={style.btn_container}>
                        <div onClick={() => handle_Create()} title={CREATE}>
                            {CREATE}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(CreateTeam);
