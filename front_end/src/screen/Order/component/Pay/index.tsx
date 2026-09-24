import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE } from '@src/const/text';
import {
    set__data__toast_message,
    set__is_show__pay_dialog,
    set__order__pay_dialog,
    set__new_order__pay_dialog,
} from '@src/redux/slice/Order';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { Zalo_App_Field } from '@src/data_struct/zalo';
import { Order_Field } from '@src/data_struct/order';
import { Account_Field } from '@src/data_struct/account';
import { Voucher_Field } from '@src/data_struct/voucher';
import { formatMoney } from '@src/utility/string';
import { useLazy_get_Zalo_Oa_With_Id_Query } from '@src/redux/query/zalo_RTK';
import { useLazy_get_Order_With_Id_Query } from '@src/redux/query/order_RTK';
import { useLazy_get_Chat_Rooms_With_Id_Query } from '@src/redux/query/chat_room_RTK';
import { useLazy_get_Last_Message_Query } from '@src/redux/query/message_v1_RTK';
import { get_Socket } from '@src/socketIo';
import { Message_Image_Body_Field } from '@src/data_struct/zalo/hook_data/body';
import { use_create_Message_V1_Mutation } from '@src/redux/query/message_v1_RTK';
import { Account_Information_Field } from '@src/data_struct/account';
import { Create_Message_V1_Body_Field } from '@src/data_struct/message_v1/body';
import { useLazy_get_My_Wallet_With_Type_Query } from '@src/redux/query/wallet_RTK';
import { useLazy_get_Voucher_With_Order_Id_Query } from '@src/redux/query/voucher_RTK';
import { Wallet_Field, Wallet_Enum } from '@src/data_struct/wallet';

