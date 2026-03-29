import { memo, useState } from 'react';
import style from './style.module.scss';
import { useSelector } from 'react-redux';
import { RootState } from '@src/redux';
import { FaRegEye, FaEyeSlash } from 'react-icons/fa';
import { GoDotFill } from 'react-icons/go';
// import { useGetZaloAppWithAccountIdQuery } from '@src/redux/query/zaloRTK';
// import { AccountInformationField } from '@src/dataStruct/account';
import { ZaloAppField } from '@src/dataStruct/zalo';
// import { messageType_enum } from '@src/component/ToastMessage/type';
// import { set_isLoading, setData_toastMessage } from '@src/redux/slice/Oa';

const OaApp = () => {
    // const dispatch = useDispatch<AppDispatch>();
    // const accountInformation: AccountInformationField | undefined = useSelector(
    //     (state: RootState) => state.AppSlice.accountInformation
    // );
    // const myAdmin: number | undefined = useSelector((state: RootState) => state.AppSlice.myAdmin);
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);
    const [isShow_id, setIsShow_id] = useState(false);
    const [isShow_secret, setIsShow_secret] = useState(false);
    // const [zaloApp, setZaloApp] = useState<ZaloAppField | undefined>(undefined);

    // const {
    //     data: data_zaloApp,
    //     // isFetching,
    //     isLoading: isLoading_zaloApp,
    //     isError: isError_zaloApp,
    //     error: error_zaloApp,
    // } = useGetZaloAppWithAccountIdQuery(
    //     { role: accountInformation?.accountType || '', accountId: myAdmin || 0 },
    //     { skip: myAdmin === undefined || accountInformation === undefined }
    // );
    // useEffect(() => {
    //     if (isError_zaloApp && error_zaloApp) {
    //         console.error(error_zaloApp);
    //         dispatch(
    //             setData_toastMessage({
    //                 type: messageType_enum.ERROR,
    //                 message: 'Lấy dữ liệu zalo-app KHÔNG thành công !',
    //             })
    //         );
    //     }
    // }, [dispatch, isError_zaloApp, error_zaloApp]);
    // useEffect(() => {
    //     dispatch(set_isLoading(isLoading_zaloApp));
    // }, [dispatch, isLoading_zaloApp]);
    // useEffect(() => {
    //     const resData = data_zaloApp;
    //     if (resData?.isSuccess && resData.data) {
    //         setZaloApp(resData.data);
    //     }
    // }, [data_zaloApp]);

    const handleShow_id = (isShow: boolean) => {
        setIsShow_id(isShow);
    };

    const handleShow_secret = (isShow: boolean) => {
        setIsShow_secret(isShow);
    };

    return (
        <div className={style.parent}>
            <div>
                <div className={style.label}>{zaloApp?.label}</div>
                <div>
                    <div>
                        <div>Tên ứng dụng</div>
                        <div>{zaloApp?.appName}</div>
                    </div>
                </div>
                <div>
                    <div>
                        <div>
                            <div>Định danh ứng dụng</div>
                            <div>
                                {isShow_id && <FaRegEye onClick={() => handleShow_id(false)} />}
                                {!isShow_id && <FaEyeSlash onClick={() => handleShow_id(true)} />}
                            </div>
                        </div>
                        <div>
                            {isShow_id && <div>{zaloApp?.appId}</div>}
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
                            <div>Khóa ứng dụng</div>
                            <div>
                                {isShow_secret && <FaRegEye onClick={() => handleShow_secret(false)} />}
                                {!isShow_secret && <FaEyeSlash onClick={() => handleShow_secret(true)} />}
                            </div>
                        </div>
                        <div>
                            {isShow_secret && <div>{zaloApp?.appSecret}</div>}
                            {!isShow_secret && (
                                <div>
                                    <GoDotFill /> <GoDotFill /> <GoDotFill /> <GoDotFill /> <GoDotFill />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className={style.warn}>Thông tin không được để lộ</div>
            </div>
        </div>
    );
};

export default memo(OaApp);
