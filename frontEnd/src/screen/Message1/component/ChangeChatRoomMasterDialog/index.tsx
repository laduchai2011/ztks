import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';
import { CLOSE, AGREE, EXIT, CHANGE_CHAT_ROOM_MASTER } from '@src/const/text';
import { setData_toastMessage, set_isLoading, setIsShow_changeChatRoomMasterDialog } from '@src/redux/slice/MessageV1';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { avatarnull } from '@src/utility/string';
import { useLazyGetMembersQuery } from '@src/redux/query/accountRTK';
import { AccountInformationField } from '@src/dataStruct/account';

const ChangeChatRoomMasterDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const accountInformation: AccountInformationField | undefined = useSelector(
        (state: RootState) => state.AppSlice.accountInformation
    );
    const isShow: boolean = useSelector((state: RootState) => state.MessageV1Slice.changeChatRoomMasterDialog.isShow);

    const [searchedAccountId, setSearchedAccountId] = useState<string>('');

    const [getMembers] = useLazyGetMembersQuery();

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

    const handleSearchedAccountId = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchedAccountId(e.target.value);
    };

    useEffect(() => {
        if (!accountInformation?.addedById) return;

        const searchedAccountId_cp = searchedAccountId.trim();

        dispatch(set_isLoading(true));
        getMembers({
            page: 1,
            size: 2,
            accountId: accountInformation.addedById,
            searchedAccountId:
                searchedAccountId_cp.length > 0 && !isNaN(Number(searchedAccountId_cp))
                    ? Number(searchedAccountId_cp)
                    : undefined,
        })
            .then((res) => {
                const resData = res.data;
                console.log('getMembers', resData);
                if (resData?.isSuccess && resData.data) {
                    // setMembers(resData.data.items);
                    // setPage(2);
                    // setHasMore(resData.data.items.length === size);
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
            .finally(() => dispatch(set_isLoading(false)));
    }, [getMembers, accountInformation, searchedAccountId, dispatch]);

    const handleClose = () => {
        dispatch(setIsShow_changeChatRoomMasterDialog(false));
    };

    const handleAgree = () => {};

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handleClose()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.header}>{CHANGE_CHAT_ROOM_MASTER}</div>
                    <div className={style.filter}>
                        <div>
                            <input
                                value={searchedAccountId}
                                onChange={(e) => handleSearchedAccountId(e)}
                                placeholder="Nhập id thành viên"
                            />
                            <CiSearch size={20} />
                        </div>
                    </div>
                    <div className={style.list}>
                        <div className={style.one}>
                            <img src={avatarnull} alt="" />
                            <div>name</div>
                            <input type="checkbox" />
                        </div>
                        <div className={style.one}>
                            <img src={avatarnull} alt="" />
                            <div>name</div>
                            <input type="checkbox" />
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

export default memo(ChangeChatRoomMasterDialog);
