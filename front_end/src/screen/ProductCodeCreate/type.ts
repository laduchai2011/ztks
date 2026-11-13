import { Image_Field, Video_Field } from '@src/data_struct/product';

export interface state_props {
    create_status: 'begin' | 'end';

    is_basic_info: boolean;
    is_detail_info: boolean;
    is_upload_images: boolean;
    is_upload_videos: boolean;

    basic_info: {
        name: string;
        description: string;
    };
    detail_info: {
        detail: string;
    };
    upload_images: {
        urls: Image_Field[];
    };
    upload_videos: {
        urls: Video_Field[];
    };
}
