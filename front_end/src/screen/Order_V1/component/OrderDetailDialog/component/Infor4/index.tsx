import { memo, useRef, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { FaLink } from 'react-icons/fa';

const Infor4 = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.infor41}>
                <div>
                    <div>
                        <FaLink />
                    </div>
                </div>
                <div>Thông tin liên kết</div>
            </div>
            <div className={style.infor42}>
                <div>
                    <div>Nhân viên tạo đơn</div>
                    <div>name</div>
                    <div>team</div>
                    <div>time</div>
                </div>
                <div>
                    <div>Nhân viên nhận đơn</div>
                    <div>name</div>
                    <div>team</div>
                    <div>time</div>
                </div>
                <div>
                    <div>Khách hàng</div>
                    <div>name</div>
                    <div>sdt</div>
                    <div>dia chi</div>
                </div>
            </div>
        </div>
    );
};

export default memo(Infor4);
