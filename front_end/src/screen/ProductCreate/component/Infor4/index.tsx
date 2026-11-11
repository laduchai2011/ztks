import { memo, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { CiSearch } from 'react-icons/ci';
import { route_enum } from '@src/router/type';
import { SEE_MORE } from '@src/const/text';
import OneProductCode from './component/OneProductCode';

const Infor4 = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const handle_Selected_Product_Code = () => {};

    const handle_Go_To_Create_Product_Code = () => {
        navigate(route_enum.CREATE_PRODUCT_CODE);
    };

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
                    <div>
                        <div>
                            <input placeholder="Tìm kiếm mã sản phẩm" />
                            <div>
                                <CiSearch size={20} />
                            </div>
                        </div>
                        <div>
                            <div>
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                                <OneProductCode />
                            </div>
                            <div>
                                <div>{SEE_MORE}</div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <span onClick={handle_Go_To_Create_Product_Code}>Tạo mã</span>
                    </div>
                </div>
            </div>
            <div className={style.shop}>
                <div>
                    Cửa hàng <span>*</span>
                </div>
                <div>
                    <select value={'Chọn cửa hàng'} id="product_code" onChange={handle_Selected_Product_Code}>
                        <option>Chọn cửa hàng</option>
                        <option>Cửa hàng 1</option>
                        <option>Cửa hàng 2</option>
                    </select>
                </div>
            </div>
            <div className={style.depot}>
                <div>
                    Kho hàng <span>*</span>
                </div>
                <div>
                    <select value={'Chọn kho hàng'} id="product_code" onChange={handle_Selected_Product_Code}>
                        <option>Chọn kho hàng</option>
                        <option>Kho hàng 1</option>
                        <option>Kho hàng 2</option>
                    </select>
                </div>
            </div>
            <div className={style.store}>
                <div>
                    Gian hàng <span>*</span>
                </div>
                <div>
                    <select value={'Chọn gian hàng'} id="product_code" onChange={handle_Selected_Product_Code}>
                        <option>Chọn gian hàng</option>
                        <option>Gian hàng 1</option>
                        <option>Gian hàng 2</option>
                    </select>
                </div>
            </div>
        </div>
    );
};

export default memo(Infor4);
