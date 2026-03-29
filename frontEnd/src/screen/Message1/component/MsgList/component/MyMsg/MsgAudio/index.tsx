import { FC, memo } from 'react';
import { MessageAudioField } from '@src/dataStruct/zalo/hookData';
import { MessageV1Field } from '@src/dataStruct/message_v1';

const MsgAudio: FC<{ data?: MessageV1Field<MessageAudioField> }> = () => {
    return <div>MsgAudio</div>;
};

export default memo(MsgAudio);
