import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { SESSION_LIST, SEE_MORE } from '@src/const/text';
import Session from './component/Session';
import { useLazy_get_Chat_Sessions_With_Account_Id_Query } from '@src/redux/query/chat_session_RTK';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set__is_loading, set__data__toast_message, set__chat_sessions } from '@src/redux/slice/Oa_Setting';
import { Zalo_Oa_Field } from '@src/data_struct/zalo';
import { Account_Field } from '@src/data_struct/account';
import { Chat_Session_Field } from '@src/data_struct/chat_session';
import { Crud_Enum } from '../../type';

const SessionList = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const zalo_oa: Zalo_Oa_Field | undefined = useSelector((state: RootState) => state.Oa_Setting_Slice.zalo_oa);
    const chat_sessions: Chat_Session_Field[] = useSelector((state: RootState) => state.Oa_Setting_Slice.chat_sessions);

    const [page, set__page] = useState<number>(1);
    const size = 10;
    const [total_count, set__total_count] = useState<number>(0);

    const [get_Chat_Sessions_With_Account_Id] = useLazy_get_Chat_Sessions_With_Account_Id_Query();

    useEffect(() => {
        if (!account) return;
        if (!zalo_oa) return;

        dispatch(set__is_loading(true));
        get_Chat_Sessions_With_Account_Id({ page: page, size: size, zalo_oa_id: zalo_oa.id, account_id: account.id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(
                        set__chat_sessions({
                            chat_sessions: res_data.data?.items,
                            crud_type: Crud_Enum.LOAD_MORE,
                            page: page,
                        })
                    );
                    set__total_count(res_data.data.total_count);
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
    }, [account, zalo_oa, dispatch, get_Chat_Sessions_With_Account_Id, page]);

    const handle_See_More = () => {
        set__page((prev) => prev + 1);
    };

    const list = chat_sessions.map((item, index) => {
        return <Session key={item.id} index={index + 1} data={item} />;
    });

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.header}>{SESSION_LIST}</div>
                <div className={style.list}>{list}</div>
                <div className={style.more}>
                    {chat_sessions.length < total_count && <div onClick={() => handle_See_More()}>{SEE_MORE}</div>}
                </div>
            </div>
        </div>
    );
};

export default memo(SessionList);
