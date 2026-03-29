import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { FaRegEye, FaEyeSlash } from 'react-icons/fa';
import { GoDotFill } from 'react-icons/go';
import { useGetZaloOaWithIdQuery } from '@src/redux/query/zaloRTK';
import { AccountInformationField } from '@src/dataStruct/account';
import { ZaloOaField } from '@src/dataStruct/zalo';
import { set_zaloOa, set_isLoading, setData_toastMessage } from '@src/redux/slice/OaSetting';
import { messageType_enum } from '@src/component/ToastMessage/type';

const MyOa = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();
    const accountInformation: AccountInformationField | undefined = useSelector(
        (state: RootState) => state.AppSlice.accountInformation
    );
    const zaloOa: ZaloOaField | undefined = useSelector((state: RootState) => state.OaSettingSlice.zaloOa);
    const [isShow_id, setIsShow_id] = useState(false);
    const [isShow_secret, setIsShow_secret] = useState(false);

    const {
        data: data_zaloOa,
        // isFetching,
        isLoading: isLoading_zaloOa,
        isError: isError_zaloOa,
        error: error_zaloOa,
    } = useGetZaloOaWithIdQuery(
        { id: Number(id) || -1, accountId: accountInformation?.addedById || -1 },
        { skip: id === undefined || accountInformation === undefined }
    );
    useEffect(() => {
        if (isError_zaloOa && error_zaloOa) {
            console.error(error_zaloOa);
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.SUCCESS,
                    message: 'Lấy dữ liệu OA KHÔNG thành công !',
                })
            );
        }
    }, [dispatch, isError_zaloOa, error_zaloOa]);
    useEffect(() => {
        dispatch(set_isLoading(isLoading_zaloOa));
    }, [dispatch, isLoading_zaloOa]);
    useEffect(() => {
        const resData = data_zaloOa;
        if (resData?.isSuccess && resData.data) {
            // setZaloOa(resData.data);
            dispatch(set_zaloOa(resData.data));
        }
    }, [dispatch, data_zaloOa]);

    const handleShow_id = (isShow: boolean) => {
        setIsShow_id(isShow);
    };

    const handleShow_secret = (isShow: boolean) => {
        setIsShow_secret(isShow);
    };

    return (
        <div className={style.parent}>
            <div>
                <div className={style.label}>label</div>
                <div>
                    <div>
                        <div>Tên OA</div>
                        <div>{zaloOa?.oaName}</div>
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
                            {isShow_id && <div>{zaloOa?.oaId}</div>}
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
                            {isShow_secret && <div>{zaloOa?.oaSecret}</div>}
                            {!isShow_secret && (
                                <div>
                                    <GoDotFill /> <GoDotFill /> <GoDotFill /> <GoDotFill /> <GoDotFill />
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className={style.btnContainer}>
                    <div className={style.refresh}>Lấy token mới</div>
                </div>
                <div className={style.warn}>Thông tin không được để lộ</div>
            </div>
        </div>
    );
};

export default memo(MyOa);
