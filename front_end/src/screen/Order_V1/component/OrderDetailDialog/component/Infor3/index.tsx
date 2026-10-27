import { memo, useRef, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { FaFolder, FaRegImage } from 'react-icons/fa';

const Infor3 = () => {
    const dispatch = useDispatch<AppDispatch>();

    return (
        <div className={style.parent}>
            <div className={style.infor31}>
                <div>
                    <div>
                        <FaFolder />
                    </div>
                </div>
                <div>Hình ảnh và thước phim</div>
                <div>0 Hình ảnh . 0 Thước phim</div>
            </div>
            <div className={style.infor32}>
                <div>
                    <div>hinh anh</div>
                </div>
                <div>
                    <div>thuoc phim</div>
                </div>
            </div>
        </div>
    );
};

export default memo(Infor3);
