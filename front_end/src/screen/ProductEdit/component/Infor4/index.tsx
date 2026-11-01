import { memo, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';

const Infor4 = () => {
    const dispatch = useDispatch<AppDispatch>();

    const handle_Selected_Product_Code = () => {};

    return (
        <div className={style.parent}>
            <div className={style.header}>
                <div />
                <div>Thông tin liên kết</div>
            </div>
            <div className={style.product_code}>
                <div>
                    Mã sản phẩm <span>*</span>
                </div>
                <div>
                    <select value={'Mã sản phẩm 1'} id="product_code" onChange={handle_Selected_Product_Code}>
                        <option>Mã sản phẩm 1</option>
                        <option>Mã sản phẩm 2</option>
                    </select>
                </div>
            </div>
            <div className={style.shop}>
                <div>
                    Cửa hàng <span>*</span>
                </div>
                <div>
                    <select value={'Mã sản phẩm 1'} id="product_code" onChange={handle_Selected_Product_Code}>
                        <option>Mã sản phẩm 1</option>
                        <option>Mã sản phẩm 2</option>
                    </select>
                </div>
            </div>
            <div className={style.depot}>
                <div>
                    Kho hàng <span>*</span>
                </div>
                <div>
                    <select value={'Mã sản phẩm 1'} id="product_code" onChange={handle_Selected_Product_Code}>
                        <option>Mã sản phẩm 1</option>
                        <option>Mã sản phẩm 2</option>
                    </select>
                </div>
            </div>
            <div className={style.store}>
                <div>
                    Gian hàng <span>*</span>
                </div>
                <div>
                    <select value={'Mã sản phẩm 1'} id="product_code" onChange={handle_Selected_Product_Code}>
                        <option>Mã sản phẩm 1</option>
                        <option>Mã sản phẩm 2</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default memo(Infor4);
