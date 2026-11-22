import { FC, memo, Ref } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
// import { useSelector, useDispatch } from 'react-redux';
// import { RootState, AppDispatch } from '@src/redux';
// import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { route_enum } from '@src/router/type';
import { Product_Field } from '@src/data_struct/product';
import { handleSrcImage } from '@src/utility/string';

const OneProduct: FC<{ data: Product_Field; ref?: Ref<HTMLDivElement> }> = ({ data, ref }) => {
    const navigate = useNavigate();
    // const dispatch = useDispatch<AppDispatch>();

    const handle_Go_To_Product_Detail = () => {
        navigate(route_enum.PRODUCT_DETAIL + '/' + `${data.id}`);
    };

    return (
        <div className={style.parent} ref={ref} onClick={() => handle_Go_To_Product_Detail()}>
            <img src={handleSrcImage(data.images[0].url)} />
            <div className={style.name}>{data.name}</div>
            <div className={style.description}>{data.description}</div>
            <div className={style.infor}>
                <span>Hình ảnh ({data.images.length})</span>
                <span>Thước phim ({data.videos.length})</span>
                <span>Số lượng ({data.quantity_in - data.quantity_out})</span>
                <span>Giá ({data.unit_price})</span>
            </div>
        </div>
    );
};

export default memo(OneProduct);