const Pay = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const zalo_app: Zalo_App_Field | undefined = useSelector((state: RootState) => state.App_Slice.zalo_app);
    const is_show: boolean = useSelector((state: RootState) => state.Order_Slice.pay_dialog.is_show);
    const order: Order_Field | undefined = useSelector((state: RootState) => state.Order_Slice.pay_dialog.order);
    const new_order: Order_Field | undefined = useSelector(
        (state: RootState) => state.Order_Slice.pay_dialog.new_order
    );

    const [qr_code, set__qr_code] = useState<string>('');
    const [order1, set__order1] = useState<Order_Field | undefined>(undefined);
    const [wallet, set__wallet] = useState<Wallet_Field | undefined>(undefined);
    const [selected_voucher, set__selected_voucher] = useState<Voucher_Field | undefined>(undefined);
    const [final_money, set__final_money] = useState<number>(0);

    const [get_Zalo_Oa_With_Id] = useLazy_get_Zalo_Oa_With_Id_Query();
    const [get_Order_With_Id] = useLazy_get_Order_With_Id_Query();
    const [create_Message_V1] = use_create_Message_V1_Mutation();
    const [get_Chat_Rooms_With_Id] = useLazy_get_Chat_Rooms_With_Id_Query();
    const [get_Last_Message] = useLazy_get_Last_Message_Query();
    const [get_My_Wallet_With_Type] = useLazy_get_My_Wallet_With_Type_Query();
    const [get_Voucher_With_Order_Id] = useLazy_get_Voucher_With_Order_Id_Query();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show) {
            parentElement.classList.add(style.display);
            const timeout2 = setTimeout(() => {
                parentElement.classList.add(style.opacity);
                clearTimeout(timeout2);
            }, 50);
        } else {
            parentElement.classList.remove(style.opacity);

            const timeout2 = setTimeout(() => {
                parentElement.classList.remove(style.display);
                clearTimeout(timeout2);
            }, 550);
        }
    }, [is_show]);

    useEffect(() => {
        if (new_order) {
            set__order1(new_order);
        } else if (order) {
            set__order1(order);
        }

        return () => {
            dispatch(set__order__pay_dialog(undefined));
            dispatch(set__new_order__pay_dialog(undefined));
        };
    }, [dispatch, order, new_order]);

    useEffect(() => {
        const socket = get_Socket();

        const on_Socket_Order_Pay = (orderS: Order_Field) => {
            set__order1((prev) => {
                if (!prev) return prev;

                if (prev.id === orderS.id) {
                    get_Order_With_Id({ id: orderS.id })
                        .then((res) => {
                            const res_data = res.data;

                            if (res_data?.is_success && res_data.data) {
                                dispatch(set__new_order__pay_dialog(res_data.data));
                                dispatch(set__is_show__pay_dialog(false));
                            } else {
                                dispatch(
                                    set__data__toast_message({
                                        type: messageType_enum.ERROR,
                                        message: 'Thanh toán không thành công !',
                                    })
                                );
                            }
                        })
                        .catch(console.error);
                }

                return prev;
            });
        };

        socket.on('orderPay', on_Socket_Order_Pay);

        return () => {
            socket.off('orderPay', on_Socket_Order_Pay);
        };
    }, [dispatch, get_Order_With_Id]);

    useEffect(() => {
        if (!account) return;
        get_My_Wallet_With_Type({ type: Wallet_Enum.TWO, account_id: account.id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__wallet(res_data.data);
                }
            })
            .catch((err) => {
                console.log('getAllWallets err: ', err);
            });
    }, [get_My_Wallet_With_Type, account]);

    useEffect(() => {
        if (!order) return;
        get_Voucher_With_Order_Id({ order_id: order.id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__selected_voucher(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [order, get_Voucher_With_Order_Id]);

    useEffect(() => {
        if (!order1) return;
        if (selected_voucher) {
            const final_money: number =
                order1.money - selected_voucher.money >= 0 ? order1.money - selected_voucher.money : 0;
            set__final_money(final_money);
        } else {
            set__final_money(order1.money);
        }
    }, [selected_voucher, order1]);

    useEffect(() => {
        if (!account || !order1 || !wallet) return;
        const des = `ztksPayjorderPayj${order1.id}j${wallet.id}j${account.id}`;
        set__qr_code(`https://qr.sepay.vn/img?acc=VQRQAHJHB9302&bank=MBBank&amount=${final_money}&des=${des}`);
    }, [account, order1, wallet, final_money]);

    const handle_Close = () => {
        dispatch(set__is_show__pay_dialog(false));
    };

    const handle_Send_Qr = async () => {
        if (!zalo_app) return;
        if (!order1) return;
        if (!account_information) return;

        const new_message: Message_Image_Body_Field = {
            text: 'Bạn có đơn hàng chưa thanh toán',
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'media',
                    elements: [
                        {
                            media_type: 'image',
                            url: qr_code,
                        },
                    ],
                },
            },
        };

        try {
            const res_get__chat_room = await get_Chat_Rooms_With_Id({ id: order1.chat_room_id });
            const res_data__get_chat_room = res_get__chat_room.data;
            if (!(res_data__get_chat_room?.is_success && res_data__get_chat_room.data)) {
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
                return;
            }
            const chat_room = res_data__get_chat_room.data;

            const res_get__get_zalo_oa = await get_Zalo_Oa_With_Id({
                id: chat_room.zalo_oa_id,
                account_id: account_information?.added_by_id || '',
            });
            const res_data__get_zalo_oa = res_get__get_zalo_oa.data;
            if (!(res_data__get_zalo_oa?.is_success && res_data__get_zalo_oa.data)) {
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
                return;
            }
            const zalo_oa = res_data__get_zalo_oa.data;

            const res_get__get_last_message = await get_Last_Message({ chat_room_id: chat_room.id });
            const res_data__get_last_message = res_get__get_last_message.data;
            if (!(res_data__get_last_message?.is_success && res_data__get_last_message.data)) {
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
                return;
            }
            const last_message = res_data__get_last_message.data;

            let u_sender_id: string = '';

            const is_user_send = last_message.event_name.startsWith('user_send');
            const is_oa_send = last_message.event_name.startsWith('oa_send');

            if ('call_id' in last_message) {
                u_sender_id = last_message.user_id;
            } else {
                if (is_user_send) {
                    u_sender_id = last_message.sender_id;
                }

                if (is_oa_send) {
                    u_sender_id = last_message.recipient_id;
                }
            }

            const create_message_v1_body: Create_Message_V1_Body_Field = {
                zalo_app: zalo_app,
                zalo_oa: zalo_oa,
                chat_room_id: order1.chat_room_id,
                payload: {
                    recipient: {
                        user_id: u_sender_id,
                    },
                    message: new_message,
                },
            };

            const res__new_message = await create_Message_V1(create_message_v1_body);
            const res_data__new_message = res__new_message.data;
            if (!(res_data__new_message?.is_success && res_data__new_message.data)) {
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: res_data__new_message?.message ?? 'Gửi tin nhắn không thành công !',
                    })
                );
                return;
            }
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.SUCCESS,
                    message: 'Gửi tin nhắn thành công !',
                })
            );
        } catch (error) {
            console.error(error);
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Đã có lỗi xảy ra !',
                })
            );
        }
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    {order1?.is_pay && <div>Đơn hàng đã thanh toán</div>}
                    {!order1?.is_pay && <div>Vui lòng quét mã QR để thanh toán</div>}
                    {!order1?.is_pay && (
                        <div className={style.sendQr} onClick={() => handle_Send_Qr()}>
                            Gửi mã cho khách hàng
                        </div>
                    )}
                    {!order1?.is_pay && <div>{qr_code.length > 0 && <img src={qr_code} alt="qrCode" />}</div>}
                    {order1 && !order1?.is_pay && final_money > 0 && (
                        <div className={style.money}>{formatMoney(final_money)}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(Pay);
