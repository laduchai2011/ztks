import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT } from '@src/const/text';
import { set__data__toast_message, set__is_loading, set__is_show__send_template_dialog } from '@src/redux/slice/Zns';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { Account_Field } from '@src/data_struct/account';
import {
    Zalo_App_Field,
    Zalo_Oa_Field,
    Zns_Template_Field,
    Zns_Message_Enum,
    Zns_Message_Type,
} from '@src/data_struct/zalo';
import { Create_Zns_Message_Body_Field } from '@src/data_struct/zalo/body';
import { use_create_Zns_Message_Mutation } from '@src/redux/query/zalo_RTK';
import { handleSrcImage, formatPhone } from '@src/utility/string';

const SendTemplateDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const zns_template: Zns_Template_Field | undefined = useSelector(
        (state: RootState) => state.Zns_Slice.send_template_dialog.zns_template
    );

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const zalo_app: Zalo_App_Field | undefined = useSelector((state: RootState) => state.App_Slice.zalo_app);
    const selected_oa: Zalo_Oa_Field | undefined = useSelector((state: RootState) => state.Zns_Slice.selected_oa);
    const is_show: boolean = useSelector((state: RootState) => state.Zns_Slice.send_template_dialog.is_show);

    const [tem_id, set__tem_id] = useState<string>('');
    const [pre_view, set__pre_view] = useState<string | undefined>(undefined);
    const [parameters, set__parameters] = useState<string[]>(['']);
    const [values, set__values] = useState<string[]>([]);
    const [selected_value, set__selected_value] = useState<string>('');
    const [selected_option, set__selected_option] = useState<Zns_Message_Type>(Zns_Message_Enum.PHONE);
    const [zns_template1, set__zns_template1] = useState<Zns_Template_Field | undefined>(undefined);

    const [create_Zns_Message] = use_create_Zns_Message_Mutation();

    useEffect(() => {
        if (!zns_template) return;
        set__zns_template1(zns_template);
    }, [zns_template]);

    useEffect(() => {
        if (!zns_template1) return;
        set__tem_id(zns_template1.tem_id);
        set__parameters(JSON.parse(zns_template1.data_fields));
        set__pre_view(handleSrcImage(JSON.parse(zns_template1.images)[0]));
    }, [zns_template1]);

    useEffect(() => {
        for (let i: number = 0; i < parameters.length; i++) {
            set__values((prev) => [...prev, '']);
        }
    }, [parameters]);

    useEffect(() => {
        if (!parent_element.current) return;
        const parentElement = parent_element.current;

        if (is_show) {
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
    }, [is_show]);

    const handle_Values = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const new_value = e.target.value;
        const values_cp = [...values];
        values_cp[index] = new_value;
        set__values(values_cp);
    };

    const handle_Selected_Option = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value as Zns_Message_Type;
        set__selected_option(value);
    };

    const handle_Selected_Value = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__selected_value(value);
    };

    const handle_Close = () => {
        dispatch(set__is_show__send_template_dialog(false));
    };

    const handle_Agree = async () => {
        if (!zalo_app) return;
        if (!account) return;
        if (!selected_oa) return;
        if (!zns_template) return;

        const data: Record<string, string | Record<string, string>> = {};

        if (selected_option === Zns_Message_Enum.PHONE) {
            data[selected_option] = formatPhone(selected_value);
        } else {
            data[selected_option] = selected_value;
        }

        data['template_id'] = tem_id;
        data['tracking_id'] = 'tracking_id';

        const template_data: Record<string, string> = {};

        for (let i: number = 0; i < parameters.length; i++) {
            template_data[parameters[i]] = values[i];
        }

        data['template_data'] = template_data;

        const create_zns_message_body: Create_Zns_Message_Body_Field = {
            type: selected_option,
            data: JSON.stringify(data),
            cost: -1,
            zns_template_id: zns_template.id,
            account_id: account.id,
            zalo_app: zalo_app,
            zalo_oa: selected_oa,
        };

        if (selected_option === Zns_Message_Enum.PHONE) {
            create_zns_message_body.cost = zns_template.phone_cost;
        } else if (selected_option === Zns_Message_Enum.HASH_PHONE) {
            create_zns_message_body.cost = zns_template.uid_cost;
        }

        dispatch(set__is_loading(true));
        create_Zns_Message(create_zns_message_body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(
                        set__data__toast_message({ type: messageType_enum.SUCCESS, message: 'Gửi tin thành công !' })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Gửi tin không thành công !',
                        })
                    );
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

    const paramter_list = parameters.map((item, index) => {
        return (
            <div className={style.fieldContainer} key={index}>
                <div>{item}</div>
                <input value={values[index] ?? ''} onChange={(e) => handle_Values(e, index)} />
            </div>
        );
    });

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.contentContainer}>
                    <div className={style.imgContainer}>{pre_view && <img src={pre_view} alt="" />}</div>
                    <div className={style.sendVia}>
                        <select onChange={(e) => handle_Selected_Option(e)} value={selected_option}>
                            <option value={Zns_Message_Enum.PHONE}>Số điện thoại</option>
                            <option value={Zns_Message_Enum.UID}>Định danh</option>
                        </select>
                        <input value={selected_value} onChange={(e) => handle_Selected_Value(e)} />
                    </div>
                    <div className={style.fieldsContainer}>{paramter_list}</div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handle_Agree()}>{AGREE}</button>
                    <button onClick={() => handle_Close()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(SendTemplateDialog);
