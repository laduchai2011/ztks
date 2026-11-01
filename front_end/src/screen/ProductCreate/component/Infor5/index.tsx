import { memo, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import TextEditor from '@src/component/TextEditor';

const Infor2 = () => {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className={style.parent}>
            <div className={style.header}>
                <div />
                <div>Thông tin khác</div>
            </div>
            <div className={style.quantity}>
                <div>
                    Số lượng <span>*</span>
                </div>
                <div>
                    <input placeholder="Nhập số lượng ... " />
                </div>
            </div>
            <div className={style.price}>
                <div>
                    Giá bán <span>*</span>
                </div>
                <div>
                    <input placeholder="Nhập giá bán ..." />
                    <span>VND</span>
                </div>
                <div>
                    <div>
                        <input type="checkbox" />
                        <span>Giá cố định</span>
                    </div>
                    <div>
                        <input type="checkbox" />
                        <span>Giá tối thiểu</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Infor2);
