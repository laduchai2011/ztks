import { memo, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { useLazyGetZaloOaListWith2FkQuery } from '@src/redux/query/zaloRTK';
import { AccountInformationField } from '@src/dataStruct/account';
import { ZaloAppField, ZaloOaField } from '@src/dataStruct/zalo';
import { setData_toastMessage, set_isLoading, set_selectedOa } from '@src/redux/slice/Note';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { SEE_MORE } from '@src/const/text';
import { getCookie, setCookie } from '@src/utility/cookie';
import { OA_KEY } from '@src/const/key';

const OaList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const accountInformation: AccountInformationField | undefined = useSelector(
        (state: RootState) => state.AppSlice.accountInformation
    );
    const zaloApp: ZaloAppField | undefined = useSelector((state: RootState) => state.AppSlice.zaloApp);
    const selectedOa: ZaloOaField | undefined = useSelector((state: RootState) => state.NoteSlice.selectedOa);
    const list_element = useRef<HTMLDivElement | null>(null);
    const [isShow, setIsShow] = useState<boolean>(false);
    const [page, setPage] = useState<number>(1);
    const size: number = 5;
    const [zaloOaList, setZaloOaList] = useState<ZaloOaField[]>([]);
    const [total, setTotal] = useState<number>(0);
    const [getZaloOaListWith2Fk] = useLazyGetZaloOaListWith2FkQuery();

    useEffect(() => {
        if (!accountInformation || !zaloApp) return;
        dispatch(set_isLoading(true));
        getZaloOaListWith2Fk({
            page: page,
            size: size,
            zaloAppId: zaloApp.id,
            accountId: accountInformation.addedById || -1,
        })
            .then((res) => {
                const resData = res.data;
                if (resData?.isSuccess && resData.data) {
                    if (page === 1) {
                        setZaloOaList(resData.data.items);
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
                        message: 'Lấy danh sách zalo-oa KHÔNG thành công !',
                    })
                );
            })
            .finally(() => {
                dispatch(set_isLoading(false));
            });
    }, [dispatch, accountInformation, getZaloOaListWith2Fk, page, zaloApp]);

    useEffect(() => {
        const selected_oa_cookie = getCookie(OA_KEY.SELECTED_OA);
        if (!selected_oa_cookie) return;
        const selected_oa_js = JSON.parse(selected_oa_cookie) as ZaloOaField;
        let isExist: boolean = false;

        for (let i: number = 0; i < zaloOaList.length; i++) {
            if (zaloOaList[i].id === selected_oa_js.id) {
                isExist = true;
                break;
            }
        }

        if (isExist) {
            dispatch(set_selectedOa(selected_oa_js));
        }
    }, [dispatch, zaloOaList]);

    useEffect(() => {
        if (!list_element.current) return;
        const listElement = list_element.current;

        if (isShow) {
            listElement.classList.add(style.show);
        } else {
            listElement.classList.remove(style.show);
        }
    }, [isShow]);

    const handleShowDown = () => {
        setIsShow(true);
    };

    const handleShowUp = () => {
        setIsShow(false);
    };

    const handleSelected = (item: ZaloOaField) => {
        setCookie(OA_KEY.SELECTED_OA, JSON.stringify(item), 365);
        dispatch(set_selectedOa(item));
    };

    const handleSeeMore = () => {
        setPage((prev) => prev + 1);
    };

    const list_oa = zaloOaList.map((item) => {
        return (
            <div onClick={() => handleSelected(item)} key={item.id}>
                {item.oaName}
            </div>
        );
    });

    return (
        <div className={style.parent}>
            <div className={style.selected}>
                <div>{selectedOa?.oaName}</div>
                <div>
                    {!isShow && <HiChevronDown onClick={() => handleShowDown()} size={25} />}
                    {isShow && <HiChevronUp onClick={() => handleShowUp()} size={25} />}
                </div>
            </div>
            <div className={style.list} ref={list_element}>
                <div>{list_oa}</div>
                <div>{zaloOaList.length < total && <div onClick={() => handleSeeMore()}>{SEE_MORE}</div>}</div>
            </div>
        </div>
    );
};

export default memo(OaList);
