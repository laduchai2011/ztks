import { memo, useEffect, useState } from 'react';
import style from './style.module.scss';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { SEE_MORE } from '@src/const/text';
import { Zalo_Oa_Field, Zns_Template_Field } from '@src/data_struct/zalo';
import { Account_Information_Field } from '@src/data_struct/account';
import {
    set__data__toast_message,
    set__is_loading,
    set__new_zns_template,
    set__is_show__edit_zns_template_dialog,
    set__zns_template__edit_zns_template_dialog,
    set__is_show__send_template_dialog,
    set__zns_template__send_template_dialog,
} from '@src/redux/slice/Zns';
import { useLazy_get_Zns_Templates_Query } from '@src/redux/query/zalo_RTK';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { handleSrcImage } from '@src/utility/string';
import { route_enum } from '@src/router/type';

const ZnsList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );
    const selected_oa: Zalo_Oa_Field | undefined = useSelector((state: RootState) => state.Zns_Slice.selected_oa);
    const new_zns_template: Zns_Template_Field | undefined = useSelector(
        (state: RootState) => state.Zns_Slice.new_zns_template
    );
    const new_zns_templates: Zns_Template_Field[] = useSelector(
        (state: RootState) => state.Zns_Slice.new_zns_templates
    );

    const [has_more, set__has_more] = useState<boolean>(true);
    const [next_page, set__next_page] = useState<number>(1);
    const size = 5;
    const [zns_templates, set__zns_templates] = useState<Zns_Template_Field[]>([]);

    const [get_Zns_Templates] = useLazy_get_Zns_Templates_Query();

    useEffect(() => {
        if (!new_zns_template) return;
        set__zns_templates((prev) => [new_zns_template, ...prev]);
        dispatch(set__new_zns_template(undefined));
    }, [new_zns_template, dispatch]);

    useEffect(() => {
        if (!account_information) return;
        if (!selected_oa) return;

        dispatch(set__is_loading(true));
        get_Zns_Templates({
            page: 1,
            size: size,
            offset: 0,
            zalo_oa_id: selected_oa.id,
            account_id: account_information.added_by_id || '',
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__zns_templates(res_data.data.items);
                    set__next_page(2);
                    set__has_more(res_data.data.items.length === size);
                } else {
                    set__has_more(false);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(set__data__toast_message({ type: messageType_enum.ERROR, message: 'Đã có lỗi xảy ra !' }));
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    }, [account_information, selected_oa, dispatch, get_Zns_Templates]);

    const handle_See_More = () => {
        if (!account_information) return;
        if (!selected_oa) return;

        dispatch(set__is_loading(true));
        get_Zns_Templates({
            page: next_page,
            size: size,
            offset: new_zns_templates.length,
            zalo_oa_id: selected_oa.id,
            account_id: account_information.added_by_id || '',
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__zns_templates((prev) => [...prev, ...(res_data.data?.items || [])]);
                    set__next_page((prev) => prev + 1);
                    set__has_more(res_data.data.items.length === size);
                } else {
                    set__has_more(false);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(set__data__toast_message({ type: messageType_enum.ERROR, message: 'Đã có lỗi xảy ra !' }));
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    };

    const handle_Open_Send = (item: Zns_Template_Field) => {
        dispatch(set__is_show__send_template_dialog(true));
        dispatch(set__zns_template__send_template_dialog(item));
    };

    const handle_Open_Edit = (item: Zns_Template_Field) => {
        dispatch(set__is_show__edit_zns_template_dialog(true));
        dispatch(set__zns_template__edit_zns_template_dialog(item));
    };

    const handle_See_Detail = (item: Zns_Template_Field) => {
        navigate(route_enum.ZNS_DETAIL + '/' + `${item.id}`);
    };

    const zns_template_list = zns_templates.map((item, index) => {
        const images = JSON.parse(item.images);
        const url = images.length > 0 ? handleSrcImage(images[0]) : '';
        return (
            <div className={style.oneZnsTemplate} key={index}>
                <img src={url} onClick={() => handle_See_Detail(item)} alt="" />
                <div>
                    <div onClick={() => handle_Open_Send(item)}>Gửi tin với mẫu này</div>
                    <div onClick={() => handle_Open_Edit(item)}>Chỉnh sửa</div>
                </div>
            </div>
        );
    });

    return (
        <div className={style.parent}>
            <div className={style.list}>{zns_template_list}</div>
            <div className={style.seeMore}>{has_more && <div onClick={() => handle_See_More()}>{SEE_MORE}</div>}</div>
        </div>
    );
};

export default memo(ZnsList);
