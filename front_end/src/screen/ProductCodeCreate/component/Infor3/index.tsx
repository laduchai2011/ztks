import { memo, useEffect, useId, useRef, useState } from 'react';
import style from './style.module.scss';
// import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { global_set__data__toast_message, global_set__is_loading } from '@src/redux/slice/Global';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { IoMdCloseCircle, IoMdAdd } from 'react-icons/io';
import {
    set__upload_images,
    set__is_upload_images,
    set__upload_videos,
    set__is_upload_videos,
} from '@src/redux/slice/Product_Code_Create';
import { upload_Image } from '@src/upload/upload_Image';
import { upload_Video, generate_Video_Thumbnail } from '@src/upload/upload_video';
import { Account_Field } from '@src/data_struct/account';
import { Image_Field, Video_Field } from '@src/data_struct/product';
import { BASE_URL_API } from '@src/const/api/base_url';

const Infor3 = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const create_status: 'begin' | 'doing' | 'end' = useSelector(
        (state: RootState) => state.Product_Code_Create_Slice.create_status
    );

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

    useEffect(() => {
        if (!account) return;
        const upload_images = async () => {
            if (create_status === 'begin') {
                dispatch(global_set__is_loading(true));
                try {
                    let is_upload_images_success: boolean = false;
                    const image_urls: Image_Field[] = [];

                    for (let i = 0; i < images.length; i++) {
                        const res_data_image = await upload_Image(images[i], account.id);
                        if (!res_data_image) {
                            dispatch(
                                global_set__data__toast_message({
                                    type: messageType_enum.ERROR,
                                    message: 'Đăng tải hình ảnh thất bại !',
                                })
                            );
                            is_upload_images_success = false;
                            break;
                        } else {
                            is_upload_images_success = true;
                            image_urls.push({ url: res_data_image.file_name });
                        }
                    }

                    if (is_upload_images_success) {
                        dispatch(set__upload_images({ urls: image_urls }));
                        dispatch(set__is_upload_images(true));
                    }
                } catch (error) {
                    console.error('Error uploading images:', error);
                    dispatch(
                        global_set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Đã có lỗi xảy ra !',
                        })
                    );
                } finally {
                    dispatch(global_set__is_loading(false));
                }
            }
        };
        const upload_videos = async () => {
            if (create_status === 'begin') {
                dispatch(global_set__is_loading(true));
                try {
                    let is_upload_videos_success: boolean = false;
                    const video_urls: Video_Field[] = [];

                    for (let i = 0; i < videos.length; i++) {
                        const res_data_video = await upload_Video(videos[i], account.id);
                        if (!res_data_video) {
                            dispatch(
                                global_set__data__toast_message({
                                    type: messageType_enum.ERROR,
                                    message: 'Đăng tải video thất bại !',
                                })
                            );
                            is_upload_videos_success = false;
                            break;
                        } else {
                            is_upload_videos_success = true;

                            const video_name: string = res_data_video.file_name as string;
                            const videoUrl = `${BASE_URL_API}/service__video_v1/query/video/${res_data_video.file_name}`;

                            // 1. Tạo thumbnail từ video
                            const blob = await generate_Video_Thumbnail(videoUrl, 0.5);

                            // 2. Chuyển Blob thành File
                            const id = crypto.randomUUID();
                            const file = new File([blob], `thumbnail_${id}.jpg`, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });

                            // 3. Upload lên server bằng hàm có sẵn
                            const res_data_image = await upload_Image(file, account.id);
                            if (!res_data_image) {
                                dispatch(
                                    global_set__data__toast_message({
                                        type: messageType_enum.ERROR,
                                        message: 'Đăng tải hình ảnh thất bại !',
                                    })
                                );
                                is_upload_videos_success = false;
                                break;
                            } else {
                                const thumbnail_name: string = res_data_image.file_name as string;
                                video_urls.push({
                                    url: video_name,
                                    thumbnail: thumbnail_name,
                                });
                            }
                        }
                    }

                    if (is_upload_videos_success) {
                        dispatch(set__upload_videos({ urls: video_urls }));
                        dispatch(set__is_upload_videos(true));
                    }
                } catch (error) {
                    console.error('Error uploading videos:', error);
                    dispatch(
                        global_set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Đã có lỗi xảy ra !',
                        })
                    );
                } finally {
                    dispatch(global_set__is_loading(false));
                }
            }
        };
        upload_images();
        upload_videos();
    }, [create_status, dispatch, account, images, videos]);

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

export default memo(Infor3);
