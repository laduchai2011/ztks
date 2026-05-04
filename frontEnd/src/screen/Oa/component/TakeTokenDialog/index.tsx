import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT } from '@src/const/text';
import {
    set_isLoading,
    setData_toastMessage,
    setIsShow_takeTokenDialog,
    setZaloOa_takeTokenDialog,
} from '@src/redux/slice/Oa';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { AccountField } from '@src/dataStruct/account';
import { ZaloAppField, ZaloOaField, GenZaloOaTokenResultField } from '@src/dataStruct/zalo';
import {
    useGenZaloOaTokenMutation,
    useLazyGetZaloOaTokenWithFkQuery,
    useCreateZaloOaTokenMutation,
    useUpdateRefreshTokenOfZaloOaMutation,
} from '@src/redux/query/zaloRTK';
import { isProduct } from '@src/const/api/baseUrl';

const TakeTokenDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);
    const zaloOa: ZaloOaField | undefined = useSelector((state: RootState) => state.OaSlice.takeTokenDialog.zaloOa);
    const isShow: boolean = useSelector((state: RootState) => state.OaSlice.takeTokenDialog.isShow);

    const [code, setCode] = useState<string>('');
    const [tokenResult, setTokenResult] = useState<GenZaloOaTokenResultField | undefined>(undefined);
    const [noti, setNoti] = useState<string>('');

    const [genZaloOaToken] = useGenZaloOaTokenMutation();
    const [getZaloOaTokenWithFk] = useLazyGetZaloOaTokenWithFkQuery();
    const [createZaloOaToken] = useCreateZaloOaTokenMutation();
    const [updateRefreshTokenOfZaloOa] = useUpdateRefreshTokenOfZaloOaMutation();

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

    const handleClose = () => {
        dispatch(setIsShow_takeTokenDialog(false));
        dispatch(setZaloOa_takeTokenDialog(undefined));
    };

    const handleTakeCode = () => {
        if (!zaloApp) return;

        const redirectUrl = isProduct
            ? process.env.ZALO_REDIRECT_URI
            : 'https://zalowebhookdev.5kaquarium.com/zalo/tokenCallback';

        const url = `https://oauth.zaloapp.com/v4/oa/permission?app_id=${zaloApp.appId}&redirect_uri=${redirectUrl}`;
        window.open(url, '_blank');
    };

    const handleChangeCode = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value);
    };

    const handleSendCode = () => {
        if (!zaloApp) return;

        const code_t = code.trim();
        if (code_t.length === 0) {
            dispatch(setData_toastMessage({ type: messageType_enum.ERROR, message: 'Mã không được để trống !' }));
            return;
        }

        setNoti('');
        dispatch(set_isLoading(true));
        genZaloOaToken({ appId: zaloApp.appId, appSecret: zaloApp.appSecret, code: code_t })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setTokenResult(resData.data);
                    setNoti('Bạn đã gửi mã thành công, hãy đồng ý để hoàn tất cập nhật');
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: 'Gửi mã thành công !',
                        })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Gửi mã thất bại !',
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

    const handleAgree = async () => {
        if (!zaloOa) return;
        if (!account) return;
        if (!tokenResult) return;

        try {
            dispatch(set_isLoading(true));
            const res_get = await getZaloOaTokenWithFk({ zaloOaId: zaloOa.id, accountId: account.id });
            const resData_get = res_get.data;
            if (resData_get?.isSuccess && resData_get.data) {
                const res_update = await updateRefreshTokenOfZaloOa({
                    zaloOaId: zaloOa.id,
                    accountId: account.id,
                    refreshToken: tokenResult.refresh_token,
                });
                const resData_update = res_update.data;
                if (resData_update?.isSuccess && resData_update.data) {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: `Cập nhật token trên zalo oa ( ${zaloOa.oaName} ) thành công !`,
                        })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: `Cập nhật token trên zalo oa ( ${zaloOa.oaName} ) KHÔNG thành công !`,
                        })
                    );
                }
            } else {
                const res_create = await createZaloOaToken({
                    zaloOaId: zaloOa.id,
                    accountId: account.id,
                    refreshToken: tokenResult.refresh_token,
                });
                const resData_create = res_create.data;
                if (resData_create?.isSuccess && resData_create.data) {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: `Cập nhật token trên zalo oa ( ${zaloOa.oaName} ) thành công !`,
                        })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: `Cập nhật token trên zalo oa ( ${zaloOa.oaName} ) KHÔNG thành công !`,
                        })
                    );
                }
            }
        } catch (error) {
            console.error(error);
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Đã có lỗi xảy ra !',
                })
            );
        } finally {
            dispatch(set_isLoading(false));
        }
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.header}>{`Lấy token cho zalo oa ${zaloOa?.oaName}`}</div>
                <div className={style.contentContainer}>
                    <div className={style.takeCode}>
                        <div onClick={() => handleTakeCode()}>Lấy mã</div>
                    </div>
                    <div className={style.sendCodeContainer}>
                        <input value={code} onChange={(e) => handleChangeCode(e)} />
                        <div>
                            <div onClick={() => handleSendCode()}>Gửi mã</div>
                        </div>
                    </div>
                </div>
                <div className={style.notiContainer}>{noti.length > 0 && <div>{noti}</div>}</div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handleAgree()}>{AGREE}</button>
                    <button onClick={() => handleClose()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(TakeTokenDialog);
