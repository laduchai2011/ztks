import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoIosAddCircleOutline } from 'react-icons/io';
import OneTeamShop from './component/OneTeamShop';
import { SEE_MORE } from '@src/const/text';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set__is_show_shop_list_dialog } from '@src/redux/slice/Team_Detail';
import { useLazy_get_Team_Shops_Query, use_add_Team_Shop_Mutation } from '@src/redux/query/shop_RTK';
import { Account_Information_Field, account_type_enum } from '@src/data_struct/account';
import { Team_Shop_Field, Shop_Field } from '@src/data_struct/shop';

const TeamShopList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const selected_shop: Shop_Field | undefined = useSelector(
        (state: RootState) => state.Team_Detail_Slice.selected_shop
    );

    const [team_shops, set__team_shops] = useState<Team_Shop_Field[]>([]);
    const limit = 15;
    const [cursor, set__cursor] = useState<string | undefined>(undefined);
    const [next_cursor, set__next_cursor] = useState<string | undefined>(undefined);
    const [has_more, set__has_more] = useState<boolean>(false);

    const [get_Team_Shops] = useLazy_get_Team_Shops_Query();
    const [add_Team_Shop] = use_add_Team_Shop_Mutation();

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

    useEffect(() => {
        if (!id) return;
        if (!account_information) return;
        if (!selected_shop) return;

        if (account_information.account_type !== account_type_enum.ADMIN) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Bạn không phải admin !',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }

        dispatch(global_set__is_loading(true));
        add_Team_Shop({ shop_id: selected_shop.id, team_id: id, admin_account_id: account_information.account_id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__team_shops((prev) => [res_data.data!, ...prev]);
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
    }, [dispatch, id, account_information, selected_shop, add_Team_Shop]);

    const handle_Open_Shop_List_Dialog = () => {
        dispatch(set__is_show_shop_list_dialog(true));
    };

    const handle_See_More = () => {
        if (!has_more) return;
        if (!next_cursor) return;
        set__cursor(next_cursor);
    };

    const list = team_shops.map((item) => {
        return <OneTeamShop key={item.id} data={item} />;
    });

    return (
        <div className={style.parent}>
            <div className={style.header}>
                <IoIosAddCircleOutline onClick={() => handle_Open_Shop_List_Dialog()} size={20} color="green" />
                <div>Danh sách cửa hàng</div>
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

export default memo(TeamShopList);
