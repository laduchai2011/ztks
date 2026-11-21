import { Image_Field } from '@src/data_struct/image';
import { Video_Field } from '@src/data_struct/video';

export interface state_props {
    create_status: 'begin' | 'end';

    is_basic_infor: boolean;
    is_detail_infor: boolean;
    is_upload_images: boolean;
    is_upload_videos: boolean;

    basic_infor: {
        name: string;
        description: string;
    };
    detail_infor: {
        detail: string;
    };
    upload_images: {
        urls: Image_Field[];
    };
    upload_videos: {
        urls: Video_Field[];
    };
}
