import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { IoIosAddCircleOutline } from 'react-icons/io';
import OneShop from './component/OneShop';
import { SEE_MORE } from '@src/const/text';
import { useLazy_get_Team_Shops_Query } from '@src/redux/query/shop_RTK';
import { Team_Shop_Field } from '@src/data_struct/shop';

const ShopList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();

    const [team_shops, set__team_shops] = useState<Team_Shop_Field[]>([]);
    const limit = 15;
    const [cursor, set__cursor] = useState<string | undefined>(undefined);
    const [next_cursor, set__next_cursor] = useState<string | undefined>(undefined);
    const [has_more, set__has_more] = useState<boolean>(false);

    const [get_Team_Shops] = useLazy_get_Team_Shops_Query();

    useEffect(() => {
        if (!id) return;
        get_Team_Shops({ cursor: cursor, limit: limit, team_id: id! })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data?.data) {
                    if (!cursor) {
                        set__team_shops(res_data.data.items);
                    } else {
                        set__team_shops((prev) => [...prev, ...(res_data.data?.items ?? [])]);
                    }
                    set__next_cursor(res_data.data?.next_cursor || undefined);
                    set__has_more(res_data.data.items.length === limit);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [dispatch, get_Team_Shops, cursor, id]);

    return (
        <div className={style.parent}>
            <div className={style.header}>
                <IoIosAddCircleOutline size={20} color="green" />
                <div>Danh sách cửa hàng</div>
            </div>
            <div className={style.list}>
                <OneShop />
                <OneShop />
                <OneShop />
                <OneShop />
                <OneShop />
                <OneShop />
                <OneShop />
                <OneShop />
                <OneShop />
                <OneShop />
                <OneShop />
                <OneShop />
                <OneShop />
                <OneShop />
                <OneShop />
            </div>
            <div className={style.see_more}>{SEE_MORE}</div>
        </div>
    );
};

export default memo(ShopList);
