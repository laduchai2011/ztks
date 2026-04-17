import { FC, memo } from 'react';
import style from './style.module.scss';
import ReplyText from './component/ReplyText';
import ReplyImage from './component/ReplyImage';
import ReplyVideo from './component/ReplyVideo';
import ReplyAudio from './component/ReplyAudio';
import ReplySticker from './component/ReplySticker';
import { Zalo_Event_Name_Enum } from '@src/dataStruct/zalo/hookData/common';
import { MessageV1Field } from '@src/dataStruct/message_v1';
import {
    ZaloMessageType,
    MessageTextField,
    MessageImageField,
    MessageMultiImageField,
    MessageVideoField,
    MessageAudioField,
    MessageStickerField,
} from '@src/dataStruct/zalo/hookData';

const RepliedMsg: FC<{ data: MessageV1Field<ZaloMessageType> }> = ({ data }) => {
    const ReplyMsg = () => {
        const event_name = data.event_name;

        switch (event_name) {
            case Zalo_Event_Name_Enum.oa_send_text: {
                const data_t = data as MessageV1Field<MessageTextField>;
                return <ReplyText data={data_t} />;
            }
            case Zalo_Event_Name_Enum.user_send_text: {
                const data_t = data as MessageV1Field<MessageTextField>;
                return <ReplyText data={data_t} />;
            }
            case Zalo_Event_Name_Enum.oa_send_image: {
                const data_t = data as MessageV1Field<MessageImageField | MessageMultiImageField>;
                return <ReplyImage data={data_t} />;
            }
            case Zalo_Event_Name_Enum.user_send_image: {
                const data_t = data as MessageV1Field<MessageImageField | MessageMultiImageField>;
                return <ReplyImage data={data_t} />;
            }
            case Zalo_Event_Name_Enum.oa_send_video: {
                const data_t = data as MessageV1Field<MessageVideoField>;
                return <ReplyVideo data={data_t} />;
            }
            case Zalo_Event_Name_Enum.user_send_video: {
                const data_t = data as MessageV1Field<MessageVideoField>;
                return <ReplyVideo data={data_t} />;
            }
            case Zalo_Event_Name_Enum.oa_send_audio: {
                const data_t = data as MessageV1Field<MessageAudioField>;
                return <ReplyAudio data={data_t} />;
            }
            case Zalo_Event_Name_Enum.user_send_audio: {
                const data_t = data as MessageV1Field<MessageAudioField>;
                return <ReplyAudio data={data_t} />;
            }
            // case Zalo_Event_Name_Enum.oa_send_file: {
            //     const data_t = data as MessageV1Field<MessageFileField>;

            // }
            // case Zalo_Event_Name_Enum.oa_send_sticker: {
            //     const data_t = data as MessageV1Field<MessageStickerField>;

            // }
            case Zalo_Event_Name_Enum.user_send_sticker: {
                const data_t = data as MessageV1Field<MessageStickerField>;
                return <ReplySticker data={data_t} />;
            }
            default: {
                return;
            }
        }
    };

    const handleScrollToMsg = () => {
        console.log('handleScrollToMsg');
    };

    return (
        <div className={style.parent} onClick={() => handleScrollToMsg()}>
            <div />
            <div>
                <div>Trả lời</div>
                <div>{ReplyMsg()}</div>
            </div>
        </div>
    );
};

export default memo(RepliedMsg);
