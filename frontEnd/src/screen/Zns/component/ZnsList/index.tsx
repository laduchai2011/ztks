import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { SEE_MORE } from '@src/const/text';
import { ZaloOaField, ZnsTemplateField } from '@src/dataStruct/zalo';
import { AccountField } from '@src/dataStruct/account';
import {
    setData_toastMessage,
    set_isLoading,
    set_newZnsTemplate,
    setIsShow_editZnsTemplateDialog,
    setZnsTemplate_editZnsTemplateDialog,
    setIsShow_sendTemplateDialog,
    setZnsTemplate_sendTemplateDialog,
} from '@src/redux/slice/Zns';
import { useLazyGetZnsTemplatesQuery } from '@src/redux/query/zaloRTK';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { handleSrcImage } from '@src/utility/string';
import { route_enum } from '@src/router/type';

const ZnsList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const selectedOa: ZaloOaField | undefined = useSelector((state: RootState) => state.ZnsSlice.selectedOa);
    const newZnsTemplate: ZnsTemplateField | undefined = useSelector(
        (state: RootState) => state.ZnsSlice.newZnsTemplate
    );
    const newZnsTemplates: ZnsTemplateField[] = useSelector((state: RootState) => state.ZnsSlice.newZnsTemplates);

    const [hasMore, setHasMore] = useState<boolean>(true);
    const [nextPage, setNextPage] = useState<number>(1);
    const size = 5;
    const [znsTemplates, setZnsTemplates] = useState<ZnsTemplateField[]>([]);

    const [getZnsTemplates] = useLazyGetZnsTemplatesQuery();

    useEffect(() => {
        if (!newZnsTemplate) return;
        setZnsTemplates((prev) => [newZnsTemplate, ...prev]);
        dispatch(set_newZnsTemplate(undefined));
    }, [newZnsTemplate, dispatch]);

    useEffect(() => {
        if (!account) return;
        if (!selectedOa) return;

        dispatch(set_isLoading(true));
        getZnsTemplates({
            page: 1,
            size: size,
            offset: 0,
            zaloOaId: selectedOa.id,
            accountId: account.id,
        })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setZnsTemplates(resData.data.items);
                    setNextPage(2);
                    setHasMore(resData.data.items.length === size);
                } else {
                    setHasMore(false);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(setData_toastMessage({ type: messageType_enum.ERROR, message: 'Đã có lỗi xảy ra !' }));
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    }, [account, selectedOa, dispatch, getZnsTemplates]);

    const handleSeeMore = () => {
        if (!account) return;
        if (!selectedOa) return;

        dispatch(set_isLoading(true));
        getZnsTemplates({
            page: nextPage,
            size: size,
            offset: newZnsTemplates.length,
            zaloOaId: selectedOa.id,
            accountId: account.id,
        })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setZnsTemplates((prev) => [...prev, ...(resData.data?.items || [])]);
                    setNextPage((prev) => prev + 1);
                    setHasMore(resData.data.items.length === size);
                } else {
                    setHasMore(false);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(setData_toastMessage({ type: messageType_enum.ERROR, message: 'Đã có lỗi xảy ra !' }));
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    };

    const handleOpenSend = (item: ZnsTemplateField) => {
        dispatch(setIsShow_sendTemplateDialog(true));
        dispatch(setZnsTemplate_sendTemplateDialog(item));
    };

    const handleOpenEdit = (item: ZnsTemplateField) => {
        dispatch(setIsShow_editZnsTemplateDialog(true));
        dispatch(setZnsTemplate_editZnsTemplateDialog(item));
    };

    const handleSeeDetail = (item: ZnsTemplateField) => {
        navigate(route_enum.ZNS_DETAIL + '/' + `${item.id}`);
    };

    const znsTemplate_list = znsTemplates.map((item, index) => {
        const images = JSON.parse(item.images);
        const url = images.length > 0 ? handleSrcImage(images[0]) : '';
        return (
            <div className={style.oneZnsTemplate} key={index}>
                <img src={url} onClick={() => handleSeeDetail(item)} alt="" />
                <div>
                    <div onClick={() => handleOpenSend(item)}>Gửi tin với mẫu này</div>
                    <div onClick={() => handleOpenEdit(item)}>Chỉnh sửa</div>
                </div>
            </div>
        );
    });

    return (
        <div className={style.parent}>
            <div className={style.list}>{znsTemplate_list}</div>
            <div className={style.seeMore}>{hasMore && <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(ZnsList);
