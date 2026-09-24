import { memo, FC } from 'react';
import style from './style.module.scss';
import { IoIosCloseCircle } from 'react-icons/io';
import { BASE_URL_API } from '@src/const/api/base_url';

const OneImageUrl: FC<{ file_name: string; index: number; handle_Close_Image: (index: number) => void }> = ({
    file_name,
    index,
    handle_Close_Image,
}) => {
    const handle_Src_Image = () => {
        const url = `${BASE_URL_API}/service__image_v1/query/image/${file_name}`;
        return url;
    };

    const handle_Close = () => {
        handle_Close_Image(index);
    };

    return (
        <div className={style.parent}>
            <img src={handle_Src_Image()} alt="image" />
            <IoIosCloseCircle onClick={() => handle_Close()} color="white" />
        </div>
    );
};

export default memo(OneImageUrl);
