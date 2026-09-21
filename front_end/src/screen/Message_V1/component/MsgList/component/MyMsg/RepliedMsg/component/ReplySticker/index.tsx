import { FC, memo } from 'react';
import style from './style.module.scss';
import { MessageV1Field } from '@src/dataStruct/message_v1';
import { MessageStickerField } from '@src/dataStruct/zalo/hookData';
import LazyImage from '@src/component/LazyImage';
import { STICKER } from '@src/const/text';

const ReplySticker: FC<{ data: MessageV1Field<MessageStickerField> }> = ({ data }) => {
    const url = data.message.attachments[0].payload.url;

    return (
        <div className={style.parent}>
            <LazyImage className={style.image} src={url} alt="img" />
            <div>{STICKER}</div>
        </div>
    );
};

export default memo(ReplySticker);
