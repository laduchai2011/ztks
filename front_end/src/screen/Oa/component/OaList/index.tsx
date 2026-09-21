import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import MyOa from './component/MyOa';
import { SEE_MORE } from '@src/const/text';
import { useLazyGetZaloOaListWith2FkQuery } from '@src/redux/query/zaloRTK';
import { AccountInformationField } from '@src/dataStruct/account';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { setData_toastMessage, set_isLoading, setIsShow_createOa, setNewZaloOa_createOa } from '@src/redux/slice/Oa';
import { messageType_enum } from '@src/component/ToastMessage/type';

const OaList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const accountInformation: AccountInformationField | undefined = useSelector(
        (state: RootState) => state.AppSlice.accountInformation
    );
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);
    const newZaloOa: ZaloOaField | undefined = useSelector((state: RootState) => state.OaSlice.createOa.newZaloOa);
    const [page, setPage] = useState<number>(1);
    const size: number = 10;
    const [zaloOaList, setZaloOaList] = useState<ZaloOaField[]>([]);
    const [total, setTotal] = useState<number>(0);

    const [getZaloOaListWith2Fk] = useLazyGetZaloOaListWith2FkQuery();

    useEffect(() => {
        if (!zaloApp) return;
        if (!accountInformation) return;
        dispatch(set_isLoading(true));
        getZaloOaListWith2Fk({
            page: page,
            size: size,
            zaloAppId: zaloApp.id,
            accountId: accountInformation?.addedById || -1,
        })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    if (page === 1) {
                        setZaloOaList(resData.data?.items ?? []);
                    } else {
                        setZaloOaList((prev) => [...prev, ...(resData.data?.items ?? [])]);
                    }

                    setTotal(resData.data.totalCount);
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
    }, [zaloApp, accountInformation, page, getZaloOaListWith2Fk, dispatch]);

    useEffect(() => {
        if (newZaloOa) {
            setZaloOaList((prev) => [...[newZaloOa], ...prev]);
            dispatch(setNewZaloOa_createOa(undefined));
        }
    }, [newZaloOa, dispatch]);

    const handleOpenCreateOa = () => {
        dispatch(setIsShow_createOa(true));
    };

    const handleSeeMore = () => {
        setPage((prev) => prev + 1);
    };

    const list_oa = zaloOaList.map((item, index) => {
        return <MyOa key={item.id} index={index + 1} data={item} />;
    });

    return (
        <div className={style.parent}>
            <div className={style.total}>
                <div>
                    <div>{`Bạn có ${total} OA`}</div>
                    <div onClick={() => handleOpenCreateOa()}>Tạo Oa</div>
                </div>
            </div>
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
