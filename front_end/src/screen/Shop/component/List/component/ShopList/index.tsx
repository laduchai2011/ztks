import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { CiEdit } from 'react-icons/ci';
import { MdDeleteOutline } from 'react-icons/md';
import { Account_Information_Field } from '@src/data_struct/account';
import { Shop_Field } from '@src/data_struct/shop';
import { set__selected_shop, add__shop_list } from '@src/redux/slice/Shop';
import { useLazy_get_My_Shops_Query } from '@src/redux/query/shop_RTK';

const ShopList = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const selected_shop: Shop_Field | undefined = useSelector((state: RootState) => state.Shop_Slice.selected_shop);
    const shop_list: Shop_Field[] = useSelector((state: RootState) => state.Shop_Slice.shop_list);

    const limit = 5;
    const [cursor, set__cursor] = useState<string | undefined>(undefined);

    const [get_My_Shops] = useLazy_get_My_Shops_Query();

    useEffect(() => {
        if (!account_information) return;
        get_My_Shops({ cursor: cursor, limit: limit, account_id: account_information.added_by_id || '' })
            .then((res) => {
                const res_data = res.data;
                console.log('get_My_Shops', res_data);
            })
            .catch((err) => {
                console.error(err);
            });
    }, [get_My_Shops, cursor, account_information]);

    const handle_Selected_Class = (data: Shop_Field) => {
        if (data.id === selected_shop?.id) {
            return style.selected;
        }
        return;
    };

    const handle_Selected = (data: Shop_Field) => {
        dispatch(set__selected_shop(data));
    };

    const list = shop_list.map((item, index) => {
        return (
            <div
                className={`${style.oneRow} ${handle_Selected_Class(item)}`}
                onClick={() => handle_Selected(item)}
                key={index}
            >
                <div className={style.infor1}>
                    <div className={style.index}>{index + 1}</div>
                    <div className={style.icons}>
                        <CiEdit size={20} color="green" />
                        <MdDeleteOutline size={20} color="red" />
                    </div>
                </div>
                <div className={style.infor2}>
                    <div>
                        <div className={style.name}>{item.name}</div>
                        <div className={style.des}>{item.description}</div>
                        <div className={style.content}>{item.content}</div>
                        <div className={style.address}>{item.address}</div>
                        <div className={style.phone}>{item.phone}</div>
                    </div>
                </div>
            </div>
        );
    });

    if (shop_list.length === 0) {
        return <div className={style.parent1}>Chưa có cửa hàng nào</div>;
    }

    return <div className={style.parent}>{list}</div>;
};

export default memo(ShopList);
