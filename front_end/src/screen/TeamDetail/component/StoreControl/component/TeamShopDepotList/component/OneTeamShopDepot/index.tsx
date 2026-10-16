import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { IoMdLock, IoMdUnlock } from 'react-icons/io';
import { Account_Information_Field, account_type_enum } from '@src/data_struct/account';
import { Team_Shop_Depot_Field, Depot_Field } from '@src/data_struct/shop';
import { Lock_Team_Shop_Depot_Body_Field } from '@src/data_struct/shop/body';
import { useLazy_get_Depot_By_Id_Query, use_lock_Team_Shop_Depot_Mutation } from '@src/redux/query/shop_RTK';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';

const OneTeamShopDepot: FC<{ data: Team_Shop_Depot_Field }> = ({ data }) => {
    const dispatch = useDispatch<AppDispatch>();

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );

    const [depot, set__depot] = useState<Depot_Field | undefined>(undefined);
    const [team_shop_depot, set__team_shop_depot] = useState<Team_Shop_Depot_Field>(data);

    const [get_Depot_By_Id] = useLazy_get_Depot_By_Id_Query();
    const [lock_Team_Shop_Depot] = use_lock_Team_Shop_Depot_Mutation();

    useEffect(() => {
        get_Depot_By_Id({ id: data.depot_id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__depot(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [get_Depot_By_Id, data]);

    const handle_lock_Team_Shop_Depot = (is_lock: boolean) => {
        if (!account_information) return;

        if (account_information.account_type !== account_type_enum.ADMIN) {
            dispatch(
                global_set__data__toast_message({
                    message: 'Bạn không phải admin !',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }

        const body: Lock_Team_Shop_Depot_Body_Field = {
            id: team_shop_depot.id,
            is_lock: is_lock,
            admin_account_id: account_information.account_id,
        };

        dispatch(global_set__is_loading(true));
        lock_Team_Shop_Depot(body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__team_shop_depot(res_data.data);
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Cập nhật khóa thành công !',
                            type: messageType_enum.SUCCESS,
                        })
                    );
                } else {
                    dispatch(
                        global_set__data__toast_message({
                            message: 'Cập nhật khóa không thành công !',
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
    };

    return (
        <div className={style.parent}>
            <div>{depot?.name}</div>
            {team_shop_depot.is_lock && <IoMdLock onClick={() => handle_lock_Team_Shop_Depot(false)} color="red" />}
            {!team_shop_depot.is_lock && <IoMdUnlock onClick={() => handle_lock_Team_Shop_Depot(true)} color="gray" />}
        </div>
    );
};

export default memo(OneTeamShopDepot);
