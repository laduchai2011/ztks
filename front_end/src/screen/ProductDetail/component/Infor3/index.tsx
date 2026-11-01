import { memo, useRef, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { GiNotebook } from 'react-icons/gi';

const Infor2 = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [image, set__image] = useState<string[]>([]);
    const [video, set__video] = useState<string[]>([]);

    return (
        <div className={style.parent}>
            <div className={style.infor31}>
                <div>
                    <div>
                        <GiNotebook />
                    </div>
                </div>
                <div>Thông tin chi tiết</div>
            </div>
            <div className={style.infor32}>
                <div>sdfsdujfgdsjgf</div>
            </div>
        </div>
    );
};

export default memo(Infor2);
