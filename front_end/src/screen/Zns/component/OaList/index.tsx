import { memo, useState, useRef, useEffect } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { useLazy_get_Zalo_Oa_List_With_2_Fk_Query } from '@src/redux/query/zalo_RTK';
import { Account_Information_Field } from '@src/data_struct/account';
import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import { set__data__toast_message, set__is_loading, set__selected_oa } from '@src/redux/slice/Zns';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { SEE_MORE } from '@src/const/text';
import { get_Cookie, set_Cookie } from '@src/utility/cookie';
import { OA_KEY } from '@src/const/key';

const OaList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const list_element = useRef<HTMLDivElement | null>(null);

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const zalo_app: Zalo_App_Field | undefined = useSelector((state: RootState) => state.App_Slice.zalo_app);
    const selected_oa: Zalo_Oa_Field | undefined = useSelector((state: RootState) => state.Zns_Slice.selected_oa);

    const [is_show, set__is_show] = useState<boolean>(false);
    const [page, set__page] = useState<number>(1);
    const size: number = 5;
    const [zalo_oa_list, set__zalo_oa_list] = useState<Zalo_Oa_Field[]>([]);
    const [total, set__total] = useState<number>(0);

    const [get_Zalo_Oa_List_With_2_Fk] = useLazy_get_Zalo_Oa_List_With_2_Fk_Query();

    useEffect(() => {
        if (!account_information || !zalo_app) return;
        dispatch(set__is_loading(true));
        get_Zalo_Oa_List_With_2_Fk({
            page: page,
            size: size,
            zalo_app_id: zalo_app.id,
            account_id: account_information.added_by_id || '',
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    if (page === 1) {
                        set__zalo_oa_list(res_data.data.items);
                    } else {
                        set__zalo_oa_list((prev) => [...prev, ...(res_data.data?.items ?? [])]);
                    }

                    set__total(res_data.data.total_count);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(
                    set__data__toast_message({
                        type: messageType_enum.ERROR,
                        message: 'Lấy danh sách zalo-oa KHÔNG thành công !',
                    })
                );
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    }, [dispatch, account_information, get_Zalo_Oa_List_With_2_Fk, page, zalo_app]);

    useEffect(() => {
        const selected_oa_cookie = get_Cookie(OA_KEY.SELECTED_OA);
        if (!selected_oa_cookie) return;
        const selected_oa_js = JSON.parse(selected_oa_cookie) as Zalo_Oa_Field;
        let is_exist: boolean = false;

        for (let i: number = 0; i < zalo_oa_list.length; i++) {
            if (zalo_oa_list[i].id === selected_oa_js.id) {
                is_exist = true;
                break;
            }
        }

        if (is_exist) {
            dispatch(set__selected_oa(selected_oa_js));
        }
    }, [dispatch, zalo_oa_list]);

    useEffect(() => {
        if (!list_element.current) return;
        const listElement = list_element.current;

        if (is_show) {
            listElement.classList.add(style.show);
        } else {
            listElement.classList.remove(style.show);
        }
    }, [is_show]);

    const handle_Show_Down = () => {
        set__is_show(true);
    };

    const handle_Show_Up = () => {
        set__is_show(false);
    };

    const handle_Selected = (item: Zalo_Oa_Field) => {
        set_Cookie(OA_KEY.SELECTED_OA, JSON.stringify(item), 365);
        dispatch(set__selected_oa(item));
    };

    const handle_See_More = () => {
        set__page((prev) => prev + 1);
    };

    const list_oa = zalo_oa_list.map((item) => {
        return (
            <div onClick={() => handle_Selected(item)} key={item.id}>
                {item.oa_name}
            </div>
        );
    });

    return (
        <div className={style.parent}>
            <div className={style.selected}>
                <div>{selected_oa?.oa_name}</div>
                <div>
                    {!is_show && <HiChevronDown onClick={() => handle_Show_Down()} size={25} />}
                    {is_show && <HiChevronUp onClick={() => handle_Show_Up()} size={25} />}
                </div>
            </div>
            <div className={style.list} ref={list_element}>
                <div>{list_oa}</div>
                {zalo_oa_list.length < total && (
                    <div>
                        <div onClick={() => handle_See_More()}>{SEE_MORE}</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(OaList);
