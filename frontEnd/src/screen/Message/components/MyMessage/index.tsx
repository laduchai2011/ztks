import { FC, memo } from 'react';
import style from './style.module.scss';
import { MessageField, messageType_enum } from '@src/dataStruct/message';
import {
    HookDataField,
    MessageTextField,
    ZaloMessage,
    MessageImageField,
    MessageVideoField,
} from '@src/dataStruct/hookData';
import LinkifyText from '@src/component/LinkifyText';
import LazyImage from '@src/component/LazyImage';
// import Thumbnail from './component/Thumbnail';
import LazyVideo from '@src/component/LazyVideo';

const MyMessage: FC<{ data: MessageField, root_LazyVideo?: HTMLDivElement | null }> = ({ data, root_LazyVideo }) => {
    console.log('MyMessage', data.type)
    const message = data.message;
    const hookData: HookDataField<ZaloMessage> = JSON.parse(message);

    switch (data.type) {
        case messageType_enum.TEXT: {
            const messageText = hookData.message as MessageTextField;
            return (
                <div className={style.parent}>
                    <div className={style.main}>
                        <div className={style.contentContainer}>
                            <div className={style.content}>
                                <div className={style.text}>
                                    <div>{messageText.text && <LinkifyText text={messageText.text} />}</div>
                                </div>
                            </div>
                            {/* <div className={style.status}>{data.messageStatus}</div> */}
                        </div>
                    </div>
                </div>
            );
        }
        case messageType_enum.IMAGES: {
            const messageImage = hookData.message as MessageImageField;
            return (
                <div className={style.parent}>
                    <div className={style.main}>
                        <div className={style.contentContainer}>
                            <div className={style.content}>
                                <LazyImage
                                    className={style.image}
                                    src={messageImage.attachment.payload.elements[0].url}
                                    // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlnhFBNw9Io0hHvtv8QzH_euzwGbRJv_IC9A&s"
                                    alt="img"
                                />
                                <div className={style.text}>
                                    <div>{messageImage.text && <LinkifyText text={messageImage.text} />}</div>
                                </div>
                            </div>
                            {/* <div className={style.status}>{data.messageStatus}</div> */}
                        </div>
                    </div>
                </div>
            );
        }
        case messageType_enum.VIDEOS: {
            const messageVideo = hookData.message as MessageVideoField;
            return (
                <div className={style.parent}>
                    <div className={style.main}>
                        <div className={style.contentContainer}>
                            <div className={style.content}>
                                {/* <LazyImage
                                    className={style.image}
                                    src={messageVideo.attachment.payload.elements[0].thumbnail}
                                    // src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTlnhFBNw9Io0hHvtv8QzH_euzwGbRJv_IC9A&s"
                                    alt="img"
                                /> */}
                                {/* <Thumbnail data={messageVideo} /> */}
                                {/* <video
                                    className={style.video}
                                    src={messageVideo.attachment.payload.elements[0].url}
                                    controls
                                /> */}
                                <LazyVideo 
                                    className={style.video}
                                    src={messageVideo.attachment.payload.elements[0].url}
                                    root={root_LazyVideo}
                                />
                                {/* <div className={style.text}>
                                    <div>{messageImage.text && <LinkifyText text={messageImage.text} />}</div>
                                </div> */}
                            </div>
                            {/* <div className={style.status}>{data.messageStatus}</div> */}
                        </div>
                    </div>
                </div>
            );
        }
        default: {
            return;
        }
    }
};

export default memo(MyMessage);
