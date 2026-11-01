import { memo, useEffect } from 'react';
import style from './style.module.scss';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
// import { route_enum } from '@src/router/type';
import { select_enum } from '@src/router/type';
import { MdProductionQuantityLimits } from 'react-icons/md';
import { CiLock } from 'react-icons/ci';
import { GiMoneyStack } from 'react-icons/gi';
import { FaStore } from 'react-icons/fa';
import { FaBarcode } from 'react-icons/fa6';

const Infor1 = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className={style.parent}>
            <div className={style.name}>name</div>
            <div className={style.description}>
                Mèo là loài động vật nhỏ nhắn, đáng yêu và nhanh nhẹn. Chúng có bộ lông mềm mại, đôi mắt long lanh, hai
                chiếc tai hình tam giác luôn vểnh lên nghe ngóng và chiếc đuôi dài uyển chuyển. Mèo có bốn chân nhỏ với
                những chiếc móng vuốt sắc nhọn. Chúng thường thích nằm sưởi nắng, cuộn tròn ngủ, chơi đùa với cuộn len
                và bắt chuột. Mèo rất sạch sẽ, thích được vuốt ve và thường phát ra tiếng kêu "meo meo" dễ thương. Tiếng
                kêu ấy khiến mèo trở thành một trong những vật nuôi gần gũi và được nhiều người yêu thích.
            </div>
            <div className={style.quantity_lock_price}>
                <div>
                    <div>
                        <div>
                            <MdProductionQuantityLimits color="#FFBA00" />
                        </div>
                        <div>
                            <div>Số lượng</div>
                            <div>1.000</div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <CiLock color="red" />
                        </div>
                        <div>
                            <div>Trạng thái khóa</div>
                            <div>Đang khóa</div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <GiMoneyStack color="#E100FF" />
                        </div>
                        <div>
                            <div>Giá</div>
                            <div>1.000.000</div>
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
                            <div>1.000.000</div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <FaStore color="#ff4800" />
                        </div>
                        <div>
                            <div>Gian hàng</div>
                            <div>1.000.000</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Infor1);
