import { Product_Field } from '@src/data_struct/product';
import { Image_Field } from '@src/data_struct/image';
import { Video_Field } from '@src/data_struct/video';

export interface state_props {
    product?: Product_Field;

    is_show_image: boolean;
    showed_images: Image_Field[];

    is_show_video: boolean;
    showed_videos: Video_Field[];
}
