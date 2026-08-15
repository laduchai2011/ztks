import { memo, FC, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { CLOSE, SEND } from '@src/const/text';
import { CallTypeEnum, CallTypeType, RequestConsentField } from '@src/dataStruct/call';
import { useRequestConsentMutation } from '@src/redux/query/callRTK';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { useLazyGetLatestChatRoomPhoneQuery, useCreateChatRoomPhoneMutation } from '@src/redux/query/chatRoomRTK';
import { formatPhone } from '@src/utility/string';
import { set_isLoading, setData_toastMessage } from '@src/redux/slice/App';
import { messageType_enum } from '@src/component/ToastMessage/type';

const RequestConsent: FC<{
    isConnecting: boolean;
    isRinging: boolean;
    isShow: boolean;
    setIsShow: React.Dispatch<React.SetStateAction<boolean>>;
    chatRoomId: number;
}> = ({ isConnecting, isRinging, isShow, setIsShow, chatRoomId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);
    const zaloOa: ZaloOaField | undefined = useSelector((state: RootState) => state.MessageV1Slice.zaloOa);
    const parent_element = useRef<HTMLDivElement | null>(null);
    const options_element = useRef<HTMLDivElement | null>(null);
    const [isShowOptions, setIsShowOptions] = useState<boolean>(false);
    const [selectedCallType, setSelectedCallType] = useState<CallTypeType>(CallTypeEnum.AUDIO);
    const [phone, setPhone] = useState<string>('');
    const [resultRequestConsentResult, setResultRequestConsentResult] = useState<RequestConsentField | null>(null);

    const [requestConsent] = useRequestConsentMutation();
    const [getLatestChatRoomPhone] = useLazyGetLatestChatRoomPhoneQuery();
    const [createChatRoomPhone] = useCreateChatRoomPhoneMutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (isShow) {
            parentElement.classList.add(style.isShow);
        } else {
            parentElement.classList.remove(style.isShow);
        }
    }, [isShow]);

    useEffect(() => {
        if (!options_element.current) return;
        const optionsElement = options_element.current;

        if (isShowOptions) {
            optionsElement.classList.add(style.isShow);
        } else {
            optionsElement.classList.remove(style.isShow);
        }
    }, [isShowOptions]);

    useEffect(() => {
        if (isRinging || isConnecting) {
            setIsShow(false);
        } else {
            setIsShow(isShow);
        }
    }, [isRinging, isConnecting, setIsShow, isShow]);

    useEffect(() => {
        if (chatRoomId === -1) return;
        getLatestChatRoomPhone({ chatRoomId: chatRoomId, accountId: -1 })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData?.data) {
                    setPhone(resData.data.phone);
                }
            })
            .catch((err) => console.error('getLatestChatRoomPhone err', err));
    }, [getLatestChatRoomPhone, chatRoomId]);

    const handleClose = () => {
        setIsShow(false);
    };

    const handleIsShowOptions = (value: boolean) => {
        setIsShowOptions(value);
    };

    const handleTextCallType = (callType: CallTypeType) => {
        switch (callType) {
            case CallTypeEnum.AUDIO:
                return 'Chỉ âm thanh';
            // case CallTypeEnum.VIDEO:
            //     return 'Chỉ thước phim';
            case CallTypeEnum.AUDIO_AND_VIDEO:
                return 'Cả âm thanh và thước phim';
            default:
                return 'Chọn loại cuộc gọi';
        }
    };

    const handleSelectCallType = (callType: CallTypeType) => {
        setSelectedCallType(callType);
        setIsShowOptions(false);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhone(e.target.value);
    };

    const handleRequestConsent = async () => {
        if (!zaloApp) return;
        if (!zaloOa) return;
        const phone1 = phone.trim();

        dispatch(set_isLoading(true));

        try {
            const res1 = await requestConsent({
                phone: formatPhone(phone1),
                call_type: selectedCallType,
                reason_code: 101,
                zaloApp: zaloApp,
                zaloOa: zaloOa,
                accountId: -1,
            });
            const res1Data = res1.data;
            if (res1Data?.isSuccess && res1Data?.data) {
                setResultRequestConsentResult(res1Data.data);
            }

            if (!chatRoomId) return;
            const res2 = await createChatRoomPhone({
                phone: phone1,
                chatRoomId: chatRoomId,
                accountId: -1,
            });

            const res2Data = res2.data;
            console.log('createChatRoomPhone res2Data', res2Data);
        } catch (error) {
            console.error(error);
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Đã có lỗi xảy ra',
                })
            );
        } finally {
            dispatch(set_isLoading(false));
        }

        // requestConsent({
        //     phone: formatPhone(phone1),
        //     call_type: selectedCallType,
        //     reason_code: 101,
        //     zaloApp: zaloApp,
        //     zaloOa: zaloOa,
        //     accountId: -1,
        // })
        //     .then((res) => {
        //         const resData = res.data;
        //         if (resData?.isSuccess && resData?.data) {
        //             setResultRequestConsentResult(resData.data);
        //         }
        //         createChatRoomPhone({
        //             phone: phone1,
        //             chatRoomId: chatRoomId,
        //             accountId: -1,
        //         })
        //             .then((res) => {
        //                 const resData = res.data;
        //                 console.log('createChatRoomPhone resData', resData);
        //             })
        //             .catch((err) => console.error('createChatRoomPhone err', err));
        //     })
        //     .catch((err) => {
        //         console.error(err);
        //     });
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.closeContainer}>
                <IoMdClose onClick={() => handleClose()} size={15} title={CLOSE} />
            </div>
            <div className={style.phone}>
                <div>1 - Nhập số điện thoại của zalo này</div>
                <div>
                    <input value={phone} onChange={handlePhoneChange} placeholder="Số điện thoại" />
                </div>
            </div>
            <div className={style.callType}>
                <div>2 - Chọn loại cuộc gọi</div>
                <div className={style.select}>
                    <div className={style.selected}>
                        <div>{handleTextCallType(selectedCallType)}</div>
                        <div>
                            {isShowOptions ? (
                                <FiChevronUp onClick={() => handleIsShowOptions(false)} />
                            ) : (
                                <FiChevronDown onClick={() => handleIsShowOptions(true)} />
                            )}
                        </div>
                    </div>
                    <div className={style.options} ref={options_element}>
                        <div onClick={() => handleSelectCallType(CallTypeEnum.AUDIO)}>
                            {handleTextCallType(CallTypeEnum.AUDIO)}
                        </div>
                        {/* <div onClick={() => handleSelectCallType(CallTypeEnum.VIDEO)}>
                            {handleTextCallType(CallTypeEnum.VIDEO)}
                        </div> */}
                        <div onClick={() => handleSelectCallType(CallTypeEnum.AUDIO_AND_VIDEO)}>
                            {handleTextCallType(CallTypeEnum.AUDIO_AND_VIDEO)}
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.send}>
                <div>3 - Gửi yêu cầu</div>
                <div>
                    <button onClick={() => handleRequestConsent()}>{SEND}</button>
                </div>
                <div>{resultRequestConsentResult && <div>{resultRequestConsentResult.message}</div>}</div>
            </div>
        </div>
    );
};

export default memo(RequestConsent);
