import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { SEE_MORE } from '@src/const/text';
import { ZaloOaField, ZnsTemplateField } from '@src/dataStruct/zalo';
import { AccountField } from '@src/dataStruct/account';
import {
    setData_toastMessage,
    set_isLoading,
    setIsShow_editZnsTemplateDialog,
    setZnsTemplate_editZnsTemplateDialog,
} from '@src/redux/slice/Zns';
import { useLazyGetZnsTemplatesQuery } from '@src/redux/query/zaloRTK';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { handleSrcImage } from '@src/utility/string';

const ZnsList = () => {
    const dispatch = useDispatch<AppDispatch>();

    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const selectedOa: ZaloOaField | undefined = useSelector((state: RootState) => state.ZnsSlice.selectedOa);

    const [znsTemplates, setZnsTemplates] = useState<ZnsTemplateField[]>([]);

    const [getZnsTemplates] = useLazyGetZnsTemplatesQuery();

    useEffect(() => {
        if (!account) return;
        if (!selectedOa) return;

        dispatch(set_isLoading(true));
        getZnsTemplates({ page: 1, size: 5, offset: 0, zaloOaId: selectedOa.id, accountId: account.id })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setZnsTemplates(resData.data.items);
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: resData?.message ?? 'Lấy mẫu không thành công !',
                        })
                    );
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

    const handleOpenEdit = (item: ZnsTemplateField) => {
        dispatch(setIsShow_editZnsTemplateDialog(true));
        dispatch(setZnsTemplate_editZnsTemplateDialog(item));
    };

    const znsTemplate_list = znsTemplates.map((item, index) => {
        const images = JSON.parse(item.images);
        const url = images.length > 0 ? handleSrcImage(images[0]) : '';
        return (
            <div className={style.oneZnsTemplate} key={index}>
                <img src={url} alt="" />
                <div>
                    <div>Gửi tin với mẫu này</div>
                    <div onClick={() => handleOpenEdit(item)}>Chỉnh sửa</div>
                </div>
            </div>
        );
    });

    return (
        <div className={style.parent}>
            <div className={style.list}>{znsTemplate_list}</div>
            <div className={style.seeMore}>
                <div>{SEE_MORE}</div>
            </div>
        </div>
    );
};

export default memo(ZnsList);
