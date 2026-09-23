import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';
import { CLOSE, AGREE, EXIT, CHANGE_CHAT_ROOM_MASTER, SEE_MORE } from '@src/const/text';
import {
    set__data__toast_message,
    set__is_loading,
    set__is_show__change_chat_room_master_dialog,
} from '@src/redux/slice/Message_V1';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { avatarnull } from '@src/utility/string';
import { useLazy_get_Members_Query } from '@src/redux/query/account_RTK';
import { use_change_Chat_Room_Master_Mutation } from '@src/redux/query/chat_room_RTK';
import { Account_Field, Account_Information_Field } from '@src/data_struct/account';
import { handleSrcImage } from '@src/utility/string';

const ChangeChatRoomMasterDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const { id } = useParams<{ id: string }>();

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const is_show: boolean = useSelector(
        (state: RootState) => state.Message_V1_Slice.change_chat_room_master_dialog.is_show
    );

    const [searched_account_id, set__searched_account_id] = useState<string>('');
    const [selected_member, set__selected_member] = useState<Account_Field | undefined>(undefined);
    const [members, set__members] = useState<Account_Field[]>([]);
    const [has_more, set__has_more] = useState<boolean>(true);
    const [page, set__page] = useState<number>(1);
    const [is_search, set__is_search] = useState<boolean>(true);
    const size = 10;

    const [get_Members] = useLazy_get_Members_Query();
    const [change_Chat_Room_Master] = use_change_Chat_Room_Master_Mutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show) {
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
    }, [is_show]);

    const handle_Searched_Account_Id = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__searched_account_id(e.target.value);
    };

    useEffect(() => {
        if (!account_information?.added_by_id) return;
        if (!is_search) return;

        const searched_account_id_cp = searched_account_id.trim();

        dispatch(set__is_loading(true));
        get_Members({
            page: page,
            size: size,
            account_id: account_information.added_by_id,
            searched_account_id: searched_account_id_cp.length > 0 ? searched_account_id_cp : undefined,
        })
            .then((res) => {
                const res_data = res.data;

                if (res_data?.is_success && res_data.data) {
                    if (page === 1) {
                        set__members(res_data.data.items);
                    } else {
                        set__members((prev) => [...prev, ...(res_data.data?.items || [])]);
                    }

                    set__has_more(res_data.data.items.length === size);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => {
                dispatch(set__is_loading(false));
                set__is_search(false);
            });
    }, [get_Members, account_information, searched_account_id, dispatch, page, is_search]);

    const handle_Close = () => {
        dispatch(set__is_show__change_chat_room_master_dialog(false));
    };

    const handle_See_More = () => {
        if (!has_more) return;
        set__page((prev) => prev + 1);
    };

    const handle_Selected = (e: React.ChangeEvent<HTMLInputElement>, item: Account_Field) => {
        const checked = e.target.checked;
        if (checked) {
            set__selected_member(item);
        }
    };

    const handle_Search = () => {
        set__is_search(true);
    };

    const handle_Agree = () => {
        if (!selected_member) return;
        if (!id) return;
        if (!account_information) return;

        dispatch(set__is_loading(true));
        change_Chat_Room_Master({
            chat_room_id: id,
            new_account_id: selected_member.id,
            account_id: account_information.account_id,
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.SUCCESS,
                            message: 'Thay đổi thành công !',
                        })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Thay đổi không thành công !',
                        })
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    };

    const list_member = members.map((item) => {
        const is_selected = selected_member?.id === item.id ? true : false;

        if (item.id === account_information?.account_id) {
            return;
        }

        const avatar_url_ = item.avatar ? handleSrcImage(item.avatar) : avatarnull;

        return (
            <div className={style.one} key={item.id}>
                <img src={avatar_url_} alt="" />
                <div>{item.first_name + ' ' + item.last_name}</div>
                <input checked={is_selected} onChange={(e) => handle_Selected(e, item)} type="checkbox" />
            </div>
        );
    });

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.header}>{CHANGE_CHAT_ROOM_MASTER}</div>
                    <div className={style.filter}>
                        <div>
                            <input
                                value={searched_account_id}
                                onChange={(e) => handle_Searched_Account_Id(e)}
                                placeholder="Nhập id thành viên"
                            />
                            <CiSearch onClick={() => handle_Search()} size={20} />
                        </div>
                    </div>
                    <div className={style.list}>{list_member}</div>
                    <div className={style.seeMore}>
                        {has_more && <div onClick={() => handle_See_More()}>{SEE_MORE}</div>}
                    </div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handle_Agree()}>{AGREE}</button>
                    <button onClick={() => handle_Close()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(ChangeChatRoomMasterDialog);
