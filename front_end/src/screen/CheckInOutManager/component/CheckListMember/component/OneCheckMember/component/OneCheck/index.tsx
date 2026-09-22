import { FC, memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { handleSrcImage, avatarnull } from '@src/utility/string';
import { timeAgoSmart } from '@src/utility/time';
import { Account_Field } from '@src/data_struct/account';
import { Check_In_Out_Field, Check_In_Out_Inspect_Field, Check_In_Out_Enum } from '@src/data_struct/check_in_out';
import { Create_Check_In_Out_Inspect_Body_Field } from '@src/data_struct/check_in_out/body';
import {
    useLazy_get_Check_In_Out_Inspect_With_Fk_Query,
    use_create_Check_In_Out_Inspect_Mutation,
} from '@src/redux/query/check_in_out_RTK';
import { useLazy_get_Account_With_Id_Query } from '@src/redux/query/account_RTK';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { set__is_loading, set__data__toast_message } from '@src/redux/slice/Check_In_Out_Manager';

const OneCheck: FC<{ data: Check_In_Out_Field }> = ({ data }) => {
    const dispatch = useDispatch<AppDispatch>();
    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);

    const [is_inspect, set__is_inspect] = useState<boolean | null>(null);
    const [check_in_out_inspect, set__check_in_out_inspect] = useState<Check_In_Out_Inspect_Field | null>(null);
    const [inspect_account, set__inspect_account] = useState<Account_Field | null>(null);

    const [content, set__content] = useState<string>('');

    const [get_Check_In_Out_Inspect_With_Fk] = useLazy_get_Check_In_Out_Inspect_With_Fk_Query();
    const [get_Account_With_Id] = useLazy_get_Account_With_Id_Query();
    const [create_Check_In_Out_Inspect] = use_create_Check_In_Out_Inspect_Mutation();

    useEffect(() => {
        get_Check_In_Out_Inspect_With_Fk({ check_in_out_id: data.id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__check_in_out_inspect(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [get_Check_In_Out_Inspect_With_Fk, data.id]);

    useEffect(() => {
        if (!check_in_out_inspect) return;
        get_Account_With_Id({ id: check_in_out_inspect.account_id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__inspect_account(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [check_in_out_inspect, get_Account_With_Id]);

    const handle_Slected_Inspect = (is: boolean) => {
        if (is_inspect === is) {
            return style.selected;
        }
        return '';
    };

    const handle_Inspect = (is: boolean) => {
        set__is_inspect(is);
    };

    const handle_Content = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        set__content(value);
    };

    const handleAgree = () => {
        if (!account) return;
        if (is_inspect === null) {
            dispatch(
                set__data__toast_message({
                    type: messageType_enum.ERROR,
                    message: 'Vui lòng chọn (Duyệt) hoặc (Không duyệt) !',
                })
            );
            return;
        }

        const create_check_in_out_inspect_body: Create_Check_In_Out_Inspect_Body_Field = {
            content: content.trim(),
            is_pass: is_inspect,
            check_in_out_id: data.id,
            account_id: '',
        };

        dispatch(set__is_loading(true));
        create_Check_In_Out_Inspect(create_check_in_out_inspect_body)
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__check_in_out_inspect(res_data.data);
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.SUCCESS,
                            message: 'Gửi duyệt (không duyệt) thành công !',
                        })
                    );
                } else {
                    dispatch(
                        set__data__toast_message({
                            type: messageType_enum.NORMAL,
                            message: 'Gửi duyệt (không duyệt) KHÔNG thành công !',
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
            .finally(() => dispatch(set__is_loading(false)));
    };

    const handle_Check_Type_Color = () => {
        switch (data.type) {
            case Check_In_Out_Enum.IN:
                return style.inColor;

            case Check_In_Out_Enum.OUT:
                return style.outColor;

            default:
                return '';
        }
    };

    const handle_Inspect_Color = () => {
        if (!check_in_out_inspect) {
            return '';
        }
        switch (check_in_out_inspect.is_pass) {
            case true:
                return style.pass;

            case false:
                return style.notPass;

            default:
                return '';
        }
    };

    return (
        <div className={`${style.parent} ${handle_Inspect_Color()}`}>
            <div className={style.check}>
                <div>
                    <div className={handle_Check_Type_Color()}>{data.type}</div>
                    <div className={handle_Check_Type_Color()}>{data.note}</div>
                </div>
                <div>
                    <img src={handleSrcImage(data.image || '')} alt="" />
                </div>
                <div>
                    <div>{timeAgoSmart(data.create_time)}</div>
                </div>
            </div>
            <div className={style.inspect}>
                {!check_in_out_inspect && (
                    <div className={style.createInspect}>
                        <div>
                            <input value={content} onChange={(e) => handle_Content(e)} placeholder="Ghi chú" />
                        </div>
                        <div>
                            <div className={handle_Slected_Inspect(true)} onClick={() => handle_Inspect(true)}>
                                Duyệt
                            </div>
                            <div className={handle_Slected_Inspect(false)} onClick={() => handle_Inspect(false)}>
                                Không duyệt
                            </div>
                        </div>
                        <div>
                            <div onClick={() => handleAgree()}>Đồng ý</div>
                        </div>
                    </div>
                )}
                {inspect_account && check_in_out_inspect && (
                    <div className={style.getInspect}>
                        <div>
                            <img
                                src={inspect_account.avatar ? handleSrcImage(inspect_account.avatar) : avatarnull}
                                alt="avatar"
                            />
                        </div>
                        <div>
                            <div>{`${inspect_account.first_name} ${inspect_account.last_name}`}</div>
                        </div>
                        <div>
                            <div>{check_in_out_inspect.is_pass ? 'Duyệt' : 'Không duyệt'}</div>
                        </div>
                        <div>
                            <div>{check_in_out_inspect.content}</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default memo(OneCheck);
