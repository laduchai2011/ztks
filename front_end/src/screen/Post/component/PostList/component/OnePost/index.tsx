import { memo, FC, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { CiEdit } from 'react-icons/ci';
import { Post_Field, Post_Type_Enum } from '@src/data_struct/post';
import {
    set__is_show__edit_post_dialog,
    set__post__edit_post_dialog,
    set__new_post__edit_post_dialog,
} from '@src/redux/slice/Post';
import { handleSrcImage } from '@src/utility/string';

const OnePost: FC<{ data: Post_Field }> = ({ data }) => {
    const dispatch = useDispatch<AppDispatch>();

    const new_post: Post_Field | undefined = useSelector(
        (state: RootState) => state.Post_Slice.edit_post_dialog.new_post
    );

    const [post1, set__post1] = useState<Post_Field>(data);
    const [image_index, set__image_index] = useState<number>(0);
    const [images, set__images] = useState<string[]>([]);

    useEffect(() => {
        const image_arr = JSON.parse(post1.images) as string[];
        set__images(image_arr);
    }, [post1]);

    useEffect(() => {
        if (!new_post) return;

        if (new_post.id === post1.id) {
            set__post1(new_post);
            dispatch(set__new_post__edit_post_dialog(undefined));
        }
    }, [dispatch, new_post, post1]);

    const handle_Back_Image = () => {
        if (image_index > 0) {
            set__image_index((prev) => prev - 1);
        }
    };

    const handle_Next_Image = () => {
        if (image_index < images.length - 1) {
            set__image_index((prev) => prev + 1);
        }
    };

    const handle_Type_To_Display = () => {
        let text: string = '';

        switch (post1.type) {
            case Post_Type_Enum.FREE: {
                text = 'Miễn phí';
                break;
            }
            case Post_Type_Enum.UPGRADE: {
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

    const handle_Open_Edit = () => {
        dispatch(set__is_show__edit_post_dialog(true));
        dispatch(set__post__edit_post_dialog(post1));
    };

    return (
        <div className={style.parent}>
            <div className={style.header}>
                <div>{post1.name}</div>
                <div>{handle_Type_To_Display()}</div>
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
                    <img src={handleSrcImage(images[image_index])} alt="" />
                    <div>
                        <FiChevronLeft onClick={() => handle_Back_Image()} />
                        <div>{`${image_index + 1} / ${images.length}`}</div>
                        <FiChevronRight onClick={() => handle_Next_Image()} />
                    </div>
                </div>
            )}
            <div className={style.icons}>
                <CiEdit onClick={() => handle_Open_Edit()} size={20} color="green" />
            </div>
        </div>
    );
};

export default memo(OnePost);
