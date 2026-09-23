import { FC, memo } from 'react';
import { Message_Audio_Field } from '@src/data_struct/zalo/hook_data';
import { Message_V1_Field } from '@src/data_struct/message_v1';

const MsgAudio: FC<{ data?: Message_V1_Field<Message_Audio_Field> }> = () => {
    return <div>MsgAudio</div>;
};

export default memo(MsgAudio);
