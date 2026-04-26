import { memo, FC, useState, useEffect } from 'react';
import style from './style.module.scss';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { CiEdit } from 'react-icons/ci';
import { PostField, PostTypeEnum } from '@src/dataStruct/post';
import { BASE_URL_API } from '@src/const/api/baseUrl';

const OnePost: FC<{ data: PostField }> = ({ data }) => {
    const [post, setPost] = useState<PostField>(data);
    const [imageIndex, setImageIndex] = useState<number>(0);
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        const imageArr = JSON.parse(post.images) as string[];
        setImages(imageArr);
    }, [post]);

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

    const handleTypeToDisplay = () => {
        let text: string = '';

        switch (post.type) {
            case PostTypeEnum.FREE: {
                text = 'Miễn phí';
                break;
            }
            case PostTypeEnum.UPGRADE: {
                text = 'Nâng cấp';
                break;
            }
            default: {
                text = 'Miễn phí';
                break;
            }
        }

        return text;
    };

    const handleSrcImage = (fileName: string) => {
        const url = `${BASE_URL_API}/service_image_v1/query/image/${fileName}`;
        return url;
    };

    return (
        <div className={style.parent}>
            <div className={style.header}>
                <div>{data.name}</div>
                <div>{handleTypeToDisplay()}</div>
                <div>{data.index}</div>
            </div>
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
            <div className={style.icons}>
                <CiEdit size={20} color="green" />
            </div>
        </div>
    );
};

export default memo(OnePost);
