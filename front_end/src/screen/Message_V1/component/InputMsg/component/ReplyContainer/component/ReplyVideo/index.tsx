import { FC, memo } from 'react';
import style from './style.module.scss';
import { Message_V1_Field } from '@src/data_struct/message_v1';
import { Message_Video_Field } from '@src/data_struct/zalo/hook_data';
import { VIDEO } from '@src/const/text';

const ReplyVideo: FC<{ data: Message_V1_Field<Message_Video_Field> }> = ({ data }) => {
    const url = data.message.attachments[0].payload.url;

    return (
        <div className={style.parent}>
            <video className={style.video} src={url} />
            <div>{VIDEO}</div>
        </div>
    );
};

export default memo(ReplyVideo);
