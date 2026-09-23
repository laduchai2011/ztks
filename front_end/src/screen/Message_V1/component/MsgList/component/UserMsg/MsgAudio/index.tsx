import { FC, memo } from 'react';
import style from './style.module.scss';
import { Message_Audio_Field } from '@src/data_struct/zalo/hook_data';
import { Message_V1_Field } from '@src/data_struct/message_v1';

const MsgAudio: FC<{ data?: Message_V1_Field<Message_Audio_Field> }> = ({ data }) => {
    const url = data?.message.attachments[0].payload.url;

    return (
        <div className={style.parent}>
            <audio controls src={url} />
        </div>
    );
};

export default memo(MsgAudio);
