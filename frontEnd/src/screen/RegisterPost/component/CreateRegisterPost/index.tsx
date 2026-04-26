import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoCloseOutline } from 'react-icons/io5';
import { CREATE_REGISTER_POST } from '@src/const/text';
import { useLazyGetZaloOaListWith2FkQuery } from '@src/redux/query/zaloRTK';
import { useCreateRegisterPostMutation } from '@src/redux/query/postRTK';
import { AccountInformationField } from '@src/dataStruct/account';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { set_isLoading, setData_toastMessage, set_newRegisterPostOfCreate } from '@src/redux/slice/RegisterPost';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { RegisterPostTypeEnum } from '@src/dataStruct/post';

const CreateRegisterPost = () => {
    const dispatch = useDispatch<AppDispatch>();

    const accountInformation: AccountInformationField | undefined = useSelector(
        (state: RootState) => state.AppSlice.accountInformation
    );
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);

    const [isShowParent, setIsShowParent] = useState(false);
    const [isDisplayBtn, setIsDisplayBtn] = useState(true);
    const [isShowBtn, setIsShowBtn] = useState(true);
    const [isDisplayIcon, setIsDisplayIcon] = useState(false);
    const [isShowIcon, setIsShowIcon] = useState(false);
    const [selectedZaloOa, setSelectedZaloOa] = useState<ZaloOaField | undefined>(undefined);
    const [zaloOaList, setZaloOaList] = useState<ZaloOaField[]>([]);
    const [name, setName] = useState<string>('');

    const [getZaloOaListWith2Fk] = useLazyGetZaloOaListWith2FkQuery();
    const [createRegisterPost] = useCreateRegisterPostMutation();

    const handleHBtn = () => {
        setIsShowParent(true);
        setIsShowBtn(false);
        setTimeout(() => {
            setIsDisplayBtn(false);
        }, 300);
        setIsDisplayIcon(true);
        setTimeout(() => {
            setIsShowIcon(true);
        }, 10);
    };

    const handleHIcon = () => {
        setIsShowParent(false);
        setIsShowIcon(false);
        setTimeout(() => {
            setIsDisplayIcon(false);
        }, 300);
        setIsDisplayBtn(true);
        setTimeout(() => {
            setIsShowBtn(true);
        }, 10);
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

    const handleName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const id = Number(e.target.value);

        const selected = zaloOaList.find((item) => item.id === id);
        setSelectedZaloOa(selected);
    };

    const list_oa = zaloOaList.map((item) => {
        return (
            <option value={item.id} key={item.id}>
                {item.oaName}
            </option>
        );
    });

    const handleCreate = () => {
        const name_t = name.trim();
        if (name_t.length === 0) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Tên không được để trống !',
                })
            );
            return;
        }

        if (!selectedZaloOa) {
            dispatch(
                setData_toastMessage({
                    type: messageType_enum.ERROR,
                    message: 'Vui lòng chọn oa !',
                })
            );
            return;
        }

        dispatch(set_isLoading(true));
        createRegisterPost({
            name: name_t,
            type: RegisterPostTypeEnum.FREE,
            zaloOaId: selectedZaloOa.id,
            accountId: -1,
        })
            .then((res) => {
                const resData = res.data;
                console.log('createRegisterPost', resData);
                if (resData?.isSuccess && resData.data) {
                    dispatch(set_newRegisterPostOfCreate(resData.data));
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: 'Tạo thành công !',
                        })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Tạo không thành công !',
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
        <div className={`${style.parent} ${isShowParent ? style.show : ''}`}>
            <div className={style.header}>
                <div
                    className={`${style.btn} ${isDisplayBtn ? style.display : ''} ${isShowBtn ? style.show : ''}`}
                    onClick={() => handleHBtn()}
                >
                    {CREATE_REGISTER_POST}
                </div>
                <IoCloseOutline
                    className={`${style.icon} ${isDisplayIcon ? style.display : ''} ${isShowIcon ? style.show : ''}`}
                    onClick={() => handleHIcon()}
                    size={25}
                />
            </div>
            <div className={style.content}>
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
                <div>
                    <div onClick={() => handleCreate()}>{CREATE_REGISTER_POST}</div>
                </div>
            </div>
        </div>
    );
};

export default memo(CreateRegisterPost);
