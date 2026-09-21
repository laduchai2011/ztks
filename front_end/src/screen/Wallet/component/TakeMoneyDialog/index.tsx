import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT, CHOOSE } from '@src/const/text';
import {
    setData_toastMessage,
    set_isLoading,
    setIsShow_takeMoneyDialog,
    setNewRequireTakeMoney_takeMoneyDialog,
    setRequiredTakeMoney_takeMoneyDialog,
} from '@src/redux/slice/Wallet';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { useLazyGetAllBanksQuery, useLazyGetBankWithIdQuery } from '@src/redux/query/bankRTK';
import { useCreateRequireTakeMoneyMutation, useEditRequireTakeMoneyMutation } from '@src/redux/query/walletRTK';
import { BankField } from '@src/dataStruct/bank';
import { RequireTakeMoneyField, WalletField, WalletEnum } from '@src/dataStruct/wallet';
import { isPositiveInteger, formatMoney } from '@src/utility/string';

const TakeMoneyDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const isShow: boolean = useSelector((state: RootState) => state.WalletSlice.takeMoneyDialog.isShow);
    const wallet: WalletField | undefined = useSelector((state: RootState) => state.WalletSlice.takeMoneyDialog.wallet);
    const requireTakeMoney: RequireTakeMoneyField | undefined = useSelector(
        (state: RootState) => state.WalletSlice.takeMoneyDialog.requiredTakeMoney
    );

    const [title, setTitle] = useState<string>('Tạo yêu cầu rút tiền mới');
    const [amount, setAmount] = useState<string>('');
    const [isFormattingMoney, setIsFormattingMoney] = useState(false);
    const [amountText, setAmountText] = useState<string>('');
    const [allBanks, setAllBanks] = useState<BankField[]>([]);
    const [selectedBank, setSelectedBank] = useState<BankField | undefined>(undefined);

    const [getAllBanks] = useLazyGetAllBanksQuery();
    const [getBankWithId] = useLazyGetBankWithIdQuery();
    const [createRequireTakeMoney] = useCreateRequireTakeMoneyMutation();
    const [editRequireTakeMoney] = useEditRequireTakeMoneyMutation();

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
        if (!wallet) return;
        if (requireTakeMoney) {
            setTitle(`Chỉnh sửa yêu cầu rút tiền trên ví ${wallet.type}`);
            setAmount(requireTakeMoney.amount.toString());
        } else {
            setTitle(`Tạo yêu cầu rút tiền mới trên ví ${wallet.type}`);
            setAmount('');
        }
    }, [requireTakeMoney, wallet]);

    useEffect(() => {
        dispatch(set_isLoading(true));
        getAllBanks({ accountId: -1 })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setAllBanks(resData.data);
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    }, [getAllBanks, dispatch]);

    useEffect(() => {
        if (!requireTakeMoney) return;

        dispatch(set_isLoading(true));
        getBankWithId({ id: requireTakeMoney.bankId })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setSelectedBank(resData.data);
                }
            })
            .catch((err) => {
                console.error(err);
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    }, [getBankWithId, dispatch, requireTakeMoney]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        const raw = value.replace(/\D/g, '');
        setAmount(raw);
        setAmountText('');
    };

    const handleSelectBank = (item: BankField) => {
        setSelectedBank(item);
    };

    const handleClose = () => {
        dispatch(setIsShow_takeMoneyDialog(false));
    };

    const handleAgree = () => {
        if (!wallet) return;

        if (wallet.type === WalletEnum.ONE) {
            dispatch(
                setData_toastMessage({
                    message: `Không thể rút tiền từ ví ${wallet.type}`,
                    type: messageType_enum.WARN,
                })
            );
            return;
        }

        if (!isPositiveInteger(amount)) {
            setAmountText('Tiền phải là số nguyên dương');
            return;
        }

        if (Number(amount.trim()) < 5000) {
            setAmountText(`Tiền bạn yêu cầu không thể nhỏ hơn ${formatMoney(5000)}`);
            return;
        }

        if (Number(amount.trim()) > wallet.amount) {
            setAmountText('Tiền bạn yêu cầu lớn hơn trong ví của bạn');
            return;
        }

        if (!selectedBank) {
            dispatch(
                setData_toastMessage({
                    message: 'Chưa ngân hàng nào được chọn',
                    type: messageType_enum.WARN,
                })
            );
            return;
        }

        let txt: string = '';
        if (requireTakeMoney) {
            txt = 'Chỉnh sửa';
            dispatch(set_isLoading(true));
            editRequireTakeMoney({
                requireTakeMoneyId: requireTakeMoney.id,
                amount: Number(amount.trim()),
                bankId: selectedBank.id,
                walletId: wallet.id,
                accountId: -1,
            })
                .then((res) => {
                    const resData = res.data;
                    if (resData?.isSuccess && resData.data) {
                        dispatch(setNewRequireTakeMoney_takeMoneyDialog(resData.data));
                        dispatch(
                            setData_toastMessage({
                                message: `${txt} thành công`,
                                type: messageType_enum.SUCCESS,
                            })
                        );
                    } else {
                        dispatch(
                            setData_toastMessage({
                                message: `${txt} không thành công`,
                                type: messageType_enum.ERROR,
                            })
                        );
                    }
                })
                .catch((err) => {
                    dispatch(
                        setData_toastMessage({
                            message: 'Đã có lỗi xảy ra',
                            type: messageType_enum.ERROR,
                        })
                    );
                    console.error(err);
                })
                .finally(() => {
                    dispatch(set_isLoading(false));
                });
        } else {
            txt = 'Tạo';
            dispatch(set_isLoading(true));
            createRequireTakeMoney({
                amount: Number(amount.trim()),
                bankId: selectedBank.id,
                walletId: wallet.id,
                accountId: -1,
            })
                .then((res) => {
                    const resData = res.data;
                    if (resData?.isSuccess && resData.data) {
                        dispatch(setNewRequireTakeMoney_takeMoneyDialog(resData.data));
                        dispatch(setRequiredTakeMoney_takeMoneyDialog(resData.data));
                        dispatch(
                            setData_toastMessage({
                                message: `${txt} thành công`,
                                type: messageType_enum.SUCCESS,
                            })
                        );
                    } else {
                        dispatch(
                            setData_toastMessage({
                                message: `${txt} không thành công`,
                                type: messageType_enum.ERROR,
                            })
                        );
                    }
                })
                .catch((err) => {
                    dispatch(
                        setData_toastMessage({
                            message: 'Đã có lỗi xảy ra',
                            type: messageType_enum.ERROR,
                        })
                    );
                    console.error(err);
                })
                .finally(() => {
                    dispatch(set_isLoading(false));
                });
        }
    };

    const list_bank = allBanks.map((item, index) => {
        return (
            <div className={style.oneBank} key={index} onClick={() => handleSelectBank(item)}>
                <div>
                    <div>{item.bankCode}</div>
                    <div>{item.accountNumber}</div>
                    <div>{item.accountName}</div>
                </div>
                <div>
                    <div>{CHOOSE}</div>
                </div>
            </div>
        );
    });

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.title}>{title}</div>
                    <div className={style.inputContainer}>
                        <div className={style.inputBox}>
                            <input
                                value={isFormattingMoney && amount ? formatMoney(amount) : amount}
                                onChange={(e) => handleAmountChange(e)}
                                onFocus={() => setIsFormattingMoney(false)}
                                onBlur={() => setIsFormattingMoney(true)}
                                placeholder="Nhập số tiền cần rút"
                            />
                        </div>
                        {amountText && <div className={style.amountText}>{amountText}</div>}
                    </div>
                    {selectedBank && (
                        <div className={style.selectedBank}>
                            <div>{selectedBank.bankCode}</div>
                            <div>{selectedBank.accountNumber}</div>
                            <div>{selectedBank.accountName}</div>
                        </div>
                    )}
                    <div className={style.bankList}>{list_bank}</div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handleAgree()}>{AGREE}</button>
                    <button onClick={() => handleClose()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(TakeMoneyDialog);
