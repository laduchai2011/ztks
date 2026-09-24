import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT } from '@src/const/text';
import {
    set__is_loading,
    set__data__toast_message,
    set__is_show__take_token_dialog,
    set__zalo_oa__take_token_dialog,
} from '@src/redux/slice/Oa_Setting';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { Account_Field } from '@src/data_struct/account';
import { Zalo_App_Field, Zalo_Oa_Field, Gen_Zalo_Oa_Token_Result_Field } from '@src/data_struct/zalo';
import {
    use_gen_Zalo_Oa_Token_Mutation,
    useLazy_get_Zalo_Oa_Token_With_Fk_Query,
    use_create_Zalo_Oa_Token_Mutation,
    use_update_Refresh_Token_Of_Zalo_Oa_Mutation,
} from '@src/redux/query/zalo_RTK';
import { isProduct } from '@src/const/api/base_url';

const TakeTokenDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const zalo_app: Zalo_App_Field | undefined = useSelector((state: RootState) => state.App_Slice.zalo_app);
    const zalo_oa: Zalo_Oa_Field | undefined = useSelector(
        (state: RootState) => state.Oa_Setting_Slice.take_token_dialog.zalo_oa
    );
    const is_show: boolean = useSelector((state: RootState) => state.Oa_Setting_Slice.take_token_dialog.is_show);

    const [code, set__code] = useState<string>('');
    const [token_result, set__token_result] = useState<Gen_Zalo_Oa_Token_Result_Field | undefined>(undefined);
    const [noti, set__noti] = useState<string>('');

    const [gen_Zalo_Oa_Token] = use_gen_Zalo_Oa_Token_Mutation();
    const [get_Zalo_Oa_Token_With_Fk] = useLazy_get_Zalo_Oa_Token_With_Fk_Query();
    const [create_Zalo_Oa_Token] = use_create_Zalo_Oa_Token_Mutation();
    const [update_Refresh_Token_Of_Zalo_Oa] = use_update_Refresh_Token_Of_Zalo_Oa_Mutation();

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

    const handle_Close = () => {
        dispatch(set__is_show__take_token_dialog(false));
        dispatch(set__zalo_oa__take_token_dialog(undefined));
    };

    const handle_Take_Code = () => {
        if (!zalo_app) return;

        const redirect_url = isProduct
            ? process.env.ZALO_REDIRECT_URI
            : 'https://zalowebhookdev.taokosao.com/zalo/tokenCallback';

        const url = `https://oauth.zaloapp.com/v4/oa/permission?app_id=${zalo_app.app_id}&redirect_uri=${redirect_url}`;
        window.open(url, '_blank');
    };

    const handle_Change_Code = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__code(e.target.value);
    };

    const handle_Send_Code = () => {
        if (!zalo_app) return;

        const code_t = code.trim();
        if (code_t.length === 0) {
            dispatch(set__data__toast_message({ type: messageType_enum.ERROR, message: 'Mã không được để trống !' }));
            return;
        }

        set__noti('');
        dispatch(set__is_loading(true));
        gen_Zalo_Oa_Token({ app_id: zalo_app.app_id, app_secret: zalo_app.app_secret, code: code_t })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__token_result(res_data.data);
                    set__noti('Bạn đã gửi mã thành công, hãy đồng ý để hoàn tất cập nhật');
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.SUCCESS,
                            message: 'Gửi mã thành công !',
                        })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Gửi mã thất bại !',
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

    const handle_Agree = async () => {
        if (!zalo_oa) return;
        if (!account) return;
        if (!token_result) return;

        try {
            dispatch(set__is_loading(true));
            const res_get = await get_Zalo_Oa_Token_With_Fk({ zalo_oa_id: zalo_oa.id, account_id: account.id });
            const res_data_get = res_get.data;
            if (res_data_get?.is_success && res_data_get.data) {
                const res_update = await update_Refresh_Token_Of_Zalo_Oa({
                    zalo_oa_id: zalo_oa.id,
                    account_id: account.id,
                    refresh_token: token_result.refresh_token,
                });
                const res_data_update = res_update.data;
                if (res_data_update?.is_success && res_data_update.data) {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.SUCCESS,
                            message: `Cập nhật token trên zalo oa ( ${zalo_oa.oa_name} ) thành công !`,
                        })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: `Cập nhật token trên zalo oa ( ${zalo_oa.oa_name} ) KHÔNG thành công !`,
                        })
                    );
                }
            } else {
                const res_create = await create_Zalo_Oa_Token({
                    zalo_oa_id: zalo_oa.id,
                    account_id: account.id,
                    refresh_token: token_result.refresh_token,
                });
                const res_data_create = res_create.data;
                if (res_data_create?.is_success && res_data_create.data) {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.SUCCESS,
                            message: `Cập nhật token trên zalo oa ( ${zalo_oa.oa_name} ) thành công !`,
                        })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: `Cập nhật token trên zalo oa ( ${zalo_oa.oa_name} ) KHÔNG thành công !`,
                        })
                    );
                }
            }
        } catch (error) {
            console.error(error);
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Đã có lỗi xảy ra !',
                })
            );
        } finally {
            dispatch(set__is_loading(false));
        }
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.header}>{`Lấy token cho zalo oa ${zalo_oa?.oa_name}`}</div>
                <div className={style.contentContainer}>
                    <div className={style.takeCode}>
                        <div onClick={() => handle_Take_Code()}>Lấy mã</div>
                    </div>
                    <div className={style.sendCodeContainer}>
                        <input value={code} onChange={(e) => handle_Change_Code(e)} />
                        <div>
                            <div onClick={() => handle_Send_Code()}>Gửi mã</div>
                        </div>
                    </div>
                </div>
                <div className={style.notiContainer}>{noti.length > 0 && <div>{noti}</div>}</div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handle_Agree()}>{AGREE}</button>
                    <button onClick={() => handle_Close()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(TakeTokenDialog);
