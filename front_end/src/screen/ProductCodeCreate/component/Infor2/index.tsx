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
                <div>Chi tiết sản phẩm</div>
            </div>
            <div className={style.detail}>
                <div>
                    Mô tả chi tiết <span>*</span>
                </div>
                <div>
                    <TextEditor />
                </div>
            </div>
        </div>
    );
};

export default memo(Infor2);
