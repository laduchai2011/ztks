import { memo, useEffect, useId, useRef, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { IoMdCloseCircle, IoMdAdd } from 'react-icons/io';

const Infor2 = () => {
    const dispatch = useDispatch<AppDispatch>();

    const id_image_input = useId();
    const imageInput_element = useRef<HTMLInputElement | null>(null);
    const [images, set__images] = useState<File[]>([]);
    const [new_images, set__new_images] = useState<File[]>([]);
    const [deleted_image, set__deleted_image] = useState<File | undefined>(undefined);
    const [image_previews, set__image_previews] = useState<string[]>([]);

    const id_video_input = useId();
    const videoInput_element = useRef<HTMLInputElement | null>(null);
    const [videos, set__videos] = useState<File[]>([]);
    const [new_videos, set__new_videos] = useState<File[]>([]);
    const [deleted_video, set__deleted_video] = useState<File | undefined>(undefined);
    const [video_previews, set__video_previews] = useState<string[]>([]);

    useEffect(() => {
        if (!new_images) return;
        const previews: string[] = [];
        for (let i: number = 0; i < new_images.length; i++) {
            const object_url = URL.createObjectURL(new_images[i]);
            previews.push(object_url);
        }
        set__image_previews((prev) => [...prev, ...previews]);
        set__images((prev) => [...prev, ...new_images]);
    }, [new_images]);
    useEffect(() => {
        if (!deleted_image) return;
        const deleted_index = images.indexOf(deleted_image);
        set__images((prev) => prev.filter((_, i) => i !== deleted_index));
        set__image_previews((prev) => prev.filter((_, i) => i !== deleted_index));
        set__deleted_image(undefined);
    }, [deleted_image, images]);
    const handle_Click_Image = () => {
        imageInput_element.current?.click();
    };
    const handle_Image_Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);

        if (files.length === 0) return;

        // Kiểm tra tất cả file đều là hình ảnh
        const invalidFile = files.some((file) => !file.type.startsWith('image/'));

        if (invalidFile) {
            dispatch(
                global_set__data__toast_message({
                    type: messageType_enum.WARN,
                    message: 'Vui lòng chỉ chọn file hình ảnh !',
                })
            );
            event.target.value = '';
            return;
        }
        set__new_images(files);
    };

    useEffect(() => {
        if (!new_videos) return;
        const previews: string[] = [];
        for (let i: number = 0; i < new_videos.length; i++) {
            const object_url = URL.createObjectURL(new_videos[i]);
            previews.push(object_url);
        }
        set__video_previews((prev) => [...prev, ...previews]);
        set__videos((prev) => [...prev, ...new_videos]);
    }, [new_videos]);
    useEffect(() => {
        if (!deleted_video) return;
        const deleted_index = videos.indexOf(deleted_video);
        set__videos((prev) => prev.filter((_, i) => i !== deleted_index));
        set__video_previews((prev) => prev.filter((_, i) => i !== deleted_index));
        set__deleted_video(undefined);
    }, [deleted_video, videos]);
    const handle_Click_Video = () => {
        videoInput_element.current?.click();
    };
    const handle_Video_Change = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(event.target.files ?? []);

        if (files.length === 0) return;

        // Kiểm tra tất cả file đều là thước phim
        const invalidFile = files.some((file) => !file.type.startsWith('video/'));

        if (invalidFile) {
            dispatch(
                global_set__data__toast_message({
                    type: messageType_enum.WARN,
                    message: 'Vui lòng chỉ chọn file thước phim !',
                })
            );
            event.target.value = '';
            return;
        }
        set__new_videos(files);
    };

    const list_mage = image_previews.map((item, index) => {
        return (
            <div key={index}>
                <img src={item} alt="" />
                <IoMdCloseCircle onClick={() => set__deleted_image(images[index])} />
            </div>
        );
    });

    const list_video = video_previews.map((item, index) => {
        return (
            <div key={index}>
                <video src={item} controls />
                <IoMdCloseCircle onClick={() => set__deleted_video(videos[index])} />
            </div>
        );
    });

    return (
        <div className={style.parent}>
            <div className={style.header}>
                <div />
                <div>Hình ảnh và thước phim</div>
            </div>
            <div className={style.detail}>
                <div>
                    <div>
                        <div>Thêm hình ảnh</div>
                        <div>
                            {list_mage}
                            <div id={id_image_input} onClick={handle_Click_Image}>
                                <IoMdAdd size={25} />
                                <input
                                    ref={imageInput_element}
                                    onChange={handle_Image_Change}
                                    type="file"
                                    id={id_image_input}
                                    accept="image/*"
                                    multiple
                                />
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>Thêm thước phim</div>
                        <div>
                            {list_video}
                            <div id={id_video_input} onClick={handle_Click_Video}>
                                <IoMdAdd size={25} />
                                <input
                                    ref={videoInput_element}
                                    onChange={handle_Video_Change}
                                    type="file"
                                    id={id_video_input}
                                    accept="video/*"
                                    multiple
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Infor2);
