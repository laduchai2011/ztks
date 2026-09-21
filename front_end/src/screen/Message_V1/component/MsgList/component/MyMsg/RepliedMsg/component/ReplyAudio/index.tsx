import { FC, memo } from 'react';
import style from './style.module.scss';
import { MessageV1Field } from '@src/dataStruct/message_v1';
import { MessageAudioField } from '@src/dataStruct/zalo/hookData';
import { AUDIO } from '@src/const/text';
import { LuAudioLines } from 'react-icons/lu';

const ReplyAudio: FC<{ data: MessageV1Field<MessageAudioField> }> = ({ data }) => {
    const url = data.message.attachments[0].payload.url;

    return (
        <div className={style.parent}>
            <LuAudioLines />
            <div>{AUDIO}</div>
            <audio controls src={url} />
        </div>
    );
};

export default memo(ReplyAudio);
