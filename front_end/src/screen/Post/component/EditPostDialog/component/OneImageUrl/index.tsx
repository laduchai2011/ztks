import { memo, FC } from 'react';
import style from './style.module.scss';
import { IoIosCloseCircle } from 'react-icons/io';
import { BASE_URL_API } from '@src/const/api/baseUrl';

const OneImageUrl: FC<{ fileName: string; index: number; handleCloseImage: (index: number) => void }> = ({
    fileName,
    index,
    handleCloseImage,
}) => {
    const handleSrcImage = () => {
        const url = `${BASE_URL_API}/service_image_v1/query/image/${fileName}`;
        return url;
    };

    const handleClose = () => {
        handleCloseImage(index);
    };

    return (
        <div className={style.parent}>
            <img src={handleSrcImage()} alt="image" />
            <IoIosCloseCircle onClick={() => handleClose()} color="white" />
        </div>
    );
};

export default memo(OneImageUrl);
