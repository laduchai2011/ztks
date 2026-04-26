import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT, EDIT_REGISTER_POST } from '@src/const/text';
import { setData_toastMessage, set_isLoading, setIsShow_editRegisterPostDialog } from '@src/redux/slice/RegisterPost';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { AccountInformationField } from '@src/dataStruct/account';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { RegisterPostField } from '@src/dataStruct/post';
import { useEditRegisterPostMutation } from '@src/redux/query/postRTK';
import { useLazyGetZaloOaListWith2FkQuery } from '@src/redux/query/zaloRTK';

const EditNote = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);
    const isShow: boolean = useSelector((state: RootState) => state.RegisterPostSlice.editRegisterPostDialog.isShow);
    const registerPost: RegisterPostField | undefined = useSelector(
        (state: RootState) => state.RegisterPostSlice.editRegisterPostDialog.registerPost
    );
    const accountInformation: AccountInformationField | undefined = useSelector(
        (state: RootState) => state.AppSlice.accountInformation
    );

    const [name, setName] = useState<string>('');
    const [selectedZaloOa, setSelectedZaloOa] = useState<ZaloOaField | undefined>(undefined);
    const [zaloOaList, setZaloOaList] = useState<ZaloOaField[]>([]);

    const [getZaloOaListWith2Fk] = useLazyGetZaloOaListWith2FkQuery();
    const [editRegisterPost] = useEditRegisterPostMutation();

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
        if (!registerPost) return;

        const zaloOaId = registerPost.zaloOaId;

        for (let i: number = 0; i < zaloOaList.length; i++) {
            if (zaloOaId === zaloOaList[i].id) {
                setSelectedZaloOa(zaloOaList[i]);
                break;
            }
        }

        setName(registerPost.name);
    }, [registerPost, zaloOaList]);

    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleClose = () => {
        dispatch(setIsShow_editRegisterPostDialog(false));
    };

    const handleAgree = () => {};

    const handleSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);

        const selected = zaloOaList.find((item) => item.id === id);
        setSelectedZaloOa(selected);
    };

    useEffect(() => {
        if (!accountInformation || !zaloApp) return;
        dispatch(set_isLoading(true));
        getZaloOaListWith2Fk({
            page: 1,
            size: 50,
            zaloAppId: zaloApp.id,
            accountId: accountInformation.addedById || -1,
        })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    setZaloOaList(resData.data.items);
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
    }, [dispatch, accountInformation, getZaloOaListWith2Fk, zaloApp]);

    const list_oa = zaloOaList.map((item) => {
        return (
            <option value={item.id} key={item.id}>
                {item.oaName}
            </option>
        );
    });

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.content}>
                        <div>{EDIT_REGISTER_POST}</div>
                        <div>
                            <input value={name} onChange={(e) => handleName(e)} placeholder="Đặt tên dễ nhớ !" />
                        </div>
                        <div>
                            <div>
                                <div>Chọn OA</div>
                                <select value={selectedZaloOa?.id ?? ''} onChange={(e) => handleSelection(e)}>
                                    <option value="">-- Rỗng --</option>
                                    {list_oa}
                                </select>
                            </div>
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

export default memo(EditNote);
