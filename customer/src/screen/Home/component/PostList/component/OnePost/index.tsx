import { memo, FC, useState, useEffect } from 'react';
import style from './style.module.scss';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { PostField } from '@src/dataStruct/post';
import { BASE_URL_API } from '@src/const/api/baseUrl';
import { DETAIL } from '@src/const/text';

const OnePost: FC<{ data: PostField }> = ({ data }) => {
    const [imageIndex, setImageIndex] = useState<number>(0);
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        setImages(JSON.parse(data.images));
        return () => {
            setImages([]);
        };
    }, [data]);

    const handleBackImage = () => {
        if (imageIndex > 0) {
            setImageIndex((prev) => prev - 1);
        }
    };

    const handleNextImage = () => {
        if (imageIndex < images.length - 1) {
            setImageIndex((prev) => prev + 1);
        }
    };

    const handleSrcImage = (fileName: string) => {
        const url = `${BASE_URL_API}/service_image_v1/query/image/${fileName}`;
        return url;
    };

    const handleDetail = () => {
        const url = `/post_detail/${data.id}`;
        window.open(url, '_blank');
    };

    return (
        <div className={style.parent}>
            <div className={style.title}>
                <div>{data.title}</div>
            </div>
            <div className={style.describe}>
                <div dangerouslySetInnerHTML={{ __html: data.describe }} />
            </div>
            {images.length > 0 && (
                <div className={style.images}>
                    <img src={handleSrcImage(images[imageIndex])} alt="" />
                    <div>
                        <FiChevronLeft onClick={() => handleBackImage()} />
                        <div>{`${imageIndex + 1} / ${images.length}`}</div>
                        <FiChevronRight onClick={() => handleNextImage()} />
                    </div>
                </div>
            )}
            <div className={style.detail}>
                <div>Nhắn tin zalo</div>
                <div onClick={() => handleDetail()}>{DETAIL}</div>
            </div>
        </div>
    );
};

export default memo(OnePost);
