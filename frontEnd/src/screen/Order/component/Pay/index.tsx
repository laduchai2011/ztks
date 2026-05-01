import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE } from '@src/const/text';
import {
    setData_toastMessage,
    setIsShow_payDialog,
    setOrder_payDialog,
    setNewOrder_payDialog,
} from '@src/redux/slice/Order';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { ZaloAppField } from '@src/dataStruct/zalo';
import { OrderField } from '@src/dataStruct/order';
import { AccountField } from '@src/dataStruct/account';
import { VoucherField } from '@src/dataStruct/voucher';
import { formatMoney } from '@src/utility/string';
import { useLazyGetZaloOaWithIdQuery } from '@src/redux/query/zaloRTK';
import { useLazyGetOrderWithIdQuery } from '@src/redux/query/orderRTK';
import { useLazyGetChatRoomsWithIdQuery } from '@src/redux/query/chatRoomRTK';
import { useLazyGetLastMessageQuery } from '@src/redux/query/messageV1RTK';
import { getSocket } from '@src/socketIo';
import { MessageImageBodyField } from '@src/dataStruct/zalo/hookData/body';
import { useCreateMessageV1Mutation } from '@src/redux/query/messageV1RTK';
import { AccountInformationField } from '@src/dataStruct/account';
import { CreateMessageV1BodyField } from '@src/dataStruct/message_v1/body';
import { useLazyGetMyWalletWithTypeQuery } from '@src/redux/query/walletRTK';
import { useLazyGetVoucherWithOrderIdQuery } from '@src/redux/query/voucherRTK';
import { WalletField, WalletEnum } from '@src/dataStruct/wallet';

