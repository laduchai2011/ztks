import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CiSearch } from 'react-icons/ci';
import { CLOSE, AGREE, EXIT, CHANGE_CHAT_ROOM_MASTER, SEE_MORE } from '@src/const/text';
import { setData_toastMessage, set_isLoading, setIsShow_changeChatRoomMasterDialog } from '@src/redux/slice/MessageV1';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { avatarnull } from '@src/utility/string';
import { useLazyGetMembersQuery } from '@src/redux/query/accountRTK';
import { useChangeChatRoomMasterMutation } from '@src/redux/query/chatRoomRTK';
import { AccountField, AccountInformationField } from '@src/dataStruct/account';

const ChangeChatRoomMasterDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const { id } = useParams<{ id: string }>();

    const accountInformation: AccountInformationField | undefined = useSelector(
        (state: RootState) => state.AppSlice.accountInformation
    );
    const isShow: boolean = useSelector((state: RootState) => state.MessageV1Slice.changeChatRoomMasterDialog.isShow);

    const [searchedAccountId, setSearchedAccountId] = useState<string>('');
    const [selectedMember, setSelectedMember] = useState<AccountField | undefined>(undefined);
    const [members, setMembers] = useState<AccountField[]>([]);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [isSearch, setIsSearch] = useState<boolean>(true);
    const size = 10;

    const [getMembers] = useLazyGetMembersQuery();
    const [changeChatRoomMaster] = useChangeChatRoomMasterMutation();

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
        if (!isSearch) return;

        const searchedAccountId_cp = searchedAccountId.trim();

        dispatch(set_isLoading(true));
        getMembers({
            page: page,
            size: size,
            accountId: accountInformation.addedById,
            searchedAccountId:
                searchedAccountId_cp.length > 0 && !isNaN(Number(searchedAccountId_cp))
                    ? Number(searchedAccountId_cp)
                    : undefined,
        })
            .then((res) => {
                const resData = res.data;

                if (resData?.isSuccess && resData.data) {
                    if (page === 1) {
                        setMembers(resData.data.items);
                    } else {
                        setMembers((prev) => [...prev, ...(resData.data?.items || [])]);
                    }

                    setHasMore(resData.data.items.length === size);
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
                setIsSearch(false);
            });
    }, [getMembers, accountInformation, searchedAccountId, dispatch, page, isSearch]);

    const handleClose = () => {
        dispatch(setIsShow_changeChatRoomMasterDialog(false));
    };

    const handleSeeMore = () => {
        if (!hasMore) return;
        setPage((prev) => prev + 1);
    };

    const handleSelected = (e: React.ChangeEvent<HTMLInputElement>, item: AccountField) => {
        const checked = e.target.checked;
        if (checked) {
            setSelectedMember(item);
        }
    };

    const handleSearch = () => {
        setIsSearch(true);
    };

    const handleAgree = () => {
        if (!selectedMember) return;
        if (!id) return;
        if (!accountInformation) return;

        dispatch(set_isLoading(true));
        changeChatRoomMaster({
            chatRoomId: Number(id),
            newAccountId: selectedMember.id,
            accountId: accountInformation.accountId,
        })
            .then((res) => {
                const resData = res.data;
                console.log('changeChatRoomMaster', resData);
                if (resData?.isSuccess && resData.data) {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.SUCCESS,
                            message: 'Thay đổi thành công !',
                        })
                    );
                } else {
                    dispatch(
                        setData_toastMessage({
                            type: messageType_enum.ERROR,
                            message: 'Thay đổi không thành công !',
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

    const list_member = members.map((item) => {
        const isSelected = selectedMember?.id === item.id ? true : false;

        if (item.id === accountInformation?.accountId) {
            return;
        }

        return (
            <div className={style.one} key={item.id}>
                <img src={item.avatar ?? avatarnull} alt="" />
                <div>{item.firstName + ' ' + item.lastName}</div>
                <input checked={isSelected} onChange={(e) => handleSelected(e, item)} type="checkbox" />
            </div>
        );
    });

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
                            <CiSearch onClick={() => handleSearch()} size={20} />
                        </div>
                    </div>
                    <div className={style.list}>{list_member}</div>
                    <div className={style.seeMore}>
                        {hasMore && <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>}
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
