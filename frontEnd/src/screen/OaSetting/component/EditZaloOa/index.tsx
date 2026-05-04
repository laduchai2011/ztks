import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT } from '@src/const/text';
import {
    set_isLoading,
    setData_toastMessage,
    setIsShow_editZaloOa,
    setNewZaloOa_editZaloOa,
} from '@src/redux/slice/OaSetting';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { AccountField } from '@src/dataStruct/account';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { useEditZaloOaMutation } from '@src/redux/query/zaloRTK';

const CreateZaloOaDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const account: AccountField | undefined = useSelector((state: RootState) => state.AppSlice.account);
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);
    const isShow: boolean = useSelector((state: RootState) => state.OaSettingSlice.editZaloOa.isShow);
    const zaloOa: ZaloOaField | undefined = useSelector((state: RootState) => state.OaSettingSlice.editZaloOa.zaloOa);

    const [label, setLabel] = useState<string>('');
    const [oaId, setOaId] = useState<string>('');
    const [oaName, setOaName] = useState<string>('');
    const [oaSecret, setOaSecret] = useState<string>('');

    const [editZaloOa] = useEditZaloOaMutation();

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

    useEffect(() => {
        if (!zaloOa) return;
        setLabel(zaloOa.label);
        setOaId(zaloOa.oaId);
        setOaName(zaloOa.oaName);
        setOaSecret(zaloOa.oaSecret);
    }, [zaloOa]);

    const handleClose = () => {
        dispatch(setIsShow_editZaloOa(false));
    };

    const handleLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLabel(e.target.value);
    };

    const handleOaId = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOaId(e.target.value);
    };

    const handleOaName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOaName(e.target.value);
    };

    const handleOaSecret = (e: React.ChangeEvent<HTMLInputElement>) => {
        setOaSecret(e.target.value);
    };

    const handleAgree = async () => {
        if (!account) return;
        if (!zaloApp) return;
        if (!zaloOa) return;

        const label_t = label.trim();
        if (label_t.length === 0) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Nhãn không được để trống !',
                })
            );
            return;
        }

        const oaId_t = oaId.trim();
        if (oaId_t.length === 0) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Đinh danh oa không được để trống !',
                })
            );
            return;
        }

        const oaName_t = oaName.trim();
        if (oaName_t.length === 0) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Tên oa không được để trống !',
                })
            );
            return;
        }

        const oaSecret_t = oaSecret.trim();
        if (oaSecret_t.length === 0) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Khóa bí mật oa không được để trống !',
                })
            );
            return;
        }

        dispatch(set_isLoading(true));
        editZaloOa({
            id: zaloOa.id,
            label: label_t,
            oaId: oaId_t,
            oaName: oaName_t,
            oaSecret: oaSecret_t,
            zaloAppId: zaloApp.id,
            accountId: account.id,
        })
            .then((res) => {
                const resData = res.data;
                console.log('createZaloOa', resData);
                if (resData?.isSuccess && resData.data) {
                    dispatch(setNewZaloOa_editZaloOa(resData.data));
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: 'Chỉnh sửa thành công !',
                        })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Chỉnh sửa không thành công !',
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

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.header}>{`Chỉnh sửa zalo oa ${zaloOa?.oaName}`}</div>
                <div className={style.contentContainer}>
                    <div>
                        <div>
                            <div>Nhãn</div>
                            <input value={label} onChange={(e) => handleLabel(e)} placeholder="Nhãn" />
                        </div>
                    </div>
                    <div>
                        <div>
                            <div>Định danh oa</div>
                            <input value={oaId} onChange={(e) => handleOaId(e)} placeholder="Định danh oa" />
                        </div>
                    </div>
                    <div>
                        <div>
                            <div>Tên oa</div>
                            <input value={oaName} onChange={(e) => handleOaName(e)} placeholder="Tên oa" />
                        </div>
                    </div>
                    <div>
                        <div>
                            <div>Khóa bí mật</div>
                            <input value={oaSecret} onChange={(e) => handleOaSecret(e)} placeholder="Khóa bí mật" />
                        </div>
                    </div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handleAgree()}>{AGREE}</button>
                    <button onClick={() => handleClose()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(CreateZaloOaDialog);
