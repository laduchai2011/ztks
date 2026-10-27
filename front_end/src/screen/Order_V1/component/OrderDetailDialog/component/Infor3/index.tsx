import { memo, useRef, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { FaFolder, FaRegImage } from 'react-icons/fa';
import { GoVideo } from 'react-icons/go';

const Infor3 = () => {
    const dispatch = useDispatch<AppDispatch>();

    const [image, set__image] = useState<string[]>([]);
    const [video, set__video] = useState<string[]>([]);

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
                    {image.length === 0 && (
                        <div className={style.not_image}>
                            <div>
                                <div>
                                    <FaRegImage />
                                </div>
                                <div>Chưa có hình ảnh</div>
                                <div>Các hình ảnh hiển thị ở đây</div>
                            </div>
                        </div>
                    )}
                    {image.length > 0 && (
                        <div className={style.image}>
                            <img
                                src="http://localhost:4000/api/service__image_v1/query/image/1790368982012_01a0a0c9-cf8c-7aaf-8348-faec9e683cfd_133962880188383301.jpg"
                                alt=""
                            />
                            <div>
                                <div>Xem ảnh 1/3</div>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    {video.length === 0 && (
                        <div className={style.not_image}>
                            <div>
                                <div>
                                    <GoVideo />
                                </div>
                                <div>Chưa có thước phim</div>
                                <div>Các thước phim hiển thị ở đây</div>
                            </div>
                        </div>
                    )}
                    {video.length > 0 && (
                        <div className={style.image}>
                            <img
                                src="http://localhost:4000/api/service__image_v1/query/image/1790368982012_01a0a0c9-cf8c-7aaf-8348-faec9e683cfd_133962880188383301.jpg"
                                alt=""
                            />
                            <div>
                                <div>Xem thước phim 1/3</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(Infor3);
