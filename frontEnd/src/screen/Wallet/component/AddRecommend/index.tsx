import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { AccountField, RecommendField } from '@src/dataStruct/account';
import { WalletField, WalletEnum } from '@src/dataStruct/wallet';
import { useAddYourRecommendMutation, useLazyGetMyRecommendQuery } from '@src/redux/query/accountRTK';
import { AGREE } from '@src/const/text';
import { set_isLoading, setData_toastMessage } from '@src/redux/slice/Wallet';
import { messageType_enum } from '@src/component/ToastMessage/type';

const AddRecommend: FC<{ wallet: WalletField }> = ({ wallet }) => {
    const dispatch = useDispatch<AppDispatch>();
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);

    const [code, setCode] = useState<string>('');
    const [recommend, setRecommend] = useState<RecommendField | undefined>(undefined);

    const [addYourRecommend] = useAddYourRecommendMutation();
    const [getMyRecommend] = useLazyGetMyRecommendQuery();

    useEffect(() => {
        console.log('recommend', recommend);
    }, [recommend]);

    useEffect(() => {
        if (!account) return;
        getMyRecommend({ accountId: account.id })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setRecommend(resData.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [account, getMyRecommend]);

    const handleCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setCode(value);
    };

    const handleAgree = () => {
        if (!account) return;
        dispatch(set_isLoading(true));
        addYourRecommend({ yourCode: code.trim(), accountId: account.id })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data?.yourCode) {
                    window.location.reload();
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Nhập mã giới thiệu thất bại !',
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

    if (wallet.type === WalletEnum.ONE && recommend?.yourCode === null) {
        return (
            <div className={style.parent}>
                <div className={style.main}>
                    <input value={code} onChange={(e) => handleCode(e)} placeholder="Nhập mã giới thiệu" />
                    <div onClick={() => handleAgree()}>{AGREE}</div>
                </div>
            </div>
        );
    }
    if (wallet.type === WalletEnum.TWO) {
        return;
    }
};

export default memo(AddRecommend);
