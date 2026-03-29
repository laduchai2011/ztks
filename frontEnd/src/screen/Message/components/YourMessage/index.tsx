import { FC, memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
// import avatarnull from '@src/asset/avatar/avatarnull.png';
import { MessageField, messageType_enum } from '@src/dataStruct/message';
import {
    HookDataField,
    MessageTextField,
    ZaloMessage,
    MessageImageOaSendField,
    ZaloCustomerField,
    MessageVideosField,
} from '@src/dataStruct/hookData';
import LinkifyText from '@src/component/LinkifyText';
import LazyImage from '@src/component/LazyImage';
// import LazyVideo from '@src/component/LazyVideo';
import Thumbnail from './component/Thumbnail';
import { useGetInforCustomerOnZaloQuery, useDelIsNewMessageMutation } from '@src/redux/query/myCustomerRTK';
import { useUpdateMessageStatusMutation } from '@src/redux/query/messageRTK';
import { UpdateMessageStatusBodyField, messageStatus_enum } from '@src/dataStruct/message';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';

const YourMessage: FC<{ data: MessageField }> = ({ data }) => {
    console.log('YourMessage', data.type)
    const { id } = useParams<{ id: string }>();
    const message = data.message;
    const hookData: HookDataField<ZaloMessage> = JSON.parse(message);

    const id_isNewMessage_current: number = useSelector((state: RootState) => state.AppSlice.id_isNewMessage_current);

    const [zaloCustomer, setZaloCustomer] = useState<ZaloCustomerField | undefined>(undefined);

    const [updateMessageStatus] = useUpdateMessageStatusMutation();
    const [delIsNewMessage] = useDelIsNewMessageMutation();

    useEffect(() => {
        if (data.messageStatus !== messageStatus_enum.SEEN) {
            delIsNewMessage({ id: id_isNewMessage_current })
                .then(() => {
                    // const resData1 = res.data;
                    // console.log(22222, resData1);
                })
                .catch((err) => console.error(err));
        }
    }, [id_isNewMessage_current, delIsNewMessage, data]);

    useEffect(() => {
        const updateMessageStatusBody: UpdateMessageStatusBodyField = {
            eventName: data.eventName,
            receiveId: data.receiveId,
            timestamp: data.timestamp,
            messageStatus: messageStatus_enum.SEEN,
            accountId: data.accountId,
        };

        if (data.messageStatus !== messageStatus_enum.SEEN) {
            updateMessageStatus(updateMessageStatusBody)
                .then((res) => {
                    const resData = res.data;
                    if (resData?.isSuccess && res.data) {
                        // delIsNewMessage({ id: id_isNewMessage_current })
                        //     .then((res) => {
                        //         const resData1 = res.data;
                        //         console.log(22222, resData1);
                        //     })
                        //     .catch((err) => console.error(err));
                    }
                })
                .catch((err) => console.error(err));
        }
    }, [updateMessageStatus, data]);

    const {
        data: data_zaloInforCustomer,
        // isFetching,
        isLoading: isLoading_zaloInforCustomer,
        isError: isError_zaloInforCustomer,
        error: error_zaloInforCustomer,
    } = useGetInforCustomerOnZaloQuery({ customerId: id || '' }, { skip: id === undefined });
    useEffect(() => {
        if (isError_zaloInforCustomer && error_zaloInforCustomer) {
            console.error(error_zaloInforCustomer);
            // dispatch(
            //     setData_toastMessage({
            //         type: messageType_enum.SUCCESS,
            //         message: 'Lấy dữ liệu KHÔNG thành công !',
            //     })
            // );
        }
    }, [isError_zaloInforCustomer, error_zaloInforCustomer]);
    useEffect(() => {
        // setIsLoading(isLoading_medication);
    }, [isLoading_zaloInforCustomer]);
    useEffect(() => {
        const resData = data_zaloInforCustomer;
        if (resData?.isSuccess && resData.data && resData.data.error === 0) {
            setZaloCustomer(resData.data);
        }
    }, [data_zaloInforCustomer]);

    switch (data.type) {
        case messageType_enum.TEXT: {
            const messageText = hookData.message as MessageTextField;
            return (
                <div className={style.parent}>
                    <div className={style.main}>
                        <div className={style.avatarContainer}>
                            {zaloCustomer?.data.avatar && (
                                <LazyImage className={style.avatar} src={zaloCustomer?.data.avatar} alt="avatar" />
                            )}
                        </div>
                        <div className={style.contentContainer}>
                            <div className={style.content}>
                                <div className={style.text}>
                                    {messageText.text && <LinkifyText text={messageText.text} />}
                                </div>
                            </div>
                            {/* <div className={style.status}>{data.messageStatus}</div> */}
                        </div>
                    </div>
                </div>
            );
        }
        case messageType_enum.IMAGES: {
            const messageImage = hookData.message as MessageImageOaSendField;
            return (
                <div className={style.parent}>
                    <div className={style.main}>
                        <div className={style.avatarContainer}>
                            {zaloCustomer?.data.avatar && (
                                <LazyImage className={style.avatar} src={zaloCustomer?.data.avatar} alt="avatar" />
                            )}
                        </div>
                        <div className={style.contentContainer}>
                            <div className={style.content}>
                                <LazyImage
                                    className={style.image}
                                    src={messageImage.attachments[0].payload.url}
                                    alt="img"
                                />
                                <div className={style.text}>
                                    {messageImage.text && <LinkifyText text={messageImage.text} />}
                                </div>
                            </div>
                            {/* <div className={style.status}>{data.messageStatus}</div> */}
                        </div>
                    </div>
                </div>
            );
        }
        // case messageType_enum.VIDEOS: {
        //     const messageVideo = hookData.message as MessageVideosField;
        //     return (
        //         <div className={style.parent}>
        //             <div className={style.main}>
        //                 <div className={style.avatarContainer}>
        //                     {zaloCustomer?.data.avatar && (
        //                         <LazyImage className={style.avatar} src={zaloCustomer?.data.avatar} alt="avatar" />
        //                     )}
        //                 </div>
        //                 <div className={style.contentContainer}>
        //                     <div className={style.content}>
        //                         <LazyVideo className={style.image} src={messageVideo.attachments[0].payload.url} />
        //                         <div className={style.text}>
        //                             {messageVideo.text && <LinkifyText text={messageVideo.text} />}
        //                         </div>
        //                     </div>
        //                     {/* <div className={style.status}>{data.messageStatus}</div> */}
        //                 </div>
        //             </div>
        //         </div>
        //     );
        // }
        case messageType_enum.VIDEOS: {
            const messageVideo = hookData.message as MessageVideosField;
            return (
                <div className={style.parent}>
                    <div className={style.main}>
                        <div className={style.avatarContainer}>
                            {zaloCustomer?.data.avatar && (
                                <LazyImage className={style.avatar} src={zaloCustomer?.data.avatar} alt="avatar" />
                            )}
                        </div>
                        <div className={style.contentContainer}>
                            <div className={style.content}>
                                <Thumbnail data={messageVideo} />
                            </div>
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

export default memo(YourMessage);
