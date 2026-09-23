import { FC, memo } from 'react';
import style from './style.module.scss';
import { Message_Video_Field } from '@src/data_struct/zalo/hook_data';
import { Message_V1_Field } from '@src/data_struct/message_v1';
import LazyVideo from '@src/component/LazyVideo';

const MsgVideo: FC<{ msgList_element?: HTMLDivElement | null; data?: Message_V1_Field<Message_Video_Field> }> = ({
    msgList_element,
    data,
}) => {
    const url = data?.message.attachments[0].payload.url;
    return (
        <div className={style.parent}>
            {url && <LazyVideo className={style.video} src={url} root={msgList_element} />}
        </div>
    );
};

export default memo(MsgVideo);
