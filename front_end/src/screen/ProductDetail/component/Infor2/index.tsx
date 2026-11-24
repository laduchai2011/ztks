import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { FaFolder, FaRegImage } from 'react-icons/fa';
import { GoVideo } from 'react-icons/go';
import { Product_Field } from '@src/data_struct/product';
import { Image_Field } from '@src/data_struct/image';
import { Video_Field } from '@src/data_struct/video';
import { handleSrcImage } from '@src/utility/string';
import {
    set__is_show_image,
    set__showed_images,
    set__is_show_video,
    set__showed_videos,
} from '@src/redux/slice/Product_Detail';

const Infor2 = () => {
    const dispatch = useDispatch<AppDispatch>();

    const product: Product_Field | undefined = useSelector((state: RootState) => state.Product_Detail_Slice.product);

    const [images, set__images] = useState<Image_Field[]>([]);
    const [videos, set__videos] = useState<Video_Field[]>([]);

    useEffect(() => {
        if (!product) return;
        set__images(product.images);
        set__videos(product.videos);
    }, [product]);

    const show_Images = () => {
        dispatch(set__is_show_image(true));
        dispatch(set__showed_images(images));
    };

    const show_Videos = () => {
        dispatch(set__is_show_video(true));
        dispatch(set__showed_videos(videos));
    };

    return (
        <div className={style.parent}>
            <div className={style.infor21}>
                <div>
                    <div>
                        <FaFolder />
                    </div>
                </div>
                <div>Hình ảnh và thước phim</div>
                <div>0 Hình ảnh . 0 Thước phim</div>
            </div>
            <div className={style.infor22}>
                <div>
                    {images.length === 0 && (
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
                    {images.length > 0 && (
                        <div className={style.image}>
                            <img src={handleSrcImage(images[0].url)} alt="" />
                            <div>
                                <div onClick={() => show_Images()}>{`Xem ảnh 1/${images.length}`}</div>
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    {videos.length === 0 && (
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
                    {videos.length > 0 && (
                        <div className={style.video}>
                            <img src={handleSrcImage(videos[0].thumbnail)} alt="" />
                            <div>
                                <div onClick={() => show_Videos()}>{`Xem thước phim 1/${videos.length}`}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(Infor2);
