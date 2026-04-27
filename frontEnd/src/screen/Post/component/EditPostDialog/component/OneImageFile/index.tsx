import { memo, FC, useEffect, useState } from 'react';
import style from './style.module.scss';
import { IoIosCloseCircle } from 'react-icons/io';

const OneImageFile: FC<{ file: File; index: number; handleCloseImage: (index: number) => void }> = ({
    file,
    index,
    handleCloseImage,
}) => {
    const [preView, setPreView] = useState<string>('');

    useEffect(() => {
        const _preView = URL.createObjectURL(file);
        setPreView(_preView);

        return () => {
            URL.revokeObjectURL(_preView);
            setPreView('');
        };
    }, [file]);

    const handleClose = () => {
        handleCloseImage(index);
    };

    return (
        <div className={style.parent}>
            {preView.length > 0 && <img src={preView} alt="image" />}
            <IoIosCloseCircle onClick={() => handleClose()} color="white" />
        </div>
    );
};

export default memo(OneImageFile);
