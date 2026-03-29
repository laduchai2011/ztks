import { FC, memo } from 'react';
import style from './style.module.scss';
import { MessageVideoField } from '@src/dataStruct/zalo/hookData';
import { MessageV1Field } from '@src/dataStruct/message_v1';
import LazyVideo from '@src/component/LazyVideo';

const MsgVideo: FC<{ msgList_element?: HTMLDivElement | null; data?: MessageV1Field<MessageVideoField> }> = ({
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
