import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
// import { useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from '@src/redux';
// import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { useLazy_get_Product_Code_By_Id_Query } from '@src/redux/query/product_RTK';
import { Product_Code_Field } from '@src/data_struct/product';

const OneProductCode: FC<{ id: string }> = ({ id }) => {
    const [product_code, set__product_code] = useState<Product_Code_Field | undefined>(undefined);

    const [get_Product_Code_By_Id] = useLazy_get_Product_Code_By_Id_Query();

    useEffect(() => {
        get_Product_Code_By_Id({ id: id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__product_code(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [id, get_Product_Code_By_Id]);

    return (
        <div className={style.parent}>
            <div>{product_code?.name}</div>
            <div>description description description description description description</div>
        </div>
    );
};

export default memo(OneProductCode);
