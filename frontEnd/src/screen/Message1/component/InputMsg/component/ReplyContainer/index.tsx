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
import { set_repliedMessage } from '@src/redux/slice/MessageV1';

const ReplyContainer: FC<{ data: MessageV1Field<ZaloMessageType> }> = ({ data }) => {
    const dispatch = useDispatch<AppDispatch>();

    // console.log('ReplyContainer', data);

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
            // case Zalo_Event_Name_Enum.oa_send_video: {
            //     const data_t = data as MessageV1Field<MessageVideoField>;
            //     return <ReplyVideo data={data_t} />;
            // }
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

    const handleCloseReply = () => {
        dispatch(set_repliedMessage(undefined));
    };

    return (
        <div className={style.parent}>
            <div />
            <div>
                <div>Trả lời</div>
                <div>{ReplyMsg()}</div>
            </div>
            <div>
                <IoMdClose onClick={() => handleCloseReply()} />
            </div>
        </div>
    );
};

export default memo(ReplyContainer);
