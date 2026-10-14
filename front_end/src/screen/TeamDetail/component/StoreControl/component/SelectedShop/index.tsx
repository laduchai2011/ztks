import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { set__is_show_shop_list_dialog } from '@src/redux/slice/Team_Detail';
import { Shop_Field, Shop_Role_Statistics_Field, Shop_Role_Type_Type } from '@src/data_struct/shop';
import { Team_Field } from '@src/data_struct/team';
import { useLazy_get_Shop_Role_Statistics_For_One_Team_Query } from '@src/redux/query/shop_RTK';
import { useLazy_get_Team_By_Id_Query } from '@src/redux/query/team_RTK';

const SelectedShop = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();

    const selected_shop: Shop_Field | undefined = useSelector(
        (state: RootState) => state.Team_Detail_Slice.selected_shop
    );

    const [shop_role_statistics, set__shop_role_statistics] = useState<Shop_Role_Statistics_Field | undefined>(
        undefined
    );
    const [is_lock, set__is_lock] = useState<boolean>(false);
    const [is_un_lock, set__is_un_lock] = useState<boolean>(false);
    const [team, set__team] = useState<Team_Field | undefined>(undefined);

    const [get_Shop_Role_Statistics_For_One_Team] = useLazy_get_Shop_Role_Statistics_For_One_Team_Query();
    const [get_Team_By_Id] = useLazy_get_Team_By_Id_Query();

    useEffect(() => {
        if (!id) return;
        async function get_Infor() {
            try {
                const res_team = await get_Team_By_Id({ id: id! });
                const res_data_team = res_team.data;
                if (res_data_team?.is_success && res_data_team.data) {
                    set__team(res_data_team.data);
                }
            } catch (error) {
                console.error(error);
            }
        }
        get_Infor();
    }, [id, get_Team_By_Id]);

    useEffect(() => {
        if (!id) return;
        if (!selected_shop) return;
        if (!team) return;

        const _type = team.type as unknown as Shop_Role_Type_Type;
        get_Shop_Role_Statistics_For_One_Team({
            team_id: id,
            shop_id: selected_shop.id,
            type: _type,
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__shop_role_statistics(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id, get_Shop_Role_Statistics_For_One_Team, selected_shop, team]);

    useEffect(() => {
        if (!shop_role_statistics) return;

        if (shop_role_statistics.locked_members > 0) {
            set__is_lock(true);
        } else {
            set__is_lock(false);
        }

        if (shop_role_statistics.locked_members !== shop_role_statistics.total_members) {
            set__is_un_lock(true);
        } else {
            set__is_un_lock(false);
        }
    }, [shop_role_statistics]);

    const handle_Open_Shop_List_Dialog = () => {
        dispatch(set__is_show_shop_list_dialog(true));
    };

    return (
        <div className={style.parent}>
            <div className={style.text}>Cửa hàng</div>
            <div className={style.btn} onClick={() => handle_Open_Shop_List_Dialog()}>
                Chọn
            </div>
            {selected_shop && (
                <div className={style.icons}>
                    {is_lock && <FaLock size={20} color="#FF5C87" />}
                    {is_un_lock && <FaLockOpen size={20} color="gray" />}
                </div>
            )}
            {selected_shop && <div>{selected_shop.name}</div>}
        </div>
    );
};

export default memo(SelectedShop);
