import { FC, memo } from 'react';
import style from './style.module.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import ReplyText from './component/ReplyText';
import ReplyImage from './component/ReplyImage';
import ReplyVideo from './component/ReplyVideo';
import ReplyAudio from './component/ReplyAudio';
import ReplySticker from './component/ReplySticker';
import { Zalo_Event_Name_Enum } from '@src/data_struct/zalo/hook_data/common';
import { Message_V1_Field } from '@src/data_struct/message_v1';
import {
    Zalo_Message_Type,
    Message_Text_Field,
    Message_Image_Field,
    Message_Multi_Image_Field,
    Message_Video_Field,
    Message_Audio_Field,
    Message_Sticker_Field,
} from '@src/data_struct/zalo/hook_data';
import { set__replied_message } from '@src/redux/slice/Message_V1';

const ReplyContainer: FC<{ data: Message_V1_Field<Zalo_Message_Type> }> = ({ data }) => {
    const dispatch = useDispatch<AppDispatch>();

    // console.log('ReplyContainer', data);

    const reply_Msg = () => {
        const event_name = data.event_name;

        switch (event_name) {
            case Zalo_Event_Name_Enum.oa_send_text: {
                const data_t = data as Message_V1_Field<Message_Text_Field>;
                return <ReplyText data={data_t} />;
            }
            case Zalo_Event_Name_Enum.user_send_text: {
                const data_t = data as Message_V1_Field<Message_Text_Field>;
                return <ReplyText data={data_t} />;
            }
            case Zalo_Event_Name_Enum.oa_send_image: {
                const data_t = data as Message_V1_Field<Message_Image_Field | Message_Multi_Image_Field>;
                return <ReplyImage data={data_t} />;
            }
            case Zalo_Event_Name_Enum.user_send_image: {
                const data_t = data as Message_V1_Field<Message_Image_Field | Message_Multi_Image_Field>;
                return <ReplyImage data={data_t} />;
            }
            case Zalo_Event_Name_Enum.oa_send_video: {
                const data_t = data as Message_V1_Field<Message_Video_Field>;
                return <ReplyVideo data={data_t} />;
            }
            case Zalo_Event_Name_Enum.user_send_video: {
                const data_t = data as Message_V1_Field<Message_Video_Field>;
                return <ReplyVideo data={data_t} />;
            }
            case Zalo_Event_Name_Enum.oa_send_audio: {
                const data_t = data as Message_V1_Field<Message_Audio_Field>;
                return <ReplyAudio data={data_t} />;
            }
            case Zalo_Event_Name_Enum.user_send_audio: {
                const data_t = data as Message_V1_Field<Message_Audio_Field>;
                return <ReplyAudio data={data_t} />;
            }
            // case Zalo_Event_Name_Enum.oa_send_file: {
            //     const data_t = data as MessageV1Field<MessageFileField>;

            // }
            // case Zalo_Event_Name_Enum.oa_send_sticker: {
            //     const data_t = data as MessageV1Field<MessageStickerField>;

            // }
            case Zalo_Event_Name_Enum.user_send_sticker: {
                const data_t = data as Message_V1_Field<Message_Sticker_Field>;
                return <ReplySticker data={data_t} />;
            }
            default: {
                return;
            }
        }
    };

    const handle_Close_Reply = () => {
        dispatch(set__replied_message(undefined));
    };

    return (
        <div className={style.parent}>
            <div />
            <div>
                <div>Trả lời</div>
                <div>{reply_Msg()}</div>
            </div>
            <div>
                <IoMdClose onClick={() => handle_Close_Reply()} />
            </div>
        </div>
    );
};

export default memo(ReplyContainer);
