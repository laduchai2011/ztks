import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { Message_V1_Field } from '@src/data_struct/message_v1';
import { Zalo_Message_Type, Message_Text_Field } from '@src/data_struct/zalo/hook_data';
import { parseTextToParts } from '@src/utility/string';
import RepliedMsg from '../RepliedMsg';
import { useLazy_get_Message_With_Msg_Id_Query } from '@src/redux/query/message_v1_RTK';

const MsgText: FC<{ data: Message_V1_Field<Message_Text_Field> }> = ({ data }) => {
    const text = data.message.text;
    const parts = parseTextToParts(text || '');

    const [replied_msg, set__replied_msg] = useState<Message_V1_Field<Zalo_Message_Type> | undefined>(undefined);

    const [get_Message_With_Msg_Id] = useLazy_get_Message_With_Msg_Id_Query();

    useEffect(() => {
        const quote_msg_id = data.message.quote_msg_id;
        if (!quote_msg_id) return;
        get_Message_With_Msg_Id({ chat_room_id: data.chat_room_id, msg_id: quote_msg_id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__replied_msg(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [get_Message_With_Msg_Id, data]);

    return (
        <pre className={style.parent}>
            {replied_msg && <RepliedMsg data={replied_msg} />}
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
