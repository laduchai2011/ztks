import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { SEE_MORE } from '@src/const/text';
import { useLazy_get_Zns_Messages_Query } from '@src/redux/query/zalo_RTK';
import { Account_Field } from '@src/data_struct/account';
import { Zns_Message_Field } from '@src/data_struct/zalo';
import { set__data__toast_message, set__is_loading } from '@src/redux/slice/Zns_Detail';
import { messageType_enum } from '@src/component/ToastMessage/type';
import OneDay from './component/OneDay';

const ZnsMessageList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);

    const [days, set__days] = useState<Zns_Message_Field[][]>([[]]);
    const [page, set__page] = useState<number>(1);
    const [has_more, set__has_more] = useState<boolean>(true);

    const [get_Zns_Messages] = useLazy_get_Zns_Messages_Query();

    useEffect(() => {
        if (!account) return;
        if (!id) return;

        dispatch(set__is_loading(true));
        get_Zns_Messages({ page: page, size: 1, zns_template_id: id, account_id: account.id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    if (page === 1) {
                        set__days([res_data.data]);
                    } else {
                        set__days((prev) => [...prev, res_data.data ?? []]);
                    }
                    set__has_more(true);
                } else {
                    set__has_more(false);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(set__data__toast_message({ type: messageType_enum.ERROR, message: 'Đã có lỗi xảy ra !' }));
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    }, [dispatch, get_Zns_Messages, account, id, page]);

    const handle_See_More = () => {
        if (!has_more) return;
        set__page((prev) => prev + 1);
    };

    const day_list = days.map((item, index) => {
        return <OneDay messages={item} key={index} />;
    });

    return (
        <div className={style.parent}>
            <div>{day_list}</div>
            <div className={style.seeMore}>{has_more && <div onClick={() => handle_See_More()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(ZnsMessageList);
