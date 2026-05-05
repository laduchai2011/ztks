import { memo, FC, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { CiEdit } from 'react-icons/ci';
import { PostField, PostTypeEnum } from '@src/dataStruct/post';
import { BASE_URL_API } from '@src/const/api/baseUrl';
import { setIsShow_editPostDialog, setPost_editPostDialog, setNewPost_editPostDialog } from '@src/redux/slice/Post';
import { handleSrcImage } from '@src/utility/string';

const OnePost: FC<{ data: PostField }> = ({ data }) => {
    const dispatch = useDispatch<AppDispatch>();

    const newPost: PostField | undefined = useSelector((state: RootState) => state.PostSlice.editPostDialog.newPost);

    const [post1, setPost1] = useState<PostField>(data);
    const [imageIndex, setImageIndex] = useState<number>(0);
    const [images, setImages] = useState<string[]>([]);

    useEffect(() => {
        const imageArr = JSON.parse(post1.images) as string[];
        setImages(imageArr);
    }, [post1]);

    useEffect(() => {
        if (!newPost) return;

        if (newPost.id === post1.id) {
            setPost1(newPost);
            dispatch(setNewPost_editPostDialog(undefined));
        }
    }, [dispatch, newPost, post1]);

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

        switch (post1.type) {
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

    const handleOpenEdit = () => {
        dispatch(setIsShow_editPostDialog(true));
        dispatch(setPost_editPostDialog(post1));
    };

    return (
        <div className={style.parent}>
            <div className={style.header}>
                <div>{post1.name}</div>
                <div>{handleTypeToDisplay()}</div>
                <div>{post1.index}</div>
            </div>
            <div className={style.title}>
                <div>{post1.title}</div>
            </div>
            <div className={style.describe}>
                <div dangerouslySetInnerHTML={{ __html: post1.describe }} />
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
                <CiEdit onClick={() => handleOpenEdit()} size={20} color="green" />
            </div>
        </div>
    );
};

export default memo(OnePost);
