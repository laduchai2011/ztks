import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { Account_Information_Field } from '@src/data_struct/account';
import { Shop_Field } from '@src/data_struct/shop';
import { useLazy_get_My_Shops_Query } from '@src/redux/query/shop_RTK';
import { SEE_MORE } from '@src/const/text';
import OneShop from './component/OneShop';

const ShopList = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const new_shop: Shop_Field | undefined = useSelector((state: RootState) => state.Shop_Slice.new_shop);
    const edited_shop: Shop_Field | undefined = useSelector((state: RootState) => state.Shop_Slice.edited_shop);
    const deleted_shop: Shop_Field | undefined = useSelector((state: RootState) => state.Shop_Slice.deleted_shop);

    const [shop_list, set__shop_list] = useState<Shop_Field[]>([]);
    const limit = 5;
    const [cursor, set__cursor] = useState<string | undefined>(undefined);
    const [next_cursor, set__next_cursor] = useState<string | undefined>(undefined);
    const [has_more, set__has_more] = useState<boolean>(true);

    const [get_My_Shops] = useLazy_get_My_Shops_Query();

    useEffect(() => {
        if (!account_information) return;
        get_My_Shops({ cursor: cursor, limit: limit, account_id: account_information.added_by_id || '' })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data?.data) {
                    if (!cursor) {
                        set__shop_list(res_data.data.items);
                    } else {
                        set__shop_list((prev) => [...prev, ...(res_data.data?.items ?? [])]);
                    }
                    set__next_cursor(res_data.data?.next_cursor || undefined);
                    set__has_more(res_data.data.items.length === limit);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [dispatch, get_My_Shops, cursor, account_information]);

    useEffect(() => {
        if (!new_shop) return;
        set__shop_list((prev) => [new_shop, ...prev]);
    }, [new_shop]);
    useEffect(() => {
        if (!edited_shop) return;
        set__shop_list((prev) => prev.map((shop) => (shop.id === edited_shop.id ? edited_shop : shop)));
    }, [edited_shop]);
    useEffect(() => {
        if (!deleted_shop) return;
        set__shop_list((prev) => prev.filter((shop) => shop.id !== deleted_shop.id));
    }, [deleted_shop]);

    const handle_See_More = () => {
        if (!has_more) return;
        if (!next_cursor) return;
        set__cursor(next_cursor);
    };

    const list = shop_list.map((item, index) => {
        return <OneShop key={item.id} data={item} index={index} />;
    });

    if (shop_list.length === 0) {
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
