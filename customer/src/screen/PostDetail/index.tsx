import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { PostField, RegisterPostField } from '@src/dataStruct/post';
import { BASE_URL_API } from '@src/const/api/baseUrl';
import { useLazyGetPostWithIdQuery, useLazyGetRegisterPostWithIdQuery } from '@src/redux/query/postRTK';
import { useLazyGetZaloOaWithIdQuery } from '@src/redux/query/zaloRTK';
import { ZaloOaField } from '@src/dataStruct/zalo';

const PostDetail = () => {
    const { id } = useParams<{ id: string }>();

    const [registerPost, setRegisterPost] = useState<RegisterPostField | undefined>(undefined);
    const [post, setPost] = useState<PostField | undefined>(undefined);
    const [imageIndex, setImageIndex] = useState<number>(0);
    const [images, setImages] = useState<string[]>([]);
    const [zaloOa, setZaloOa] = useState<ZaloOaField | undefined>(undefined);

    const [getPostWithId] = useLazyGetPostWithIdQuery();
    const [getRegisterPostWithId] = useLazyGetRegisterPostWithIdQuery();
    const [getZaloOaWithId] = useLazyGetZaloOaWithIdQuery();

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

    useEffect(() => {
        if (!post) return;

        getRegisterPostWithId({ id: post.registerPostId })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setRegisterPost(resData.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [getRegisterPostWithId, post]);

    useEffect(() => {
        if (!registerPost) return;

        getZaloOaWithId({ id: registerPost.zaloOaId, accountId: registerPost.accountId })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setZaloOa(resData.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [getZaloOaWithId, registerPost]);

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
                    <div>
                        <a href={`https://zalo.me/${zaloOa?.oaId}`}>Chat với OA</a>
                    </div>
                    <div></div>
                </div>
            </div>
        </div>
    );
};

export default memo(PostDetail);
