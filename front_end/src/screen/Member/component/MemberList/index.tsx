import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { SEE_MORE } from '@src/const/text';
import Filter from './component/Filter';
import OneMember from './component/OneMember';
import { useLazy_get_Members_Query } from '@src/redux/query/account_RTK';
import { set__is_loading, set__data__toast_message } from '@src/redux/slice/Member';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { Account_Field, Account_Information_Field } from '@src/data_struct/account';

const MemberList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );

    const searched_account_id: string = useSelector((state: RootState) => state.Member_Slice.searched_account_id);
    const new_member: Account_Field | undefined = useSelector((state: RootState) => state.Member_Slice.new_member);
    const [members, set__members] = useState<Account_Field[]>([]);
    const [has_more, set__has_more] = useState<boolean>(true);
    const [page, set__page] = useState<number>(1);
    const size = 10;

    const [get_Members] = useLazy_get_Members_Query();

    useEffect(() => {
        if (!new_member) return;
        set__members((prev) => [new_member, ...prev]);
    }, [new_member]);

    useEffect(() => {
        if (!account_information?.added_by_id) return;

        const searched_account_id_cp = searched_account_id.trim();
        dispatch(set__is_loading(true));
        get_Members({
            page: 1,
            size: size,
            account_id: account_information.added_by_id,
            searched_account_id: searched_account_id_cp.length > 0 ? searched_account_id_cp : undefined,
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
            .finally(() => dispatch(set__is_loading(false)));
    }, [dispatch, get_Members, searched_account_id, account_information]);

    const handle_See_More = () => {
        if (!has_more) return;
        const searched_account_id_cp = searched_account_id.trim();
        dispatch(set__is_loading(true));
        get_Members({
            page: page,
            size: size,
            account_id: '',
            searched_account_id: searched_account_id_cp.length > 0 ? searched_account_id_cp : undefined,
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

    const list_member = members.map((item, index) => {
        return <OneMember data={item} key={index} />;
    });

    return (
        <div className={style.parent}>
            <Filter />
            <div>{list_member}</div>
            <div className={style.seeMore}>
                <div onClick={() => handle_See_More()}>{SEE_MORE}</div>
            </div>
        </div>
    );
};

export default memo(MemberList);
