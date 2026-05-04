import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { FaRegEye, FaEyeSlash } from 'react-icons/fa';
import { GoDotFill } from 'react-icons/go';
import { IoMdSettings } from 'react-icons/io';
import { SETTING } from '@src/const/text';
import { route_enum } from '@src/router/type';
import { AccountField } from '@src/dataStruct/account';
import { ZaloOaField, ZaloAppField } from '@src/dataStruct/zalo';
import { isProduct } from '@src/const/api/baseUrl';
import { getSocket } from '@src/socketIo';
import {
    useLazyGetZaloOaTokenWithFkQuery,
    useCreateZaloOaTokenMutation,
    useUpdateRefreshTokenOfZaloOaMutation,
} from '@src/redux/query/zaloRTK';
import { setData_toastMessage, set_isLoading } from '@src/redux/slice/Oa';
import { messageType_enum } from '@src/component/ToastMessage/type';

const MyOa: FC<{ index: number; data: ZaloOaField }> = ({ index, data }) => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);

    const [isShow_id, setIsShow_id] = useState(false);
    const [isShow_secret, setIsShow_secret] = useState(false);

    const [getZaloOaTokenWithFk] = useLazyGetZaloOaTokenWithFkQuery();
    const [createZaloOaToken] = useCreateZaloOaTokenMutation();
    const [updateRefreshTokenOfZaloOa] = useUpdateRefreshTokenOfZaloOaMutation();

    useEffect(() => {
        if (!account) return;
        const socket = getSocket();

        const onRefreshTokenZalo = async (payload: any) => {
            const accountId = Number(payload.accountId);
            const zaloOaId = Number(payload.zaloOaId);
            const token = payload.token;

            console.log('onRefreshTokenZalo', payload);

            if (data.id === zaloOaId && accountId === account.id) {
                try {
                    dispatch(set_isLoading(true));
                    const res_get = await getZaloOaTokenWithFk({ zaloOaId: zaloOaId, accountId: accountId });
                    const resData_get = res_get.data;
                    console.log('resData_get', resData_get);
                    if (resData_get?.isSuccess && resData_get.data) {
                        const res_update = await updateRefreshTokenOfZaloOa({
                            zaloOaId: zaloOaId,
                            accountId: accountId,
                            refreshToken: token.refresh_token,
                        });
                        const resData_update = res_update.data;
                        if (resData_update?.isSuccess && resData_update.data) {
                            dispatch(
                                setData_toastMessage({
                                    type: messageType_enum.SUCCESS,
                                    message: `Lấy token trên zalo oa ( ${data.oaName} ) thành công !`,
                                })
                            );
                        } else {
                            dispatch(
                                setData_toastMessage({
                                    type: messageType_enum.ERROR,
                                    message: `Lấy token trên zalo oa ( ${data.oaName} ) KHÔNG thành công !`,
                                })
                            );
                        }
                    } else {
                        const res_create = await createZaloOaToken({
                            zaloOaId: zaloOaId,
                            accountId: accountId,
                            refreshToken: token.refresh_token,
                        });
                        const resData_create = res_create.data;
                        if (resData_create?.isSuccess && resData_create.data) {
                            dispatch(
                                setData_toastMessage({
                                    type: messageType_enum.SUCCESS,
                                    message: `Lấy token trên zalo oa ( ${data.oaName} ) thành công !`,
                                })
                            );
                        } else {
                            dispatch(
                                setData_toastMessage({
                                    type: messageType_enum.ERROR,
                                    message: `Lấy token trên zalo oa ( ${data.oaName} ) KHÔNG thành công !`,
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
            }
        };

        socket.on('refreshTokenZalo', onRefreshTokenZalo);

        return () => {
            socket.off('refreshTokenZalo', onRefreshTokenZalo);
        };
    }, [dispatch, account, data, getZaloOaTokenWithFk, createZaloOaToken, updateRefreshTokenOfZaloOa]);

    const handleShow_id = (isShow: boolean) => {
        setIsShow_id(isShow);
    };

    const handleShow_secret = (isShow: boolean) => {
        setIsShow_secret(isShow);
    };

    const gotoSetting = () => {
        navigate(route_enum.OA_SETTING + '/' + `${data.id}`);
    };

    const handleTakeToken = () => {
        if (!account) return;
        if (!zaloApp) return;

        const redirectUrl = isProduct
            ? process.env.ZALO_REDIRECT_URI
            : 'https://zalowebhookdev.5kaquarium.com/zalo/tokenCallback';

        // const state = `${zaloApp.appId}@${zaloApp.appSecret}@${data.id}@${account.id}`;

        // const url = `https://oauth.zaloapp.com/v4/oa/permission?app_id=${zaloApp.appId}&redirect_uri=${redirectUrl}&state=${state}`;

        const url = `https://oauth.zaloapp.com/v4/oa/permission?app_id=${zaloApp.appId}&redirect_uri=${redirectUrl}`;

        window.open(url, '_blank');
    };

    return (
        <div className={style.parent}>
            <div className={style.index}>
                <div>{index}</div>
            </div>
            <div className={style.main}>
                <div>
                    <div className={style.label}>{data.label}</div>
                    <div>
                        <div>
                            <div>Tên OA</div>
                            <div>{data.oaName}</div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div>
                                <div>Định danh OA</div>
                                <div>
                                    {isShow_id && <FaRegEye onClick={() => handleShow_id(false)} />}
                                    {!isShow_id && <FaEyeSlash onClick={() => handleShow_id(true)} />}
                                </div>
                            </div>
                            <div>
                                {isShow_id && <div>{data.oaId}</div>}
                                {!isShow_id && (
                                    <div>
                                        <GoDotFill /> <GoDotFill /> <GoDotFill /> <GoDotFill /> <GoDotFill />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div>
                        <div>
                            <div>
                                <div>Khóa OA</div>
                                <div>
                                    {isShow_secret && <FaRegEye onClick={() => handleShow_secret(false)} />}
                                    {!isShow_secret && <FaEyeSlash onClick={() => handleShow_secret(true)} />}
                                </div>
                            </div>
                            <div>
                                {isShow_secret && <div>{data.oaSecret}</div>}
                                {!isShow_secret && (
                                    <div>
                                        <GoDotFill /> <GoDotFill /> <GoDotFill /> <GoDotFill /> <GoDotFill />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className={style.btnContainer}>
                        <div className={style.refresh} onClick={() => handleTakeToken()}>
                            Lấy token mới
                        </div>
                        <div className={style.setting}>
                            <IoMdSettings onClick={() => gotoSetting()} size={25} title={SETTING} />
                        </div>
                    </div>
                    <div className={style.warn}>Thông tin không được để lộ</div>
                </div>
            </div>
        </div>
    );
};

export default memo(MyOa);
