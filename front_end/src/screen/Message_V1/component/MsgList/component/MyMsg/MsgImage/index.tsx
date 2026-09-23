import { FC, memo } from 'react';
import style from './style.module.scss';
import { Message_Image_Field, Message_Multi_Image_Field } from '@src/data_struct/zalo/hook_data';
import { Message_V1_Field } from '@src/data_struct/message_v1';
import LazyImage from '@src/component/LazyImage';

const MsgImage: FC<{ data?: Message_V1_Field<Message_Image_Field | Message_Multi_Image_Field> }> = ({ data }) => {
    const url = data?.message.attachments[0].payload.url;

    const handle_See_Image = () => {
        window.open(url, '_blank');
    };

    return (
        <div className={style.parent} onClick={() => handle_See_Image()}>
            {url && <LazyImage className={style.image} src={url} alt="img" />}
        </div>
    );
};

export default memo(MsgImage);
