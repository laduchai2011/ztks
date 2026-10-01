import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { Account_Information_Field } from '@src/data_struct/account';
import { Depot_Field, Store_Field } from '@src/data_struct/shop';
import { useLazy_get_My_Stores_Query } from '@src/redux/query/shop_RTK';
import { SEE_MORE } from '@src/const/text';
import OneStore from './component/OneStore';

const ShopList = () => {
    const dispatch = useDispatch<AppDispatch>();

    const selected_depot: Depot_Field | undefined = useSelector((state: RootState) => state.Shop_Slice.selected_depot);
    const new_store: Store_Field | undefined = useSelector((state: RootState) => state.Shop_Slice.new_store);
    const edited_store: Store_Field | undefined = useSelector((state: RootState) => state.Shop_Slice.edited_store);
    const deleted_store: Store_Field | undefined = useSelector((state: RootState) => state.Shop_Slice.deleted_store);

    const [store_list, set__store_list] = useState<Store_Field[]>([]);
    const limit = 5;
    const [cursor, set__cursor] = useState<string | undefined>(undefined);
    const [next_cursor, set__next_cursor] = useState<string | undefined>(undefined);
    const [has_more, set__has_more] = useState<boolean>(true);

    const [get_My_Stores] = useLazy_get_My_Stores_Query();

    useEffect(() => {
        if (!selected_depot) return;
        get_My_Stores({ cursor: cursor, limit: limit, depot_id: selected_depot.id || '' })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data?.data) {
                    if (!cursor) {
                        set__store_list(res_data.data.items);
                    } else {
                        set__store_list((prev) => [...prev, ...(res_data.data?.items ?? [])]);
                    }
                    set__next_cursor(res_data.data?.next_cursor || undefined);
                    set__has_more(res_data.data.items.length === limit);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [dispatch, get_My_Stores, cursor, selected_depot]);

    useEffect(() => {
        if (!new_store) return;
        set__store_list((prev) => [new_store, ...prev]);
    }, [new_store]);
    useEffect(() => {
        if (!edited_store) return;
        set__store_list((prev) => prev.map((store) => (store.id === edited_store.id ? edited_store : store)));
    }, [edited_store]);
    useEffect(() => {
        if (!deleted_store) return;
        set__store_list((prev) => prev.filter((store) => store.id !== deleted_store.id));
    }, [deleted_store]);

    const handle_See_More = () => {
        if (!has_more) return;
        if (!next_cursor) return;
        set__cursor(next_cursor);
    };

    const list = store_list.map((item, index) => {
        return <OneStore key={item.id} data={item} index={index} />;
    });

    if (store_list.length === 0) {
        return <div className={style.parent1}>Chưa có cửa hàng nào</div>;
    }

    return (
        <div className={style.parent}>
            <div>{list}</div>
            <div>{has_more && <div onClick={() => handle_See_More()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(ShopList);
