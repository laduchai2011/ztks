import { memo, FC, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { CLOSE, SEND } from '@src/const/text';
import {
    Call_Type_Enum,
    Call_Type_Type,
    Call_In_State_Enum,
    Call_Out_State_Enum,
    Call_In_State_Type,
    Call_Out_State_Type,
    Request_Consent_Field,
} from '@src/data_struct/call';
import { use_request_Consent_Mutation } from '@src/redux/query/call_RTK';
import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import {
    useLazy_get_Latest_Chat_Room_Phone_Query,
    use_create_Chat_Room_Phone_Mutation,
} from '@src/redux/query/chat_room_RTK';
import { formatPhone } from '@src/utility/string';
import { set__is_loading, set__data__toast_message } from '@src/redux/slice/App';
import { messageType_enum } from '@src/component/ToastMessage/type';

const RequestConsent: FC<{
    is_show: boolean;
    set__is_show: React.Dispatch<React.SetStateAction<boolean>>;
    chat_room_id: string;
}> = ({ is_show, set__is_show, chat_room_id }) => {
    const dispatch = useDispatch<AppDispatch>();
    const zalo_app: Zalo_App_Field | undefined = useSelector((state: RootState) => state.App_Slice.zalo_app);
    const zalo_oa: Zalo_Oa_Field | undefined = useSelector((state: RootState) => state.Message_V1_Slice.zalo_oa);
    const parent_element = useRef<HTMLDivElement | null>(null);
    const options_element = useRef<HTMLDivElement | null>(null);
    const [is_show_options, set__is_show_options] = useState<boolean>(false);
    const [selected_call_type, set__selected_call_type] = useState<Call_Type_Type>(Call_Type_Enum.AUDIO);
    const [phone, set__phone] = useState<string>('');
    const [result_request_consent_result, set__result_request_consent_result] = useState<Request_Consent_Field | null>(
        null
    );

    const call_in_state__call_dialog: Call_In_State_Type = useSelector(
        (state: RootState) => state.App_Slice.call_dialog.call_in_state
    );
    const call_out_state__call_dialog: Call_Out_State_Type = useSelector(
        (state: RootState) => state.App_Slice.call_dialog.call_out_state
    );

    const [request_Consent] = use_request_Consent_Mutation();
    const [get_Latest_Chat_Room_Phone] = useLazy_get_Latest_Chat_Room_Phone_Query();
    const [create_Chat_Room_Phone] = use_create_Chat_Room_Phone_Mutation();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show) {
            parentElement.classList.add(style.isShow);
        } else {
            parentElement.classList.remove(style.isShow);
        }
    }, [is_show]);

    useEffect(() => {
        if (!options_element.current) return;
        const optionsElement = options_element.current;

        if (is_show_options) {
            optionsElement.classList.add(style.isShow);
        } else {
            optionsElement.classList.remove(style.isShow);
        }
    }, [is_show_options]);

    useEffect(() => {
        if (
            call_in_state__call_dialog !== Call_In_State_Enum.CALL_END ||
            call_out_state__call_dialog !== Call_Out_State_Enum.CALL_END
        ) {
            set__is_show(false);
        } else {
            set__is_show(is_show);
        }
    }, [is_show, set__is_show, call_in_state__call_dialog, call_out_state__call_dialog]);

    useEffect(() => {
        if (chat_room_id.length === 0) return;
        get_Latest_Chat_Room_Phone({ chat_room_id: chat_room_id, account_id: '' })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data?.data) {
                    set__phone(res_data.data.phone);
                }
            })
            .catch((err) => console.error('get_Latest_Chat_Room_Phone err', err));
    }, [get_Latest_Chat_Room_Phone, chat_room_id]);

    const handle_Close = () => {
        set__is_show(false);
    };

    const handle_Is_Show_Options = (value: boolean) => {
        set__is_show_options(value);
    };

    const handle_Text_Call_Type = (call_type: Call_Type_Type) => {
        switch (call_type) {
            case Call_Type_Enum.AUDIO:
                return 'Chỉ âm thanh';
            // case CallTypeEnum.VIDEO:
            //     return 'Chỉ thước phim';
            case Call_Type_Enum.AUDIO_AND_VIDEO:
                return 'Cả âm thanh và thước phim';
            default:
                return 'Chọn loại cuộc gọi';
        }
    };

    const handle_Select_Call_Type = (call_type: Call_Type_Type) => {
        set__selected_call_type(call_type);
        set__is_show_options(false);
    };

    const handle_Phone_Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__phone(e.target.value);
    };

    const handle_Request_Consent = async () => {
        if (!zalo_app) return;
        if (!zalo_oa) return;
        const phone1 = phone.trim();

        dispatch(set__is_loading(true));

        try {
            const res1 = await request_Consent({
                phone: formatPhone(phone1),
                call_type: selected_call_type,
                reason_code: 101,
                zalo_app: zalo_app,
                zalo_oa: zalo_oa,
                account_id: '',
            });
            const res1_data = res1.data;
            if (res1_data?.is_success && res1_data?.data) {
                set__result_request_consent_result(res1_data.data);
            }

            if (!chat_room_id) return;
            const res2 = await create_Chat_Room_Phone({
                phone: phone1,
                chat_room_id: chat_room_id,
                account_id: '',
            });

            const res2_data = res2.data;
            console.log('create_Chat_Room_Phone res2_data', res2_data);
        } catch (error) {
            console.error(error);
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Đã có lỗi xảy ra',
                })
            );
        } finally {
            dispatch(set__is_loading(false));
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
                <IoMdClose onClick={() => handle_Close()} size={15} title={CLOSE} />
            </div>
            <div className={style.phone}>
                <div>1 - Nhập số điện thoại của zalo này</div>
                <div>
                    <input value={phone} onChange={handle_Phone_Change} placeholder="Số điện thoại" />
                </div>
            </div>
            <div className={style.callType}>
                <div>2 - Chọn loại cuộc gọi</div>
                <div className={style.select}>
                    <div className={style.selected}>
                        <div>{handle_Text_Call_Type(selected_call_type)}</div>
                        <div>
                            {is_show_options ? (
                                <FiChevronUp onClick={() => handle_Is_Show_Options(false)} />
                            ) : (
                                <FiChevronDown onClick={() => handle_Is_Show_Options(true)} />
                            )}
                        </div>
                    </div>
                    <div className={style.options} ref={options_element}>
                        <div onClick={() => handle_Select_Call_Type(Call_Type_Enum.AUDIO)}>
                            {handle_Text_Call_Type(Call_Type_Enum.AUDIO)}
                        </div>
                        {/* <div onClick={() => handleSelectCallType(CallTypeEnum.VIDEO)}>
                            {handleTextCallType(CallTypeEnum.VIDEO)}
                        </div> */}
                        <div onClick={() => handle_Select_Call_Type(Call_Type_Enum.AUDIO_AND_VIDEO)}>
                            {handle_Text_Call_Type(Call_Type_Enum.AUDIO_AND_VIDEO)}
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.send}>
                <div>3 - Gửi yêu cầu</div>
                <div>
                    <button onClick={() => handle_Request_Consent()}>{SEND}</button>
                </div>
                <div>{result_request_consent_result && <div>{result_request_consent_result.message}</div>}</div>
            </div>
        </div>
    );
};

export default memo(RequestConsent);
