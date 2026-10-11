import { memo, useRef, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { CLOSE, SEE_MORE } from '@src/const/text';
import { set__is_show_shop_list_dialog } from '@src/redux/slice/Team_Detail';
import { useLazy_get_My_Shops_Query } from '@src/redux/query/shop_RTK';
import { Account_Information_Field } from '@src/data_struct/account';
import { Shop_Field } from '@src/data_struct/shop';
import OneShop from './component/OneShop';

const ShopListDialog = () => {
    const dispatch = useDispatch<AppDispatch>();

    const parent_element = useRef<HTMLDivElement | null>(null);

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const is_show_shop_list_dialog: boolean = useSelector(
        (state: RootState) => state.Team_Detail_Slice.is_show_shop_list_dialog
    );

    const [shop_list, set__shop_list] = useState<Shop_Field[]>([]);
    const limit = 5;
    const [cursor, set__cursor] = useState<string | undefined>(undefined);
    const [next_cursor, set__next_cursor] = useState<string | undefined>(undefined);
    const [has_more, set__has_more] = useState<boolean>(false);

    const [get_My_Shops] = useLazy_get_My_Shops_Query();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show_shop_list_dialog) {
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
    }, [is_show_shop_list_dialog]);

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

    const handle_Close = () => {
        dispatch(set__is_show_shop_list_dialog(false));
    };

    const handle_See_More = () => {
        if (!has_more) return;
        if (!next_cursor) return;
        set__cursor(next_cursor);
    };

    const list = shop_list.map((item, index) => {
        return <OneShop key={item.id} data={item} index={index} />;
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

export default memo(ShopListDialog);
