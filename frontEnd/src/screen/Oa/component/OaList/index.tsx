import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import MyOa from './component/MyOa';
import { SEE_MORE } from '@src/const/text';
import { useGetZaloOaListWith2FkQuery } from '@src/redux/query/zaloRTK';
import { AccountInformationField } from '@src/dataStruct/account';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { setData_toastMessage, set_isLoading } from '@src/redux/slice/Oa';
import { messageType_enum } from '@src/component/ToastMessage/type';

const OaList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const accountInformation: AccountInformationField | undefined = useSelector(
        (state: RootState) => state.AppSlice.accountInformation
    );
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);
    const [page, setPage] = useState<number>(1);
    const size: number = 5;
    const [zaloOaList, setZaloOaList] = useState<ZaloOaField[]>([]);
    const [total, setTotal] = useState<number>(0);

    const {
        data: data_zaloOaList,
        // isFetching,
        isLoading: isLoading_zaloOaList,
        isError: isError_zaloOaList,
        error: error_zaloOaList,
    } = useGetZaloOaListWith2FkQuery(
        { page: page, size: size, zaloAppId: zaloApp?.id || -1, accountId: accountInformation?.addedById || -1 },
        { skip: accountInformation === undefined }
    );
    useEffect(() => {
        if (isError_zaloOaList && error_zaloOaList) {
            console.error(error_zaloOaList);
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Lấy danh sách zalo-oa KHÔNG thành công !',
                })
            );
        }
    }, [dispatch, isError_zaloOaList, error_zaloOaList]);
    useEffect(() => {
        dispatch(set_isLoading(isLoading_zaloOaList));
    }, [dispatch, isLoading_zaloOaList]);
    useEffect(() => {
        const resData = data_zaloOaList;
        if (resData?.isSuccess && resData.data) {
            setZaloOaList((prev) => [...prev, ...(resData.data?.items ?? [])]);
            setTotal(resData.data.totalCount);
        }
    }, [data_zaloOaList]);

    const handleSeeMore = () => {
        setPage((prev) => prev + 1);
    };

    const list_oa = zaloOaList.map((item, index) => {
        return <MyOa key={item.id} index={index + 1} data={item} />;
    });

    return (
        <div className={style.parent}>
            <div className={style.total}>{`Bạn có ${total} OA`}</div>
            <div className={style.list}>{list_oa}</div>
            <div className={style.btnContainer}>
                {zaloOaList.length < total && (
                    <div className={style.btn} onClick={() => handleSeeMore()}>
                        {SEE_MORE}
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(OaList);
