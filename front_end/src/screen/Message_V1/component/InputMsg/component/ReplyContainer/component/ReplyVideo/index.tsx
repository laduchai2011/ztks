import { FC, memo } from 'react';
import style from './style.module.scss';
import { MessageV1Field } from '@src/dataStruct/message_v1';
import { MessageVideoField } from '@src/dataStruct/zalo/hookData';
import { VIDEO } from '@src/const/text';

const ReplyVideo: FC<{ data: MessageV1Field<MessageVideoField> }> = ({ data }) => {
    const url = data.message.attachments[0].payload.url;

    return (
        <div className={style.parent}>
            <video className={style.video} src={url} />
            <div>{VIDEO}</div>
        </div>
    );
};

export default memo(ReplyVideo);
