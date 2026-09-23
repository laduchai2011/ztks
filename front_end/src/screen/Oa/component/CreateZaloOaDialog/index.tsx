import { memo, useEffect, useRef, useState } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { IoMdClose } from 'react-icons/io';
import { CLOSE, AGREE, EXIT } from '@src/const/text';
import {
    set__is_loading,
    set__data__toast_message,
    set__is_show__create_oa,
    set__new_zalo_oa__create_oa,
} from '@src/redux/slice/Oa';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { Account_Field } from '@src/data_struct/account';
import { Zalo_App_Field } from '@src/data_struct/zalo';
import { use_create_Zalo_Oa_Mutation } from '@src/redux/query/zalo_RTK';

const CreateZaloOaDialog = () => {
    const dispatch = useDispatch<AppDispatch>();
    const parent_element = useRef<HTMLDivElement | null>(null);

    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const zalo_app: Zalo_App_Field | undefined = useSelector((state: RootState) => state.App_Slice.zalo_app);
    const is_show: boolean = useSelector((state: RootState) => state.Oa_Slice.create_oa.is_show);

    const [label, set__label] = useState<string>('');
    const [oa_id, set__oa_id] = useState<string>('');
    const [oa_name, set__oa_name] = useState<string>('');
    const [oa_secret, set__oa_secret] = useState<string>('');

    const [create_Zalo_Oa] = use_create_Zalo_Oa_Mutation();

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

    const handle_Close = () => {
        dispatch(set__is_show__create_oa(false));
    };

    const handle_Label = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__label(e.target.value);
    };

    const handle_Oa_Id = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__oa_id(e.target.value);
    };

    const handle_Oa_Name = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__oa_name(e.target.value);
    };

    const handle_Oa_Secret = (e: React.ChangeEvent<HTMLInputElement>) => {
        set__oa_secret(e.target.value);
    };

    const handle_Agree = async () => {
        if (!account) return;
        if (!zalo_app) return;

        const label_t = label.trim();
        if (label_t.length === 0) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Nhãn không được để trống !',
                })
            );
            return;
        }

        const oa_id_t = oa_id.trim();
        if (oa_id_t.length === 0) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Đinh danh oa không được để trống !',
                })
            );
            return;
        }

        const oa_name_t = oa_name.trim();
        if (oa_name_t.length === 0) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Tên oa không được để trống !',
                })
            );
            return;
        }

        const oa_secret_t = oa_secret.trim();
        if (oa_secret_t.length === 0) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Khóa bí mật oa không được để trống !',
                })
            );
            return;
        }

        dispatch(set__is_loading(true));
        create_Zalo_Oa({
            label: label_t,
            oa_id: oa_id_t,
            oa_name: oa_name_t,
            oa_secret: oa_secret_t,
            zalo_app_id: zalo_app.id,
            account_id: account.id,
        })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    dispatch(set__new_zalo_oa__create_oa(res_data.data));
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.SUCCESS,
                            message: 'Tạo thành công !',
                        })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.ERROR,
                            message: 'Tạo không thành công !',
                        })
                    );
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
    };

    return (
        <div className={style.parent} ref={parent_element}>
            <div className={style.main}>
                <div className={style.closeContainer}>
                    <IoMdClose onClick={() => handle_Close()} size={25} title={CLOSE} />
                </div>
                <div className={style.header}>Tạo OA mới</div>
                <div className={style.contentContainer}>
                    <div>
                        <div>
                            <div>Nhãn</div>
                            <input value={label} onChange={(e) => handle_Label(e)} placeholder="Nhãn" />
                        </div>
                    </div>
                    <div>
                        <div>
                            <div>Định danh oa</div>
                            <input value={oa_id} onChange={(e) => handle_Oa_Id(e)} placeholder="Định danh oa" />
                        </div>
                    </div>
                    <div>
                        <div>
                            <div>Tên oa</div>
                            <input value={oa_name} onChange={(e) => handle_Oa_Name(e)} placeholder="Tên oa" />
                        </div>
                    </div>
                    <div>
                        <div>
                            <div>Khóa bí mật</div>
                            <input value={oa_secret} onChange={(e) => handle_Oa_Secret(e)} placeholder="Khóa bí mật" />
                        </div>
                    </div>
                </div>
                <div className={style.buttonContainer}>
                    <button onClick={() => handle_Agree()}>{AGREE}</button>
                    <button onClick={() => handle_Close()}>{EXIT}</button>
                </div>
            </div>
        </div>
    );
};

export default memo(CreateZaloOaDialog);
