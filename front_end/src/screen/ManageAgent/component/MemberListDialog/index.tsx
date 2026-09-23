import { memo, useRef, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';
import { CLOSE, SEE_MORE } from '@src/const/text';
import {
    set__is_show__member_list_dialog,
    set__agent__member_list_dialog,
    set__is_loading,
    set__data__toast_message,
} from '@src/redux/slice/Manage_Agent';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { avatarnull } from '@src/utility/string';
import { useLazy_get_Members_Query } from '@src/redux/query/account_RTK';
import { use_agent_Add_Account_Mutation } from '@src/redux/query/agent_RTK';
import { Account_Field, Account_Information_Field } from '@src/data_struct/account';
import { Agent_Field } from '@src/data_struct/agent';
import { handleSrcImage } from '@src/utility/string';

const MemberListDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const is_show: boolean = useSelector((state: RootState) => state.Manage_Agent_Slice.member_list_dialog.is_show);
    const agent: Agent_Field | undefined = useSelector(
        (state: RootState) => state.Manage_Agent_Slice.member_list_dialog.agent
    );
    const [members, set__members] = useState<Account_Field[]>([]);
    const [has_more, set__has_more] = useState<boolean>(true);
    const [page, set__page] = useState<number>(1);
    const size = 10;
    const [search_input, set__search_input] = useState<string>('');
    const [is_search, set__is_search] = useState<boolean>(true);

    const [get_Members] = useLazy_get_Members_Query();
    const [agent_Add_Account] = use_agent_Add_Account_Mutation();

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

    useEffect(() => {
        if (!is_search) return;
        if (!account_information?.added_by_id) return;

        const search_input_t = search_input.trim();
        dispatch(set__is_loading(true));
        get_Members({
            page: 1,
            size: size,
            account_id: account_information.added_by_id,
            searched_account_id: search_input_t.length > 0 ? search_input_t : undefined,
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__members(res_data.data.items);
                    set__page(2);
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
    }, [dispatch, get_Members, search_input, is_search, account_information]);

    const handle_Close = () => {
        dispatch(set__is_show__member_list_dialog(false));
    };

    const handle_Search = () => {
        set__is_search(true);
    };

    const handle_Search_Input = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__search_input(value);
    };

    const handle_See_More = () => {
        if (!has_more) return;
        const search_input_t = search_input.trim();
        dispatch(set__is_loading(true));
        get_Members({
            page: page,
            size: size,
            account_id: '',
            searched_account_id: search_input_t.length > 0 ? search_input_t : undefined,
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__members((prev) => [...prev, ...(res_data.data?.items || [])]);
                    set__page((pre) => pre + 1);
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
            .finally(() => dispatch(set__is_loading(false)));
    };

    const handle_Select = (item: Account_Field) => {
        if (!agent) return;
        dispatch(set__is_loading(true));
        agent_Add_Account({ id: agent.id, agent_account_id: item.id, account_id: '' })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__is_show__member_list_dialog(false));
                    dispatch(set__agent__member_list_dialog(res_data.data));
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
            .finally(() => dispatch(set__is_loading(false)));
    };

    const list_member = members.map((item, index) => {
        const avatarUrl = item.avatar ? handleSrcImage(item.avatar) : avatarnull;

        return (
            <div className={style.row} key={item.id} onClick={() => handle_Select(item)}>
                <div>{index + 1}</div>
                <img src={avatarUrl} alt="" />
                <div>{`${item.first_name} ${item.last_name}`}</div>
            </div>
        );
    });

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.search}>
                    <div>
                        <input
                            value={search_input}
                            onChange={(e) => handle_Search_Input(e)}
                            placeholder="Id thành viên !"
                        />
                        <CiSearch onClick={() => handle_Search()} size={25} />
                    </div>
                </div>
                <div className={style.list}>{list_member}</div>
                {has_more && (
                    <div className={style.seeMore}>
                        <div onClick={() => handle_See_More()}>{SEE_MORE}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(MemberListDialog);
