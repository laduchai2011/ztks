import { FC, memo } from 'react';
import style from './style.module.scss';
import { Message_V1_Field } from '@src/data_struct/message_v1';
import { Message_Text_Field } from '@src/data_struct/zalo/hook_data';

const ReplyText: FC<{ data: Message_V1_Field<Message_Text_Field> }> = ({ data }) => {
    return (
        <div className={style.parent}>
            <div>{data.message.text}</div>
        </div>
    );
};

export default memo(ReplyText);
