import { memo, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { GoChevronDown, GoChevronUp } from 'react-icons/go';
import { IoAdd } from 'react-icons/io5';
import Added from './component/Added';
import NotAdded from './component/NotAdded';
import { Account_Field } from '@src/data_struct/account';
import { Chat_Room_Field } from '@src/data_struct/chat_room';
import { use_get_Reply_Accounts_Query, use_get_Not_Reply_Accounts_Query } from '@src/redux/query/account_RTK';

const ReplyMember = () => {
    const { id } = useParams<{ id: string }>();
    const chat_room: Chat_Room_Field | undefined = useSelector((state: RootState) => state.Message_V1_Slice.chat_room);

    const notAddedlList_element = useRef<HTMLDivElement | null>(null);
    const [is_show_added, set__is_show_added] = useState<boolean>(false);
    const [reply_accounts, set__reply_account] = useState<Account_Field[]>([]);
    const [reply_account_total, set__reply_account_total] = useState<number>(-1);
    const [reply_account_index, set__reply_account_index] = useState<number>(1);
    const reply_account_size = 5;

    const addedlList_element = useRef<HTMLDivElement | null>(null);
    const [is_show_not_added, set__is_show_not_added] = useState<boolean>(false);
    const [not_reply_accounts, set__not_reply_account] = useState<Account_Field[]>([]);
    const [not_reply_account_total, set__not_reply_account_total] = useState<number>(-1);
    const [not_reply_account_index, set__not_reply_account_index] = useState<number>(1);
    const not_reply_account_size = 10;

    useEffect(() => {
        if (!addedlList_element.current) return;
        const addedListElement = addedlList_element.current;

        if (is_show_added) {
            addedListElement.classList.add(style.show);
        } else {
            addedListElement.classList.remove(style.show);
        }
    }, [is_show_added]);

    useEffect(() => {
        if (!notAddedlList_element.current) return;
        const notAddedListElement = notAddedlList_element.current;

        if (is_show_not_added) {
            notAddedListElement.classList.add(style.show);
        } else {
            notAddedListElement.classList.remove(style.show);
        }
    }, [is_show_not_added]);

    const handle_Show_Down = () => {
        set__is_show_added(true);
        set__is_show_not_added(false);
    };

    const handle_Show_Up = () => {
        set__is_show_added(false);
    };

    const handle_Show_Not_Added = () => {
        set__is_show_added(false);
        set__is_show_not_added(!is_show_not_added);
    };

    const {
        data: data__reply_account,
        // isFetching,
        isLoading: is_loading__reply_account,
        isError: is_error__reply_account,
        error: error__reply_account,
    } = use_get_Reply_Accounts_Query(
        { page: reply_account_index, size: reply_account_size, chat_room_id: id || '' },
        { skip: id === undefined }
    );
    useEffect(() => {
        if (is_error__reply_account && error__reply_account) {
            console.error(error__reply_account);
        }
    }, [is_error__reply_account, error__reply_account]);
    useEffect(() => {
        // dispatch(set_isLoading(isLoading_chatRoom));
    }, [is_loading__reply_account]);
    useEffect(() => {
        const res_data = data__reply_account;
        if (res_data?.is_success && res_data.data) {
            set__reply_account(res_data.data.items);
            set__reply_account_total(res_data.data.total_count);
        }
    }, [data__reply_account]);

    const {
        data: data__not_reply_account,
        // isFetching,
        isLoading: is_loading__not_reply_account,
        isError: is_error__not_reply_account,
        error: error__not_reply_account,
    } = use_get_Not_Reply_Accounts_Query(
        {
            page: not_reply_account_index,
            size: not_reply_account_size,
            chat_room_id: id || '',
            account_id: chat_room?.account_id || '',
        },
        { skip: id === undefined || chat_room === undefined }
    );
    useEffect(() => {
        if (is_error__not_reply_account && error__not_reply_account) {
            console.error(error__not_reply_account);
        }
    }, [is_error__not_reply_account, error__not_reply_account]);
    useEffect(() => {
        // dispatch(set_isLoading(isLoading_chatRoom));
    }, [is_loading__not_reply_account]);
    useEffect(() => {
        const res_data = data__not_reply_account;
        if (res_data?.is_success && res_data.data) {
            set__not_reply_account(res_data.data.items);
            set__not_reply_account_total(res_data.data.total_count);
        }
    }, [data__not_reply_account]);

    const handle_See_More__reply_Account = () => {
        set__reply_account_index((pre) => pre + 1);
    };

    const handle_See_More__not_reply_account = () => {
        set__not_reply_account_index((pre) => pre + 1);
    };

    const list_reply_account = reply_accounts.map((item, index) => {
        return <Added key={index} index={index} data={item} />;
    });

    const list_not_reply_account = not_reply_accounts.map((item, index) => {
        return <NotAdded key={index} index={index} data={item} />;
    });

    return (
        <div className={style.parent}>
            <div className={style.header}>
                <div>Thành viên trả lời tin nhắn</div>
                <div>
                    <IoAdd onClick={() => handle_Show_Not_Added()} size={25} color="greenyellow" />
                    {!is_show_added && <GoChevronDown onClick={() => handle_Show_Down()} size={25} />}
                    {is_show_added && <GoChevronUp onClick={() => handle_Show_Up()} size={25} />}
                </div>
            </div>
            <div className={style.addedList} ref={addedlList_element}>
                {list_reply_account}
                {reply_accounts.length < reply_account_total && (
                    <div className={style.addedMore} onClick={() => handle_See_More__reply_Account()}>
                        Xem thêm
                    </div>
                )}
            </div>
            <div className={style.notAddedList} ref={notAddedlList_element}>
                {list_not_reply_account}
                {not_reply_accounts.length < not_reply_account_total && (
                    <div className={style.notAddedMore} onClick={() => handle_See_More__not_Reply_Account()}>
                        Xem thêm
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(ReplyMember);
