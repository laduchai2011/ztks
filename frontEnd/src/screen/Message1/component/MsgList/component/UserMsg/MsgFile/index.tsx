import { FC, memo } from 'react';
import { MessageFileField } from '@src/dataStruct/zalo/hookData';
import { MessageV1Field } from '@src/dataStruct/message_v1';

const MsgFile: FC<{ data?: MessageV1Field<MessageFileField> }> = () => {
    return <div>MsgFile</div>;
};

export default memo(MsgFile);
