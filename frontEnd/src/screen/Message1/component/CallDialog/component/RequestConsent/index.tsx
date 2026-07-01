import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
// import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const RequestConsent = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    return (
        <div className={style.parent}>
            <div className={style.phone}>
                <div>Nhập số điện thoại của zalo này</div>
                <div>
                    <input placeholder="Số điện thoại" />
                </div>
            </div>
            <div className={style.callType}>
                <div>Chọn loại cuộc gọi</div>
                <div className={style.select}>
                    <div className={style.selected}>
                        <div>Chỉ âm thanh</div>
                        <div>
                            <FiChevronDown />
                        </div>
                    </div>
                    <div className={style.options}>
                        <div>Chỉ âm thanh</div>
                        <div>Chỉ thước phim</div>
                        <div>Cả âm thanh và thước phim</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(RequestConsent);
