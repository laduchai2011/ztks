import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { MessageV1Field } from '@src/dataStruct/message_v1';
import { ZaloMessageType, MessageTextField } from '@src/dataStruct/zalo/hookData';
import { parseTextToParts } from '@src/utility/string';
import RepliedMsg from '../RepliedMsg';
import { useLazyGetMessageWithMsgIdQuery } from '@src/redux/query/messageV1RTK';

const MsgText: FC<{ data: MessageV1Field<MessageTextField> }> = ({ data }) => {
    const text = data.message.text;
    const parts = parseTextToParts(text || '');

    const [repliedMsg, setRepliedMsg] = useState<MessageV1Field<ZaloMessageType> | undefined>(undefined);

    const [getMessageWithMsgId] = useLazyGetMessageWithMsgIdQuery();

    useEffect(() => {
        const quote_msg_id = data.message.quote_msg_id;
        if (!quote_msg_id) return;
        getMessageWithMsgId({ chat_room_id: data.chat_room_id, msg_id: quote_msg_id })
            .then((res) => {
                const resData = res.data;
                // console.log('getMessageWithMsgId', resData);
                if (resData?.isSuccess && resData.data) {
                    setRepliedMsg(resData.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [getMessageWithMsgId, data]);

    return (
        <pre className={style.parent}>
            {repliedMsg && <RepliedMsg data={repliedMsg} />}
            {parts.map((p, i) => {
                if (p.type === 'text') return <div key={i}>{p.value}</div>;

                return (
                    <a
                        key={i}
                        href={p.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                    >
                        {p.value}
                    </a>
                );
            })}
        </pre>
    );
};

export default memo(MsgText);
