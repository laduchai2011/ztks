import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@src/redux';
import { useLazy_get_Zns_Template_With_Id_Query } from '@src/redux/query/zalo_RTK';
import { set__data__toast_message, set__is_loading } from '@src/redux/slice/Zns_Detail';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { Account_Field } from '@src/data_struct/account';
import { Zns_Template_Field } from '@src/data_struct/zalo';
import { handleSrcImage, formatMoney } from '@src/utility/string';

const OverView = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { id } = useParams<{ id: string }>();

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);

    const [is_show, set__is_show] = useState<boolean>(false);
    const [zns_template, set__zns_template] = useState<Zns_Template_Field | undefined>(undefined);
    const [pre_view, set__pre_view] = useState<string | undefined>(undefined);
    const [parameters, set__parameters] = useState<string[]>(['']);

    const [get_Zns_Template_With_Id] = useLazy_get_Zns_Template_With_Id_Query();

    useEffect(() => {
        if (!zns_template) return;
        set__parameters(JSON.parse(zns_template.data_fields));
        set__pre_view(handleSrcImage(JSON.parse(zns_template.images)[0]));
    }, [zns_template]);

    useEffect(() => {
        if (!account) return;
        if (!id) return;

        dispatch(set__is_loading(true));
        get_Zns_Template_With_Id({ id: id, account_id: account.id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__zns_template(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
                dispatch(set__data__toast_message({ type: messageType_enum.ERROR, message: 'Đã có lỗi xảy ra !' }));
            })
            .finally(() => {
                dispatch(set__is_loading(false));
            });
    }, [account, id, get_Zns_Template_With_Id, dispatch]);

    const handle_Is_Show = () => {
        set__is_show(!is_show);
    };

    const handle_Is_Show_Style = () => {
        if (is_show) {
            return style.show;
        } else {
            return '';
        }
    };

    const paramter_list = parameters.map((item, index) => {
        return <div key={index}>{item}</div>;
    });

    return (
        <div className={style.parent}>
            <div className={`${style.content} ${handle_Is_Show_Style()}`}>
                <div className={style.temId}>{zns_template?.tem_id}</div>
                <img className={style.image} src={pre_view} alt="" />
                <div className={style.fieldsContainer}>
                    <div>Những trường dữ liệu</div>
                    <div>{paramter_list}</div>
                </div>
                <div className={style.cost}>
                    <div>
                        <div>Số điện thoại</div>
                        <div>{formatMoney(zns_template?.phone_cost ?? '')}</div>
                    </div>
                    <div>
                        <div>UID</div>
                        <div>{formatMoney(zns_template?.uid_cost ?? '')}</div>
                    </div>
                </div>
            </div>
            <div className={`${style.btn} ${handle_Is_Show_Style()}`} onClick={() => handle_Is_Show()}>
                {is_show ? 'Thu gọn' : 'Mở rộng'}
            </div>
        </div>
    );
};

export default memo(OverView);
