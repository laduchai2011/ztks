import { memo, FC, useEffect, useState } from 'react';
import style from './style.module.scss';
import { IoIosCloseCircle } from 'react-icons/io';

const OneImage: FC<{ file: File; index: number; handle_Close_Image: (index: number) => void }> = ({
    file,
    index,
    handle_Close_Image,
}) => {
    const [pre_view, set__pre_view] = useState<string>('');

    useEffect(() => {
        const _preView = URL.createObjectURL(file);
        set__pre_view(_preView);

        return () => {
            URL.revokeObjectURL(_preView);
            set__pre_view('');
        };
    }, [file]);

    const handle_Close = () => {
        handle_Close_Image(index);
    };

    return (
        <div className={style.parent}>
            {pre_view.length > 0 && <img src={pre_view} alt="image" />}
            <IoIosCloseCircle onClick={() => handle_Close()} color="white" />
        </div>
    );
};

export default memo(OneImage);
