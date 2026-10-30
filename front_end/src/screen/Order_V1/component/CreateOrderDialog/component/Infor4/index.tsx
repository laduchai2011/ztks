import { memo, useRef, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { TbBrandProducthunt } from 'react-icons/tb';
import { CiSearch } from 'react-icons/ci';
import { IoCloseOutline } from 'react-icons/io5';
import { CgMathMinus, CgMathPlus } from 'react-icons/cg';
import { FiLock, FiUnlock } from 'react-icons/fi';
import { SEE_MORE } from '@src/const/text';
import { avatarnull } from '@src/utility/string';

const Infor4 = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const list_selected_product = [1, 2, 3, 4].map((item, index) => {
        return (
            <div key={index}>
                <div>
                    <div>{index}</div>
                    <IoCloseOutline size={20} />
                </div>
                <div>
                    <div>Tên</div>
                    <div>Tên</div>
                </div>
                <div>
                    <div>Số lượng</div>
                    <div>100</div>
                </div>
                <div>
                    <div>
                        Giá <span>(Đề xuất)</span>
                    </div>
                    <div>1.000.000</div>
                </div>
                <div>
                    <div>Sản phẩm</div>
                    <div>Xem</div>
                </div>
                <div>
                    <div>Gian hàng</div>
                    <div>Gian VN</div>
                </div>
                <div>
                    <div>Kho hàng</div>
                    <div>kho VN</div>
                </div>
                <div>
                    <div>Cửa hàng</div>
                    <div>Cửa VN</div>
                </div>
            </div>
        );
    });

    const list_product = [1, 2, 3, 4].map((item, index) => {
        return (
            <div key={index}>
                <div>
                    <div>{index}</div>
                    <FiLock color="red" size={12} />
                </div>
                <div>
                    <input type="checkbox" />
                </div>
                <div>
                    Ten <span>(Tên)</span>
                </div>
                <div>
                    So luong <span>(Số lượng)</span>
                </div>
                <div>
                    Gia <span>(Giá)</span>
                </div>
                <div>
                    Gian <span>(Gian)</span>
                </div>
                <div>
                    Kho <span>(Kho)</span>
                </div>
                <div>
                    Cua hang <span>(Cửa hàng)</span>
                </div>
                <div>
                    <CgMathMinus />
                    <input />
                    <CgMathPlus />
                </div>
                <div>
                    Khóa <span>(Khóa)</span>
                </div>
                <div>
                    <div>Thêm</div>
                </div>
                <div>Xem</div>
            </div>
        );
    });

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.infor41}>
                <div>
                    <div>
                        <TbBrandProducthunt />
                    </div>
                </div>
                <div>
                    <div>Sản phẩm</div>
                    <div>Chọn sản phẩm cho đơn hàng</div>
                </div>
            </div>
            <div className={style.infor42}>
                <div className={style.infor421}>
                    <div>
                        <div>Tìm kiếm sản phẩm</div>
                        <div>
                            <input placeholder="Bạn đang tìm gì ?" />
                            <CiSearch />
                        </div>
                    </div>
                </div>
                <div className={style.infor422}>
                    <div>Sản phẩm được chọn</div>
                    <div>{list_selected_product}</div>
                </div>
                <div className={style.infor423}>
                    <div>Danh sách sản phẩm</div>
                    <div>{list_product}</div>
                    <div>
                        <div>{SEE_MORE}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Infor4);
