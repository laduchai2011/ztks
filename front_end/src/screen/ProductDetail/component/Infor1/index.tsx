import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
// import { global_set__data__toast_message } from '@src/redux/slice/Global';
// import { route_enum } from '@src/router/type';
// import { select_enum } from '@src/router/type';
import { MdProductionQuantityLimits } from 'react-icons/md';
import { CiLock } from 'react-icons/ci';
import { GiMoneyStack } from 'react-icons/gi';
import { FaStore } from 'react-icons/fa';
import { FaBarcode } from 'react-icons/fa6';
import { Product_Field } from '@src/data_struct/product';
import { Store_Field, Depot_Field, Shop_Field } from '@src/data_struct/shop';
import { formatNumber } from '@src/utility/string';
import {
    useLazy_get_Store_By_Id_Query,
    useLazy_get_Depot_By_Id_Query,
    useLazy_get_Shop_By_Id_Query,
} from '@src/redux/query/shop_RTK';

const Infor1 = () => {
    const product: Product_Field | undefined = useSelector((state: RootState) => state.Product_Detail_Slice.product);

    const [store, set__store] = useState<Store_Field | null>(null);
    const [depot, set__depot] = useState<Depot_Field | null>(null);
    const [shop, set__shop] = useState<Shop_Field | null>(null);

    const [get_Store_By_Id] = useLazy_get_Store_By_Id_Query();
    const [get_Depot_By_Id] = useLazy_get_Depot_By_Id_Query();
    const [get_Shop_By_Id] = useLazy_get_Shop_By_Id_Query();

    useEffect(() => {
        if (!product) return;
        get_Store_By_Id({ id: product.store_id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__store(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [get_Store_By_Id, product]);

    useEffect(() => {
        if (!store) return;
        get_Depot_By_Id({ id: store.depot_id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__depot(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [get_Depot_By_Id, store]);

    useEffect(() => {
        if (!depot) return;
        get_Shop_By_Id({ id: depot.shop_id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__shop(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [get_Shop_By_Id, depot]);

    if (!product) return;
    return (
        <div className={style.parent}>
            <div className={style.name}>{product.name}</div>
            <div className={style.description}>{product.description}</div>
            <div className={style.quantity_lock_price}>
                <div>
                    <div>
                        <div>
                            <MdProductionQuantityLimits color="#FFBA00" />
                        </div>
                        <div>
                            <div>Số lượng</div>
                            <div>{formatNumber(product.quantity_in - product.quantity_out)}</div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <CiLock color="red" />
                        </div>
                        <div>
                            <div>Trạng thái khóa</div>
                            <div>{product.is_lock ? 'Đang khóa' : 'Đang mở'}</div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <GiMoneyStack color="#E100FF" />
                        </div>
                        <div>
                            <div>Giá</div>
                            <div>
                                {`${formatNumber(product.unit_price)} (${product.is_compelled_price ? 'Cố định' : 'Tối thiểu'})`}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.code_store}>
                <div>
                    <div>
                        <div>
                            <FaBarcode color="#6e6e6e" />
                        </div>
                        <div>
                            <div>Mã sản phẩm</div>
                            <div>{product.id}</div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <FaStore color="#ff4800" />
                        </div>
                        <div>
                            <div>Gian hàng</div>
                            <div>{`${shop?.name} >> ${depot?.name} >> ${store?.name}`}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Infor1);
