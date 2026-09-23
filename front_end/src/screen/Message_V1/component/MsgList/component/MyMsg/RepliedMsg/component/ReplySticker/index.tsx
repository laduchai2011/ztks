import { FC, memo } from 'react';
import style from './style.module.scss';
import { Message_V1_Field } from '@src/data_struct/message_v1';
import { Message_Sticker_Field } from '@src/data_struct/zalo/hook_data';
import LazyImage from '@src/component/LazyImage';
import { STICKER } from '@src/const/text';

const ReplySticker: FC<{ data: Message_V1_Field<Message_Sticker_Field> }> = ({ data }) => {
    const url = data.message.attachments[0].payload.url;

    return (
        <div className={style.parent}>
            <LazyImage className={style.image} src={url} alt="img" />
            <div>{STICKER}</div>
        </div>
    );
};

export default memo(ReplySticker);
