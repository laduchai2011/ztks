import { memo, FC, useState, useEffect, useRef } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { RECEIVE, RECEIVED } from '@src/const/text';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { IoReloadCircleSharp } from 'react-icons/io5';
import { AccountField } from '@src/dataStruct/account';
import { RequireTakeMoneyField } from '@src/dataStruct/wallet';
import { detailTime } from '@src/utility/time';
import { formatMoney } from '@src/utility/string';
import { useLazyGetAccountWithIdQuery } from '@src/redux/query/accountRTK';
import { useLazyGetRequireWithIdQuery, useMemberZtksConfirmTakeMoneyMutation } from '@src/redux/query/walletRTK';
import { useLazyGetBankWithIdQuery } from '@src/redux/query/bankRTK';
import { set_isLoading, setData_toastMessage } from '@src/redux/slice/RequireTakeMoney';
import { messageType_enum } from '@src/component/ToastMessage/type';

const One: FC<{ index: number; data: RequireTakeMoneyField }> = ({ index, data }) => {
    const dispatch = useDispatch<AppDispatch>();
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);

    const payContent_element = useRef<HTMLDivElement | null>(null);

    const [requireTakeMoney, setRequireTakeMoney] = useState<RequireTakeMoneyField>(data);
    const [reqUser, setReqUser] = useState<AccountField | undefined>(undefined);
    const [isShowPay, setIsShowPay] = useState<boolean>(false);
    const [qrCode, setQrCode] = useState<string>('');

    const [getAccountWithId] = useLazyGetAccountWithIdQuery();
    const [memberZtksConfirmTakeMoney] = useMemberZtksConfirmTakeMoneyMutation();
    const [getBankWithId] = useLazyGetBankWithIdQuery();
    const [getRequireWithId] = useLazyGetRequireWithIdQuery();

    useEffect(() => {
        getAccountWithId({ id: requireTakeMoney.accountId })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setReqUser(resData.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [getAccountWithId, requireTakeMoney]);

    const handleTextIsDo = () => {
        if (requireTakeMoney.isDo) {
            return { text: 'Đã chuyển tiền', style: style.do };
        } else {
            return { text: 'Chưa chuyển tiền', style: style.notDo };
        }
    };

    const handleReceive = () => {
        if (!account) return;

        dispatch(set_isLoading(true));
        memberZtksConfirmTakeMoney({ requireTakeMoneyId: requireTakeMoney.id, memberZtksId: account.id })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setRequireTakeMoney(resData.data);
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: 'Xác nhận thành không !',
                        })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Xác nhận không thành không !',
                        })
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    };

    const handleIsShowPay = (isShow: boolean) => {
        setIsShowPay(isShow);
    };

    useEffect(() => {
        if (!payContent_element.current) return;
        const payContentElement = payContent_element.current;
        if (isShowPay) {
            payContentElement.classList.add(style.show);
        } else {
            payContentElement.classList.remove(style.show);
        }
    }, [isShowPay]);

    useEffect(() => {
        if (!requireTakeMoney.memberZtksId) return;
        const content = `ztksPayjtakeMoneyj${requireTakeMoney.id}j${requireTakeMoney.walletId}j${requireTakeMoney.accountId}j${requireTakeMoney.bankId}`;

        getBankWithId({ id: requireTakeMoney.bankId })
            .then((res) => {
                const resData = res.data;
                console.log('getBankWithId', resData);
                if (resData?.isSuccess && resData.data) {
                    const bank = resData.data;
                    const qrUrl = `https://img.vietqr.io/image/${bank.bankCode}-${bank.accountNumber}-compact2.png?amount=${requireTakeMoney.amount - 5000}&addInfo=${content}&accountName=${bank.accountName}`;
                    setQrCode(qrUrl);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [getBankWithId, requireTakeMoney]);

    const handleReload = () => {
        dispatch(set_isLoading(true));
        getRequireWithId({ id: requireTakeMoney.id })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setRequireTakeMoney(resData.data);
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: 'Tải lại thành không !',
                        })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Tải lại không thành không !',
                        })
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    setData_toastMessage({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    };

    return (
        <div className={style.parent}>
            <div className={style.overview}>
                <div className={style.index}>{index + 1}</div>
                <div className={style.money}>{formatMoney(requireTakeMoney.amount)}</div>
                <div className={style.account}>
                    {reqUser && <div>{`${reqUser.firstName} ${reqUser.lastName}`}</div>}
                </div>
                <div className={`${style.isDo} ${handleTextIsDo().style}`}>{handleTextIsDo().text}</div>
                <div className={style.doTime}>
                    {requireTakeMoney.doTime && <div>{detailTime(requireTakeMoney.doTime)}</div>}
                </div>
                <div className={style.btn}>
                    {!requireTakeMoney.memberZtksId && (
                        <div className={style.button} onClick={() => handleReceive()}>
                            {RECEIVE}
                        </div>
                    )}
                    {requireTakeMoney.memberZtksId && <div className={style.txt}>{RECEIVED}</div>}
                </div>
            </div>
            {requireTakeMoney.memberZtksId && (
                <div className={style.detail}>
                    <div className={style.header}>
                        <div>
                            <IoReloadCircleSharp onClick={() => handleReload()} size={25} />
                            {!isShowPay && <FiChevronDown onClick={() => handleIsShowPay(true)} size={25} />}
                            {isShowPay && <FiChevronUp onClick={() => handleIsShowPay(false)} size={25} />}
                        </div>
                    </div>
                    <div className={style.content} ref={payContent_element}>
                        {!requireTakeMoney.isDo && <img src={qrCode} alt="QR Code" />}
                        {requireTakeMoney.isDo && <div>Đã chuyển thành công</div>}
                    </div>
                </div>
            )}
        </div>
    );
};

export default memo(One);
