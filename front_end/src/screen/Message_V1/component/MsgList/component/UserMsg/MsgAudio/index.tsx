import { FC, memo } from 'react';
import style from './style.module.scss';
import { MessageAudioField } from '@src/dataStruct/zalo/hookData';
import { MessageV1Field } from '@src/dataStruct/message_v1';

const MsgAudio: FC<{ data?: MessageV1Field<MessageAudioField> }> = ({ data }) => {
    const url = data?.message.attachments[0].payload.url;

    return (
        <div className={style.parent}>
            <audio controls src={url} />
        </div>
    );
};

export default memo(MsgAudio);
