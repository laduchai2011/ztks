import { FC, memo } from 'react';
import style from './style.module.scss';
import LazyImage from '@src/component/LazyImage';
import { MessageV1Field } from '@src/dataStruct/message_v1';
import { MessageLinkField } from '@src/dataStruct/zalo/hookData';

const MsgLink: FC<{ data?: MessageV1Field<MessageLinkField> }> = ({ data }) => {
    if (!data) return;

    const text = data.message.text;
    const thumbnail = data.message.attachments[0].payload.thumbnail;
    const title = data.message.attachments[0].payload.title;
    const description = data.message.attachments[0].payload.description;
    const url = data.message.attachments[0].payload.url;

    const handleOpenLink = () => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <pre className={style.parent} onClick={() => handleOpenLink()}>
            <div>{text}</div>
            <LazyImage className={style.image} src={thumbnail} alt="img" />
            <div>
                <strong>{title}</strong>
            </div>
            <div>{description}</div>
        </pre>
    );
};

export default memo(MsgLink);