const Pay = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const accountInformation: AccountInformationField | undefined = useSelector(
        (state: RootState) => state.AppSlice.accountInformation
    );
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);
    const isShow: boolean = useSelector((state: RootState) => state.OrderSlice.payDialog.isShow);
    const order: OrderField | undefined = useSelector((state: RootState) => state.OrderSlice.payDialog.order);
    const newOrder: OrderField | undefined = useSelector((state: RootState) => state.OrderSlice.payDialog.newOrder);
    const [qrCode, setQrCode] = useState<string>('');
    const [order1, setOrder1] = useState<OrderField | undefined>(undefined);
    const [wallet, setWallet] = useState<WalletField | undefined>(undefined);
    const [selectedVoucher, setSelectedVoucher] = useState<VoucherField | undefined>(undefined);
    const [finalMoney, setFinalMoney] = useState<number>(0);

    const [getZaloOaWithId] = useLazyGetZaloOaWithIdQuery();
    const [getOrderWithId] = useLazyGetOrderWithIdQuery();
    const [createMessageV1] = useCreateMessageV1Mutation();
    const [getChatRoomsWithId] = useLazyGetChatRoomsWithIdQuery();
    const [getLastMessage] = useLazyGetLastMessageQuery();
    const [getMyWalletWithType] = useLazyGetMyWalletWithTypeQuery();
    const [getVoucherWithOrderId] = useLazyGetVoucherWithOrderIdQuery();

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (isShow) {
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
    }, [isShow]);

    useEffect(() => {
        if (newOrder) {
            setOrder1(newOrder);
        } else if (order) {
            setOrder1(order);
        }

        return () => {
            dispatch(setOrder_payDialog(undefined));
            dispatch(setNewOrder_payDialog(undefined));
        };
    }, [dispatch, order, newOrder]);

    useEffect(() => {
        const socket = getSocket();

        const onSocketOrderPay = (orderS: OrderField) => {
            console.log('onSocketOrderPay', orderS);
            setOrder1((prev) => {
                if (!prev) return prev;

                if (prev.id === orderS.id) {
                    getOrderWithId({ id: orderS.id })
                        .then((res) => {
                            const resData = res.data;

                            if (resData?.isSuccess && resData.data) {
                                dispatch(setNewOrder_payDialog(resData.data));
                                dispatch(setIsShow_payDialog(false));
                            } else {
                                dispatch(
                                    setData_toastMessage({
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

        socket.on('orderPay', onSocketOrderPay);

        return () => {
            socket.off('orderPay', onSocketOrderPay);
        };
    }, [dispatch, getOrderWithId]);

    useEffect(() => {
        if (!account) return;
        getMyWalletWithType({ type: WalletEnum.TWO, accountId: account.id })
            .then((res) => {
                const resData = res.data;

                if (resData?.isSuccess && resData.data) {
                    setWallet(resData.data);
                }
            })
            .catch((err) => {
                console.log('getAllWallets err: ', err);
            });
    }, [getMyWalletWithType, account]);

    useEffect(() => {
        if (!order) return;
        getVoucherWithOrderId({ orderId: order.id })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setSelectedVoucher(resData.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [order, getVoucherWithOrderId]);

    useEffect(() => {
        if (!order1) return;
        if (selectedVoucher) {
            const final_money: number =
                order1.money - selectedVoucher.money >= 0 ? order1.money - selectedVoucher.money : 0;
            setFinalMoney(final_money);
        } else {
            setFinalMoney(order1.money);
        }
    }, [selectedVoucher, order1]);

    useEffect(() => {
        if (!account || !order1 || !wallet) return;
        const des = `ztksPayjorderPayj${order1.id}j${wallet.id}j${account.id}`;
        setQrCode(`https://qr.sepay.vn/img?acc=VQRQAHJHB9302&bank=MBBank&amount=${finalMoney}&des=${des}`);
    }, [account, order1, wallet, finalMoney]);

    const handleClose = () => {
        dispatch(setIsShow_payDialog(false));
    };

    const handleSendQr = async () => {
        if (!zaloApp) return;
        if (!order1) return;
        if (!accountInformation) return;

        const newMessage: MessageImageBodyField = {
            text: 'Bạn có đơn hàng chưa thanh toán',
            attachment: {
                type: 'template',
                payload: {
                    template_type: 'media',
                    elements: [
                        {
                            media_type: 'image',
                            url: qrCode,
                        },
                    ],
                },
            },
        };

        try {
            const res_getChatRoom = await getChatRoomsWithId({ id: order1.chatRoomId });
            const resData_getChatRoom = res_getChatRoom.data;
            if (!(resData_getChatRoom?.isSuccess && resData_getChatRoom.data)) {
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
                return;
            }
            const chatRoom = resData_getChatRoom.data;

            const res_getZaloOa = await getZaloOaWithId({
                id: chatRoom.zaloOaId,
                accountId: accountInformation?.addedById || -1,
            });
            const resData_getZaloOa = res_getZaloOa.data;
            if (!(resData_getZaloOa?.isSuccess && resData_getZaloOa.data)) {
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
                return;
            }
            const zaloOa = resData_getZaloOa.data;

            const res_getLastMessage = await getLastMessage({ chatRoomId: chatRoom.id.toString() });
            const resData_getLastMessage = res_getLastMessage.data;
            if (!(resData_getLastMessage?.isSuccess && resData_getLastMessage.data)) {
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
                return;
            }
            const lastMessage = resData_getLastMessage.data;

            let u_senderId: string = '';

            const isUserSend = lastMessage.event_name.startsWith('user_send');
            const isOaSend = lastMessage.event_name.startsWith('oa_send');

            if (isUserSend) {
                u_senderId = lastMessage.sender_id;
            }

            if (isOaSend) {
                u_senderId = lastMessage.recipient_id;
            }

            const createMessageV1Body: CreateMessageV1BodyField = {
                zaloApp: zaloApp,
                zaloOa: zaloOa,
                chatRoomId: order1.chatRoomId,
                payload: {
                    recipient: {
                        user_id: u_senderId,
                    },
                    message: newMessage,
                },
            };

            const res_newMessage = await createMessageV1(createMessageV1Body);
            const resData_newMessage = res_newMessage.data;
            if (!(resData_newMessage?.isSuccess && resData_newMessage.data)) {
                console.log('resData_newMessage');
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: resData_newMessage?.message ?? 'Gửi tin nhắn không thành công !',
                    })
                );
                return;
            }
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.SUCCESS,
                    message: 'Gửi tin nhắn thành công !',
                })
            );
        } catch (error) {
            console.error(error);
            dispatch(
                setData_toastMessage({
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
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    {order1?.isPay && <div>Đơn hàng đã thanh toán</div>}
                    {!order1?.isPay && <div>Vui lòng quét mã QR để thanh toán</div>}
                    {!order1?.isPay && (
                        <div className={style.sendQr} onClick={() => handleSendQr()}>
                            Gửi mã cho khách hàng
                        </div>
                    )}
                    {!order1?.isPay && <div>{qrCode.length > 0 && <img src={qrCode} alt="qrCode" />}</div>}
                    {order1 && !order1?.isPay && finalMoney > 0 && (
                        <div className={style.money}>{formatMoney(finalMoney)}</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default memo(Pay);
