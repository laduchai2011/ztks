import { memo, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { route_enum } from '@src/router/type';

const OneProduct = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handle_Go_To_Product_Detail = () => {
        navigate(route_enum.PRODUCT_DETAIL + '/' + `${1}`);
    };

    return (
        <div className={style.parent} onClick={() => handle_Go_To_Product_Detail()}>
            <img
                src={
                    'http://localhost:4000/api/service__image_v1/query/image/1790368982012_01a0a0c9-cf8c-7aaf-8348-faec9e683cfd_133962880188383301.jpg'
                }
            />
            <div className={style.description}>
                Mèo là loài động vật nhỏ nhắn, đáng yêu và nhanh nhẹn. Chúng có bộ lông mềm mại, đôi mắt long lanh, hai
                chiếc tai hình tam giác luôn vểnh lên nghe ngóng và chiếc đuôi dài uyển chuyển. Mèo có bốn chân nhỏ với
                những chiếc móng vuốt sắc nhọn. Chúng thường thích nằm sưởi nắng, cuộn tròn ngủ, chơi đùa với cuộn len
                và bắt chuột. Mèo rất sạch sẽ, thích được vuốt ve và thường phát ra tiếng kêu "meo meo" dễ thương. Tiếng
                kêu ấy khiến mèo trở thành một trong những vật nuôi gần gũi và được nhiều người yêu thích.
            </div>
            <div className={style.infor}>
                <span>Hình ảnh (10)</span>
                <span>Thước phim (10)</span>
                <span>Số lượng (10.000)</span>
                <span>Giá (1.000.000)</span>
            </div>
        </div>
    );
};

export default memo(OneProduct);
