import { FC, memo } from 'react';
import style from './style.module.scss';
import LazyImage from '@src/component/LazyImage';
import { Message_V1_Field } from '@src/data_struct/message_v1';
import { Message_Link_Field } from '@src/data_struct/zalo/hook_data';

const MsgLink: FC<{ data?: Message_V1_Field<Message_Link_Field> }> = ({ data }) => {
    if (!data) return;

    const text = data.message.text;
    const thumbnail = data.message.attachments[0].payload.thumbnail;
    const title = data.message.attachments[0].payload.title;
    const description = data.message.attachments[0].payload.description;
    const url = data.message.attachments[0].payload.url;

    const handle_Open_Link = () => {
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    return (
        <pre className={style.parent} onClick={() => handle_Open_Link()}>
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
