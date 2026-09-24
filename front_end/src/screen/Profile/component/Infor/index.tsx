import { memo, useState, useEffect } from 'react';
import style from './style.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@src/redux';
import { avatarnull } from '@src/utility/string';
import {
    Account_Field,
    Account_Information_Field,
    account_type_enum,
    account_type_type,
    Recommend_Field,
} from '@src/data_struct/account';
import { Create_Account_Information_Body_Field } from '@src/data_struct/account/body';
import { ADMIN, MEMBER } from '@src/const/text';
import { Selected_Type_Field } from './type';
import axiosInstance from '@src/api/axiosInstance';
import { My_Response_Field } from '@src/data_struct/response';
import { set__is_loading, set__data__toast_message, set__is_show__edit_infor_dialog } from '@src/redux/slice/Profile';
import { set__account_information } from '@src/redux/slice/App';
import { messageType_enum } from '@src/component/ToastMessage/type';
import { IoAddCircleOutline } from 'react-icons/io5';
import { IoIosEye, IoIosEyeOff } from 'react-icons/io';
import { GoDotFill } from 'react-icons/go';
import { useLazy_get_My_Recommend_Query } from '@src/redux/query/account_RTK';
import { handleSrcImage } from '@src/utility/string';

const Infor = () => {
    const dispatch = useDispatch<AppDispatch>();
    const account: Account_Field | undefined = useSelector((state: RootState) => state.App_Slice.account);
    const account_information: Account_Information_Field | undefined = useSelector(
        (state: RootState) => state.App_Slice.account_information
    );

    const [account_type, set__account_type] = useState<account_type_type | undefined>(undefined);
    const [selected_type, set__selected_type] = useState<Selected_Type_Field | null>(null);
    const [is_show_id, set__is_show_id] = useState<boolean>(false);
    const [recommend, set__recommend] = useState<Recommend_Field | undefined>(undefined);
    const [is_show_recomment_code, set__is_show_recomment_code] = useState<boolean>(false);
    const [avatar_url, set__avatar_url] = useState<string>(avatarnull);
    const max_count = 3;

    const [get_My_Recommend] = useLazy_get_My_Recommend_Query();

    useEffect(() => {
        if (account_information?.account_type === account_type_enum.ADMIN) {
            set__account_type(account_type_enum.ADMIN);
        }
        if (account_information?.account_type === account_type_enum.MEMBER) {
            set__account_type(account_type_enum.MEMBER);
        }
    }, [account_information]);

    useEffect(() => {
        const _avatar_url = account?.avatar ? handleSrcImage(account.avatar) : avatarnull;
        set__avatar_url(_avatar_url);
    }, [account]);

    const handle_Create_Account_Information = async (
        create_account_information_body: Create_Account_Information_Body_Field
    ) => {
        try {
            const response = await axiosInstance.post<My_Response_Field<Account_Information_Field>>(
                '/service__account/mutate/create_account_information',
                create_account_information_body
            );
            return response.data;
        } catch (error) {
            console.error('Error creating account information:', error);
            throw error;
        }
    };

    const handle_Selected = (type: account_type_enum) => {
        if (!account) return;

        if (selected_type === null) {
            set__selected_type({
                type,
                count: 0,
            });
        } else {
            if (selected_type.type === type) {
                if (selected_type.count < 3) {
                    set__selected_type({
                        type,
                        count: selected_type.count + 1,
                    });
                } else {
                    // sumit type to BE
                    dispatch(set__is_loading(true));
                    handle_Create_Account_Information({ account_type: type, account_id: '' })
                        .then((res) => {
                            const res_data = res;
                            if (res_data?.is_success && res_data.data) {
                                dispatch(set__account_information(res_data.data));
                                dispatch(
                                    set__data__toast_message({
                                        type: messageType_enum.SUCCESS,
                                        message: res.message || 'Tạo thông tin tài khoản thành công !',
                                    })
                                );
                            } else {
                                dispatch(
                                    set__data__toast_message({
                                        type: messageType_enum.ERROR,
                                        message: res.message || 'Tạo thông tin tài khoản KHÔNG thành công !',
                                    })
                                );
                            }
                        })
                        .catch((err) => {
                            console.error('Error creating account information:', err);
                            dispatch(
                                set__data__toast_message({
                                    type: messageType_enum.ERROR,
                                    message: 'Đã có lỗi xảy ra',
                                })
                            );
                        })
                        .finally(() => {
                            dispatch(set__is_loading(false));
                        });
                }
            } else {
                set__selected_type({
                    type,
                    count: 0,
                });
            }
        }
    };

    const handle_Text_Account_Type = (type: account_type_enum) => {
        if (type === account_type_enum.ADMIN) {
            return ADMIN;
        }
        if (type === account_type_enum.MEMBER) {
            return MEMBER;
        }
        return 'undefined';
    };

    const handle_Show_Edit = () => {
        dispatch(set__is_show__edit_infor_dialog(true));
    };

    const handle_Is_Show_Id = (is_show: boolean) => {
        set__is_show_id(is_show);
    };

    useEffect(() => {
        if (!account) return;
        get_My_Recommend({ account_id: account.id })
            .then((res) => {
                const res_data = res.data;
                if (res_data?.is_success && res_data.data) {
                    set__recommend(res_data.data);
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [account, get_My_Recommend]);

    const handle_Is_Show_Recomment_Code = (is_show: boolean) => {
        set__is_show_recomment_code(is_show);
    };

    return (
        <div className={style.parent}>
            <div className={style.avatarContainer}>
                <img className={style.avatar} src={avatar_url} alt="avatar" />
                <IoAddCircleOutline onClick={() => handle_Show_Edit()} size={20} />
            </div>
            <div className={style.name}>{`${account?.first_name} ${account?.last_name}`}</div>
            {account_type && <div className={style.admin}>{handle_Text_Account_Type(account_type)}</div>}
            {!account_type && (
                <div className={style.selectType}>
                    <div className={style.text}>Chọn loại tài khoản ( chỉ chọn 1 lần duy nhất )</div>
                    <div className={style.selections}>
                        <div onClick={() => handle_Selected(account_type_enum.ADMIN)}>
                            {handle_Text_Account_Type(account_type_enum.ADMIN)}
                        </div>
                        <div onClick={() => handle_Selected(account_type_enum.MEMBER)}>
                            {handle_Text_Account_Type(account_type_enum.MEMBER)}
                        </div>
                    </div>
                    {selected_type && (
                        <div
                            className={style.text1}
                        >{`Còn ${max_count - selected_type.count} lần chọn ( ${handle_Text_Account_Type(selected_type.type)} )`}</div>
                    )}
                </div>
            )}
            <div className={style.idContainer}>
                <div>
                    <div>
                        {!is_show_id && (
                            <div>
                                <GoDotFill size={15} />
                                <GoDotFill size={15} />
                                <GoDotFill size={15} />
                                <GoDotFill size={15} />
                                <GoDotFill size={15} />
                            </div>
                        )}
                        {is_show_id && <div>{account?.id}</div>}
                    </div>
                    <div>
                        {!is_show_id && <IoIosEye onClick={() => handle_Is_Show_Id(true)} size={20} />}
                        {is_show_id && <IoIosEyeOff onClick={() => handle_Is_Show_Id(false)} size={20} />}
                    </div>
                </div>
            </div>
            <div className={style.recommendContainer}>
                <div>
                    <div>
                        {!is_show_recomment_code && (
                            <div>
                                <GoDotFill size={15} />
                                <GoDotFill size={15} />
                                <GoDotFill size={15} />
                                <GoDotFill size={15} />
                                <GoDotFill size={15} />
                            </div>
                        )}
                        {is_show_recomment_code && <div>{recommend?.my_code}</div>}
                    </div>
                    <div>
                        {!is_show_recomment_code && (
                            <IoIosEye onClick={() => handle_Is_Show_Recomment_Code(true)} size={20} />
                        )}
                        {is_show_recomment_code && (
                            <IoIosEyeOff onClick={() => handle_Is_Show_Recomment_Code(false)} size={20} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default memo(Infor);
