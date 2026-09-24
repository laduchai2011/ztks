import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { Account_Field, Recommend_Field } from '@src/data_struct/account';
import { Wallet_Field, Wallet_Enum } from '@src/data_struct/wallet';
import { use_add_Your_Recommend_Mutation, useLazy_get_My_Recommend_Query } from '@src/redux/query/account_RTK';
import { AGREE } from '@src/const/text';
import { set__is_loading, set__data__toast_message } from '@src/redux/slice/Wallet';
import { messageType_enum } from '@src/component/ToastMessage/type';

const AddRecommend: FC<{ wallet: Wallet_Field }> = ({ wallet }) => {
    const dispatch = useDispatch<AppDispatch>();
    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);

    const [code, set__code] = useState<string>('');
    const [recommend, set__recommend] = useState<Recommend_Field | undefined>(undefined);

    const [add_Your_Recommend] = use_add_Your_Recommend_Mutation();
    const [get_My_Recommend] = useLazy_get_My_Recommend_Query();

    useEffect(() => {
        if (!account) return;
        get_My_Recommend({ account_id: account.id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__recommend(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [account, get_My_Recommend]);

    const handle_Code = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__code(value);
    };

    const handle_Agree = () => {
        if (!account) return;
        dispatch(set__is_loading(true));
        add_Your_Recommend({ your_code: code.trim(), account_id: account.id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data?.your_code) {
                    window.location.reload();
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Nhập mã giới thiệu thất bại !',
                        })
                    );
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    };

    if (wallet.type === Wallet_Enum.ONE && recommend?.your_code === null) {
        return (
            <div className={style.parent}>
                <div className={style.main}>
                    <input value={code} onChange={(e) => handle_Code(e)} placeholder="Nhập mã giới thiệu" />
                    <div onClick={() => handle_Agree()}>{AGREE}</div>
                </div>
            </div>
        );
    }
    if (wallet.type === Wallet_Enum.TWO) {
        return;
    }
};

export default memo(AddRecommend);
