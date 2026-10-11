import { memo, useRef, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { CLOSE, SEE_MORE } from '@src/const/text';
import { set__is_show_depot_list_dialog } from '@src/redux/slice/Team_Detail';
import { useLazy_get_My_Depots_Query } from '@src/redux/query/shop_RTK';
import { Account_Information_Field } from '@src/data_struct/account';
import { Shop_Field, Depot_Field } from '@src/data_struct/shop';
import OneDepot from './component/OneDepot';

const DepotListDialog = () => {
    const dispatch = useDispatch<AppDispatch>();

    const parent_element = useRef<HTMLDivElement | null>(null);

    const selected_shop: Shop_Field | undefined = useSelector(
        (state: RootState) => state.Team_Detail_Slice.selected_shop
    );
    const is_show_depot_list_dialog: boolean = useSelector(
        (state: RootState) => state.Team_Detail_Slice.is_show_depot_list_dialog
    );

    const [depot_list, set__depot_list] = useState<Depot_Field[]>([]);
    const limit = 5;
    const [cursor, set__cursor] = useState<string | undefined>(undefined);
    const [next_cursor, set__next_cursor] = useState<string | undefined>(undefined);
    const [has_more, set__has_more] = useState<boolean>(false);

    const [get_My_Depots] = useLazy_get_My_Depots_Query();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show_depot_list_dialog) {
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
    }, [is_show_depot_list_dialog]);

    useEffect(() => {
        if (!selected_shop) return;
        get_My_Depots({ cursor: cursor, limit: limit, shop_id: selected_shop.id })
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

    const handle_Close = () => {
        dispatch(set__is_show_depot_list_dialog(false));
    };

    const handle_See_More = () => {
        if (!has_more) return;
        if (!next_cursor) return;
        set__cursor(next_cursor);
    };

    const list = depot_list.map((item, index) => {
        return <OneDepot key={item.id} data={item} index={index} />;
    });

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.header}>
                    <div>Danh sách shop</div>
                    <IoCloseOutline onClick={() => handle_Close()} size={30} title={CLOSE} />
                </div>
                <div className={style.content}>
                    <div>{list}</div>
                    <div>{has_more && <div onClick={() => handle_See_More()}>{SEE_MORE}</div>}</div>
                </div>
            </div>
        </div>
    );
};

export default memo(DepotListDialog);
