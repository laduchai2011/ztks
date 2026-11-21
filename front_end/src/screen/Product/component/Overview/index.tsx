import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import ChartAccordingToMoney from './component/ChartAccordingToMoney';
import ChartAccordingToQuantity from './component/ChartAccordingToQuantity';
import { useLazy_get_Product_Code_Total_Query, useLazy_get_Product_Total_Query } from '@src/redux/query/product_RTK';
import { Account_Information_Field } from '@src/data_struct/account';
import { Product_Code_Total_Field, Product_Total_Field } from '@src/data_struct/product';

const Overview = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );

    const [product_code_total, set__product_code_total] = useState<Product_Code_Total_Field | null>(null);
    const [product_total, set__product_total] = useState<Product_Total_Field | null>(null);

    const [get_Product_Code_Total] = useLazy_get_Product_Code_Total_Query();
    const [get_Product_Total] = useLazy_get_Product_Total_Query();

    useEffect(() => {
        if (!account_information) return;
        get_Product_Code_Total({ admin_account_id: account_information?.added_by_id || '' })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__product_code_total(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [account_information, get_Product_Code_Total]);

    useEffect(() => {
        if (!account_information) return;
        get_Product_Total({ admin_account_id: account_information?.added_by_id || '' })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__product_total(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [account_information, get_Product_Total]);

    return (
        <div className={style.parent}>
            <div className={style.view1}>
                <div>
                    {product_code_total && (
                        <div>
                            {product_code_total.active_total} <span>{product_code_total.deleted_total}</span>
                        </div>
                    )}
                    {!product_code_total && (
                        <div>
                            0 <span>0</span>
                        </div>
                    )}
                    <div>Mã sản phẩm</div>
                </div>
                <div>
                    {product_total && (
                        <div>
                            {product_total.active_total} <span>{product_total.deleted_total}</span>
                        </div>
                    )}
                    {!product_total && (
                        <div>
                            0 <span>0</span>
                        </div>
                    )}
                    <div>Sản phẩm</div>
                </div>
            </div>
            <div className={style.view2}>
                <div>
                    <ChartAccordingToMoney />
                </div>
                <div>
                    <ChartAccordingToQuantity />
                </div>
            </div>
        </div>
    );
};

export default memo(Overview);
