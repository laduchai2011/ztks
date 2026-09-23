import { FC, memo } from 'react';
import { Message_File_Field } from '@src/data_struct/zalo/hook_data';
import { Message_V1_Field } from '@src/data_struct/message_v1';

const MsgFile: FC<{ data?: Message_V1_Field<Message_File_Field> }> = () => {
    return <div>MsgFile</div>;
};

export default memo(MsgFile);
