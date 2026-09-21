import { FC, memo } from 'react';
import style from './style.module.scss';
import { MessageV1Field } from '@src/dataStruct/message_v1';
import { MessageImageField, MessageMultiImageField } from '@src/dataStruct/zalo/hookData';
import LazyImage from '@src/component/LazyImage';
import { IMAGE } from '@src/const/text';

const ReplyImage: FC<{ data: MessageV1Field<MessageImageField | MessageMultiImageField> }> = ({ data }) => {
    const url = data.message.attachments[0].payload.url;

    return (
        <div className={style.parent}>
            <LazyImage className={style.image} src={url} alt="img" />
            <div>{IMAGE}</div>
        </div>
    );
};

export default memo(ReplyImage);
