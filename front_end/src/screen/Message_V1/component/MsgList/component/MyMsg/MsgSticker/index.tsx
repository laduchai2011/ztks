import { FC, memo } from 'react';
import style from './style.module.scss';
import LazyImage from '@src/component/LazyImage';
import { Message_Sticker_Field } from '@src/data_struct/zalo/hook_data';
import { Message_V1_Field } from '@src/data_struct/message_v1';

const MsgSticker: FC<{ data?: Message_V1_Field<Message_Sticker_Field> }> = ({ data }) => {
    const url = data?.message.attachments[0].payload.url;

    return <div className={style.parent}>{url && <LazyImage className={style.image} src={url} alt="img" />}</div>;
};

export default memo(MsgSticker);
