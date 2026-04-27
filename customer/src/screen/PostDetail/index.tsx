import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { PostField } from '@src/dataStruct/post';
import { BASE_URL_API } from '@src/const/api/baseUrl';
import { useLazyGetPostWithIdQuery } from '@src/redux/query/postRTK';

const PostDetail = () => {
    const { id } = useParams<{ id: string }>();

    const [post, setPost] = useState<PostField | undefined>(undefined);
    const [imageIndex, setImageIndex] = useState<number>(0);
    const [images, setImages] = useState<string[]>([]);

    const [getPostWithId] = useLazyGetPostWithIdQuery();

    useEffect(() => {
        if (!post) return;
        setImages(JSON.parse(post.images));
        return () => {
            setImages([]);
        };
    }, [post]);

    useEffect(() => {
        if (!id) return;
        getPostWithId({ id: Number(id) })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setPost(resData.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [getPostWithId, id]);

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

    return (
        <div className={style.parent}>
            <div className={style.main}>
                <div className={style.title}>
                    <div>{post?.title}</div>
                </div>
                <div className={style.describe}>
                    <div dangerouslySetInnerHTML={{ __html: post?.describe ?? '' }} />
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
                    <div></div>
                </div>
            </div>
        </div>
    );
};

export default memo(PostDetail);
