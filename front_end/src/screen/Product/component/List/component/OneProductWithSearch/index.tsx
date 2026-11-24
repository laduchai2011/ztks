import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from '@src/redux';
// import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { route_enum } from '@src/router/type';
import { Product_Field } from '@src/data_struct/product';
import { handleSrcImage } from '@src/utility/string';
import { useLazy_get_Product_By_Id_Query } from '@src/redux/query/product_RTK';

const OneProduct: FC<{ id: string }> = ({ id }) => {
    const navigate = useNavigate();
    // const dispatch = useDispatch<AppDispatch>();

    const [data, set__data] = useState<Product_Field | null>(null);

    const [get_Product_By_Id] = useLazy_get_Product_By_Id_Query();

    useEffect(() => {
        get_Product_By_Id({ id: id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__data(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [get_Product_By_Id, id]);

    const handle_Go_To_Product_Detail = () => {
        navigate(route_enum.PRODUCT_DETAIL + '/' + `${id}`);
    };

    if (!data) {
        return;
    }

    return (
        <div className={style.parent} onClick={() => handle_Go_To_Product_Detail()}>
            <img src={handleSrcImage(data.images[0].url)} />
            <div className={style.name}>{data.name}</div>
            <div className={style.description}>{data.description}</div>
            <div className={style.infor}>
                <span>Hình ảnh ({data?.images.length})</span>
                <span>Thước phim ({data.videos.length})</span>
                <span>Số lượng ({data.quantity_in - data.quantity_out})</span>
                <span>Giá ({data.unit_price})</span>
            </div>
        </div>
    );
};

export default memo(OneProduct);
