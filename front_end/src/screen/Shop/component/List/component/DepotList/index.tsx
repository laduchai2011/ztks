import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { Shop_Field, Depot_Field } from '@src/data_struct/shop';
import { useLazy_get_My_Depots_Query } from '@src/redux/query/shop_RTK';
import { SEE_MORE } from '@src/const/text';
import OneDepot from './component/OneDepot';

const DepotList = () => {
    const dispatch = useDispatch<AppDispatch>();

    const selected_shop: Shop_Field | undefined = useSelector((state: RootState) => state.Shop_Slice.selected_shop);
    const new_depot: Depot_Field | undefined = useSelector((state: RootState) => state.Shop_Slice.new_depot);
    const edited_depot: Depot_Field | undefined = useSelector((state: RootState) => state.Shop_Slice.edited_depot);
    const deleted_depot: Depot_Field | undefined = useSelector((state: RootState) => state.Shop_Slice.deleted_depot);

    const [depot_list, set__depot_list] = useState<Depot_Field[]>([]);
    const limit = 5;
    const [cursor, set__cursor] = useState<string | undefined>(undefined);
    const [next_cursor, set__next_cursor] = useState<string | undefined>(undefined);
    const [has_more, set__has_more] = useState<boolean>(false);

    const [get_My_Depots] = useLazy_get_My_Depots_Query();

    useEffect(() => {
        if (!selected_shop) return;
        get_My_Depots({ cursor: cursor, limit: limit, shop_id: selected_shop?.id || '' })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data?.data) {
                    if (!cursor) {
                        set__depot_list(res_data.data.items);
                    } else {
                        set__depot_list((prev) => [...prev, ...(res_data.data?.items ?? [])]);
                    }
                    set__next_cursor(res_data.data?.next_cursor || undefined);
                    set__has_more(res_data.data.items.length === limit);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [dispatch, get_My_Depots, cursor, selected_shop]);

    useEffect(() => {
        if (!new_depot) return;
        set__depot_list((prev) => [new_depot, ...prev]);
    }, [new_depot]);
    useEffect(() => {
        if (!edited_depot) return;
        set__depot_list((prev) => prev.map((depot) => (depot.id === edited_depot.id ? edited_depot : depot)));
    }, [edited_depot]);
    useEffect(() => {
        if (!deleted_depot) return;
        set__depot_list((prev) => prev.filter((depot) => depot.id !== deleted_depot.id));
    }, [deleted_depot]);

    const handle_See_More = () => {
        if (!has_more) return;
        if (!next_cursor) return;
        set__cursor(next_cursor);
    };

    const list = depot_list.map((item, index) => {
        return <OneDepot key={item.id} data={item} index={index} />;
    });

    if (depot_list.length === 0) {
        return <div className={style.parent1}>Chưa có cửa hàng nào</div>;
    }

    return (
        <div className={style.parent}>
            <div>{list}</div>
            <div>{has_more && <div onClick={() => handle_See_More()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(DepotList);
