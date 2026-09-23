import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import MyOa from './component/MyOa';
import { SEE_MORE } from '@src/const/text';
import { useLazy_get_Zalo_Oa_List_With_2_Fk_Query } from '@src/redux/query/zalo_RTK';
import { Account_Information_Field } from '@src/data_struct/account';
import { Zalo_App_Field, Zalo_Oa_Field } from '@src/data_struct/zalo';
import {
    set__data__toast_message,
    set__is_loading,
    set__is_show__create_oa,
    set__new_zalo_oa__create_oa,
} from '@src/redux/slice/Oa';
import { messageType_enum } from '@src/component/ToastMessage/type';

const OaList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const zalo_app: Zalo_App_Field | undefined = useSelector((state: RootState) => state.App_Slice.zalo_app);
    const new_zalo_oa: Zalo_Oa_Field | undefined = useSelector(
        (state: RootState) => state.Oa_Slice.create_oa.new_zalo_oa
    );

    const [page, set__page] = useState<number>(1);
    const size: number = 10;
    const [zalo_oa_list, set__zalo_oa_list] = useState<Zalo_Oa_Field[]>([]);
    const [total, set__total] = useState<number>(0);

    const [get_Zalo_Oa_List_With_2_Fk] = useLazy_get_Zalo_Oa_List_With_2_Fk_Query();

    useEffect(() => {
        if (!zalo_app) return;
        if (!account_information) return;
        dispatch(set__is_loading(true));
        get_Zalo_Oa_List_With_2_Fk({
            page: page,
            size: size,
            zalo_app_id: zalo_app.id,
            account_id: account_information?.added_by_id || '',
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    if (page === 1) {
                        set__zalo_oa_list(res_data.data?.items ?? []);
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
                        message: 'Đã có lỗi xảy ra !',
                    })
                );
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    }, [zalo_app, account_information, page, get_Zalo_Oa_List_With_2_Fk, dispatch]);

    useEffect(() => {
        if (new_zalo_oa) {
            set__zalo_oa_list((prev) => [...[new_zalo_oa], ...prev]);
            dispatch(set__new_zalo_oa__create_oa(undefined));
        }
    }, [new_zalo_oa, dispatch]);

    const handle_Open_Create_Oa = () => {
        dispatch(set__is_show__create_oa(true));
    };

    const handle_See_More = () => {
        set__page((prev) => prev + 1);
    };

    const list_oa = zalo_oa_list.map((item, index) => {
        return <MyOa key={item.id} index={index + 1} data={item} />;
    });

    return (
        <div className={style.parent}>
            <div className={style.total}>
                <div>
                    <div>{`Bạn có ${total} OA`}</div>
                    <div onClick={() => handle_Open_Create_Oa()}>Tạo Oa</div>
                </div>
            </div>
            <div className={style.list}>{list_oa}</div>
            <div className={style.btnContainer}>
                {zalo_oa_list.length < total && (
                    <div className={style.btn} onClick={() => handle_See_More()}>
                        {SEE_MORE}
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(OaList);
