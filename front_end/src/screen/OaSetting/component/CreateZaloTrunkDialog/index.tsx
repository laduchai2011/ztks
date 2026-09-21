import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT } from '@src/const/text';
import { set_isLoading, setData_toastMessage, setIsShow_createZaloTrunkDialog } from '@src/redux/slice/OaSetting';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { CreateZaloTrunkBodyField } from '@src/dataStruct/callAgent/body';
import { useCreateZaloTrunkMutation } from '@src/redux/query/callAgentRTK';
import { messageType_enum } from '@src/component/ToastMessage/type';

const CreateZaloTrunkDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const isShow: boolean = useSelector((state: RootState) => state.OaSettingSlice.createZaloTrunkDialog.isShow);
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);
    const zaloOa: ZaloOaField | undefined = useSelector(
        (state: RootState) => state.OaSettingSlice.createZaloTrunkDialog.zaloOa
    );

    const [createZaloTrunk] = useCreateZaloTrunkMutation();

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
        dispatch(setIsShow_createZaloTrunkDialog(false));
    };

    const handleAgree = () => {
        if (!zaloApp) return;
        if (!zaloOa) return;

        const createZaloTrunkBody: CreateZaloTrunkBodyField = {
            trunkCode: '',
            appId: zaloApp.appId,
            oaId: zaloOa.oaId,
            port: '',
            accountId: -1,
        };

        dispatch(set_isLoading(true));
        createZaloTrunk(createZaloTrunkBody)
            .then((res) => {
                const resData = res.data;
                console.log(11111, resData);
                if (resData?.isSuccess && resData.data) {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: 'Kích hoạt thành công !',
                        })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Kích hoạt thất bại !',
                        })
                    );
                }
            })
            .catch((err) => console.error(err))
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.header}>Kích hoạt gọi điện</div>
                <div className={style.contentContainer}>Bấm đồng ý để kích hoạt</div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handleAgree()}>{AGREE}</button>
                    <button onClick={() => handleClose()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(CreateZaloTrunkDialog);
