import { FC, memo } from 'react';
import style from './style.module.scss';
import LazyImage from '@src/component/LazyImage';
import { MessageStickerField } from '@src/dataStruct/zalo/hookData';
import { MessageV1Field } from '@src/dataStruct/message_v1';

const MsgSticker: FC<{ data?: MessageV1Field<MessageStickerField> }> = ({ data }) => {
    const url = data?.message.attachments[0].payload.url;

    return <div className={style.parent}>{url && <LazyImage className={style.image} src={url} alt="img" />}</div>;
};

export default memo(MsgSticker);
