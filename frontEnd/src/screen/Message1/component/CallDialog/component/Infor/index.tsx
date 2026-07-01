import { FC, memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { TiTick } from 'react-icons/ti';
import { IoClose } from 'react-icons/io5';

const Infor: FC<{ setIsRequestConsent: React.Dispatch<React.SetStateAction<boolean>> }> = ({ setIsRequestConsent }) => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const handleOpenRequestConsent = () => {
        setIsRequestConsent(true);
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.consents}>
                <div>
                    <div>
                        <div>
                            <div>Audio</div>
                            <div>Time</div>
                        </div>
                        <IoClose size={20} color="red" />
                    </div>
                    <div>
                        <div>
                            <div>Audio and video</div>
                            <div>Time</div>
                        </div>

                        <IoClose size={20} color="red" />
                    </div>
                </div>
            </div>
            <div className={style.requestContent}>
                <div onClick={() => handleOpenRequestConsent()}>Gửi yêu cầu cấp quyền gọi</div>
            </div>
        </div>
    );
};

export default memo(Infor);
