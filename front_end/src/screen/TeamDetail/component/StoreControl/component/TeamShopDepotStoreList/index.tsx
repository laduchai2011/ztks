import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoIosAddCircleOutline } from 'react-icons/io';
import OneTeamShopDepotStore from './component/OneTeamShopDepotStore';
import { SEE_MORE } from '@src/const/text';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { Account_Information_Field, account_type_enum } from '@src/data_struct/account';
import { Store_Field, Team_Shop_Depot_Field, Team_Shop_Depot_Store_Field } from '@src/data_struct/shop';
import {
    useLazy_get_Team_Shop_Depot_Stores_Query,
    use_add_Team_Shop_Depot_Store_Mutation,
} from '@src/redux/query/shop_RTK';

const StoreList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const selected_team_shop_depot: Team_Shop_Depot_Field | undefined = useSelector(
        (state: RootState) => state.Team_Detail_Slice.selected_team_shop_depot
    );
    const selected_store: Store_Field | undefined = useSelector(
        (state: RootState) => state.Team_Detail_Slice.selected_store
    );

    const [team_shop_depot_stores, set__team_shop_depot_stores] = useState<Team_Shop_Depot_Store_Field[]>([]);
    const limit = 15;
    const [cursor, set__cursor] = useState<string | undefined>(undefined);
    const [next_cursor, set__next_cursor] = useState<string | undefined>(undefined);
    const [has_more, set__has_more] = useState<boolean>(false);

    const [get_Team_Shop_Depot_Stores] = useLazy_get_Team_Shop_Depot_Stores_Query();
    const [add_Team_Shop_Depot_Store] = use_add_Team_Shop_Depot_Store_Mutation();

    useEffect(() => {
        if (!selected_team_shop_depot) return;
        get_Team_Shop_Depot_Stores({ cursor: cursor, limit: limit, team_shop_depot_id: selected_team_shop_depot.id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data?.data) {
                    if (!cursor) {
                        set__team_shop_depot_stores(res_data.data.items);
                    } else {
                        set__team_shop_depot_stores((prev) => [...prev, ...(res_data.data?.items ?? [])]);
                    }
                    set__next_cursor(res_data.data?.next_cursor || undefined);
                    set__has_more(res_data.data.items.length === limit);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [dispatch, get_Team_Shop_Depot_Stores, cursor, selected_team_shop_depot]);

    useEffect(() => {
        if (!selected_store) return;
        if (!account_information) return;
        if (!selected_team_shop_depot) return;

        // if (account_information.account_type !== account_type_enum.ADMIN) {
        //     dispatch(
        //         global_set__data__toast_message({
        //             message: 'Bạn không phải admin !',
        //             type: messageType_enum.WARN,
        //         })
        //     );
        //     return;
        // }

        dispatch(global_set__is_loading(true));
        add_Team_Shop_Depot_Store({
            team_shop_depot_id: selected_team_shop_depot.id,
            store_id: selected_store.id,
            admin_account_id: account_information.account_id,
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__team_shop_depot_stores((prev) => [res_data.data!, ...prev]);
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Thêm thành công !',
                            type: messageType_enum.SUCCESS,
                        })
                    );
                } else {
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Thêm không thành công !',
                            type: messageType_enum.WARN,
                        })
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    global_set__data__toast_message({
                        message: 'Đã có lỗi xảy ra !',
                        type: messageType_enum.ERROR,
                    })
                );
            })
            .finally(() => {
                dispatch(global_set__is_loading(false));
            });
    }, [dispatch, selected_store, account_information, selected_team_shop_depot, add_Team_Shop_Depot_Store]);

    const handle_See_More = () => {
        if (!has_more) return;
        if (!next_cursor) return;
        set__cursor(next_cursor);
    };

    const list = team_shop_depot_stores.map((item) => {
        return <OneTeamShopDepotStore key={item.id} data={item} />;
    });

    return (
        <div className={style.parent}>
            <div className={style.header}>
                <IoIosAddCircleOutline size={20} color="green" />
                <div>Danh sách gian hàng</div>
            </div>
            <div className={style.list}>{list}</div>
            {has_more && (
                <div className={style.see_more} onClick={() => handle_See_More()}>
                    {SEE_MORE}
                </div>
            )}
        </div>
    );
};

export default memo(StoreList);
