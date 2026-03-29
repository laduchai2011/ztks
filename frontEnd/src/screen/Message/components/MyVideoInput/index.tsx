import { memo, FC, useState, useEffect } from 'react';
import style from './style.module.scss';
import { TiDeleteOutline } from 'react-icons/ti';
import { CLOSE } from '@src/const/text';

const MyVideoInput: FC<{ index: number; data: File; onClose: () => void }> = ({ index, data, onClose }) => {
    const [src, setSrc] = useState<string>('');

    useEffect(() => {
        const _src = URL.createObjectURL(data);
        setSrc(_src);

        return () => {
            URL.revokeObjectURL(_src);
        };
    }, [data]);

    const handleClose = () => {
        onClose();
    };

    return (
        src.length > 0 && (
            <div className={style.parent}>
                <div className={style.index}>{index}</div>
                <TiDeleteOutline onClick={() => handleClose()} title={CLOSE} />
                <video src={src} muted controls />
            </div>
        )
    );
};

export default memo(MyVideoInput);
