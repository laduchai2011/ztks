import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { FaCreditCard } from 'react-icons/fa6';
import TextEditor from '@src/component/TextEditor';

const Infor1 = () => {
    const dispatch = useDispatch<AppDispatch>();

    const handle_Selected_Order_Type = () => {};

    return (
        <div className={style.parent}>
            <div className={style.infor11}>
                <div>
                    <div>
                        <div>
                            <FaCreditCard size={35} color="white" />
                        </div>
                    </div>
                </div>
                <div>
                    <div>Tạo đơn hàng mới</div>
                    <div>Nhập thông tin đơn hàng</div>
                </div>
            </div>
            <div className={style.infor12}>
                <div>
                    Tiêu đề <span>*</span>
                </div>
                <div>
                    <div>
                        <input placeholder="Nhập tiêu đề" />
                        <div>0/255</div>
                    </div>
                </div>
            </div>
            <div className={style.infor13}>
                <div>
                    Nội dung <span>*</span>
                </div>
                <div>
                    <div>
                        <TextEditor />
                    </div>
                </div>
            </div>
            <div className={style.infor14}>
                <div>
                    <div>
                        <div>
                            Loại đơn <span>*</span>
                        </div>
                        <div>
                            <select value={'Sản phẩm'} id="order_type" onChange={handle_Selected_Order_Type}>
                                <option>Sản phẩm</option>
                                <option>Dịch vụ</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <div>
                            Tổng giá trị <span>*</span>
                        </div>
                        <div>
                            <div>
                                <input placeholder="Tổng số tiền" />
                            </div>
                            <div>VND</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Infor1);
