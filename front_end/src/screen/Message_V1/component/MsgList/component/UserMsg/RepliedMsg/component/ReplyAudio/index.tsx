import { FC, memo } from 'react';
import style from './style.module.scss';
import { Message_V1_Field } from '@src/data_struct/message_v1';
import { Message_Audio_Field } from '@src/data_struct/zalo/hook_data';
import { AUDIO } from '@src/const/text';
import { LuAudioLines } from 'react-icons/lu';

const ReplyAudio: FC<{ data: Message_V1_Field<Message_Audio_Field> }> = ({ data }) => {
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
