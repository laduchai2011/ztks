import { memo, useState } from 'react';
import style from './style.module.scss';
import { useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { CREATE_ORDER, TITLE } from '@src/const/text';
import { useCreateOrderMutation } from '@src/redux/query/orderRTK';
import { CreateOrderBodyField } from '@src/dataStruct/order/body';
import { setData_toastMessage, set_isLoading, setNewOrder_createOrder } from '@src/redux/slice/Order';
import { messageType_enum } from '@src/component/ToastMessage/type';

const CreateOrder = () => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const [isShowParent, setIsShowParent] = useState<boolean>(false);
    const [isDisplayBtn, setIsDisplayBtn] = useState<boolean>(true);
    const [isShowBtn, setIsShowBtn] = useState<boolean>(true);
    const [isDisplayIcon, setIsDisplayIcon] = useState<boolean>(false);
    const [isShowIcon, setIsShowIcon] = useState<boolean>(false);
    const [chatRoomId, setChatRoomId] = useState<string>(location.state?.chatRoomId ?? '');
    const [title, setTitle] = useState<string>('');

    const [createOrder] = useCreateOrderMutation();

    const handleHBtn = () => {
        setIsShowParent(true);
        setIsShowBtn(false);
        setTimeout(() => {
            setIsDisplayBtn(false);
        }, 300);
        setIsDisplayIcon(true);
        setTimeout(() => {
            setIsShowIcon(true);
        }, 10);
    };

    const handleHIcon = () => {
        setIsShowParent(false);
        setIsShowIcon(false);
        setTimeout(() => {
            setIsDisplayIcon(false);
        }, 300);
        setIsDisplayBtn(true);
        setTimeout(() => {
            setIsShowBtn(true);
        }, 10);
    };

    const handleChatRoomId = (e: React.ChangeEvent<HTMLInputElement>) => {
        setChatRoomId(e.target.value);
    };

    const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleCreate = () => {
        const label = title.trim();
        const chatRoomId_num = Number(chatRoomId);

        if (label.length === 0) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Vui lòng nhập tiêu đề !',
                })
            );
            return;
        }
        if (isNaN(chatRoomId_num) || chatRoomId_num <= 0) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Vui lòng nhập Id phòng chat hợp lệ !',
                })
            );
            return;
        }

        const body: CreateOrderBodyField = {
            uuid: '',
            label: label,
            content: '',
            money: 0,
            phone: '',
            chatRoomId: chatRoomId_num,
            accountId: -1,
        };
        dispatch(set_isLoading(true));
        createOrder(body)
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    dispatch(setNewOrder_createOrder(resData.data));
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: resData.message,
                        })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: resData?.message || 'Tạo đơn hàng thất bại !',
                        })
                    );
                }
            })
            .catch((err) => {
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: err?.response?.data?.message || 'Tạo đơn hàng thất bại !',
                    })
                );
            })
            .finally(() => {
                setTitle('');
                setChatRoomId('');
                dispatch(set_isLoading(false));
            });
    };

    return (
        <div className={`${style.parent} ${isShowParent ? style.show : ''}`}>
            <div className={style.header}>
                <div
                    className={`${style.btn} ${isDisplayBtn ? style.display : ''} ${isShowBtn ? style.show : ''}`}
                    onClick={() => handleHBtn()}
                >
                    {CREATE_ORDER}
                </div>
                <IoCloseOutline
                    className={`${style.icon} ${isDisplayIcon ? style.display : ''} ${isShowIcon ? style.show : ''}`}
                    onClick={() => handleHIcon()}
                    size={25}
                />
            </div>
            <div className={style.content}>
                <div className={style.labelContainer}>
                    <div>Thêm tiêu đề dễ nhớ cho đơn hàng</div>
                </div>
                <div className={style.inputContainer}>
                    <div>
                        <div>
                            <div>Id phòng chat</div>
                            <input value={chatRoomId} onChange={(e) => handleChatRoomId(e)} />
                        </div>
                    </div>
                    <div>
                        <div>
                            <div>{TITLE}</div>
                            <input value={title} onChange={(e) => handleTitle(e)} />
                        </div>
                    </div>
                </div>
            </div>
            <div className={style.btnContainer}>
                <button onClick={() => handleCreate()}>{CREATE_ORDER}</button>
            </div>
        </div>
    );
};

export default memo(CreateOrder);
